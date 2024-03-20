import MoviePostModel from "../models/MoviePost.js";
import { Router, json, urlencoded } from "express";
import cors from "cors";
const adminRouter = Router();
adminRouter.use(json());
adminRouter.use(cors());
adminRouter.use(urlencoded({ extended: true }));
const GetDataFromPy = async (data) => {
  try {
    const response = await fetch("https://imbd-scraper.vercel.app/getByID", {
      method: "POST",
      body: JSON.stringify({ id: data }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      res.status(400).json({
        success: false,
        message: "Duplicate title found",
        duplicateTitle: true,
      });
    }

    const result = await response.json();
    // console.log(result);
    console.log("200 ok");

    return result;
  } catch (error) {
    console.error("Error Sending data:", error);
  }
};

const CheckDuplication = async (dataTittle) => {
  const existingMovie = await MoviePostModel.findOne({ Tittle: dataTittle });
  return !!existingMovie;
};
//Value from Search Input
adminRouter.post("/adminSearch", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      throw new Error("id is not recevied");
    }
    console.log(id);
    const result = await GetDataFromPy(id);
    // console.log(result);
    //rating value
    // const { ratingValue } = aggregateRating;
    const {
      name,
      genre,
      description,
      image,
      aggregateRating,
      duration,
      director,
      datePublished,
    } = result;
    // const sample = {
    //   name,
    //   genre,
    //   description,
    //   image,
    //   ratingValue: aggregateRating.ratingValue,
    //   duration,
    //   director,
    //   datePublished,
    // };
    // console.log(sample);

    //duration time = Array
    const durationString = duration;
    const match = durationString.match(/PT(\d+H)?(\d+M)?/);
    const hours = match[1] || "0H";
    const minutes = match[2] || "0M";
    const durationArray = [hours, minutes];

    //datevalidation
    const dateArray = datePublished.split("-").map(Number);
    // console.log(dateArray);
    //director
    const directorName = director.map((val, i) => {
      return val.name;
    });
    // console.log(result);

    res.status(200).json({
      success: true,
      message: "Data received successfully",
      imbd$data: {
        name: name,
        genre: genre,
        description: description,
        poster: image,
        ratingValue: aggregateRating.ratingValue,
        durationArray: durationArray,
        directorName: directorName,
        dateArray: dateArray,
      },
    });

    // res.status(200).json({ msg: "hello from AdminRouter", id: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    console.log("Process Finished");
  }
});

//Post Movie To Database
adminRouter.post("/postmovie", async (req, res) => {
  const {
    Tittle,
    Genre,
    Description,
    Duration,
    Director,
    MoviePosters,
    Rating,
    ReleaseDate,
  } = req.body;
  try {
    console.log("entry on try line 128");
    if (await CheckDuplication(Tittle)) {
      throw new Error(401);
    }
    const data = new MoviePostModel({
      Tittle,
      Genre,
      Description,
      Duration,
      Director,
      MoviePosters,
      Rating,
      ReleaseDate,
    });
    const dataToSave = await data.save();
    // console.log(req.body);
    res.status(200).json(`Successfully Posted`);
  } catch (error) {
    if (error.message == 401) {
      res.status(401).json("Duplicate title found");
    } else {
      res.status(400).json(error.message);
    }
  }
});

export default adminRouter;
