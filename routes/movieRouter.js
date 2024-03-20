// const MoviePostModel = require("../models/MoviePost.js");
import shuffleArray from "../functions/shuffle.js";
import { Router, json, urlencoded } from "express";
import cors from "cors";
import MoviePostModel from "../models/MoviePost.js";
const movieRouter = Router();
movieRouter.use(json());
movieRouter.use(cors());
movieRouter.use(urlencoded({ extended: true }));

//Date year Validator
const NewYear = new Date().getFullYear();

//All Movies Router
movieRouter.get("/allMovies", async (req, res) => {
  try {
    const data = await MoviePostModel.find({});

    res.status(200).json(shuffleArray(data));
    // console.log(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Top Rated Movies Router
movieRouter.get("/top-rated-movies", async (req, res) => {
  try {
    const data = await MoviePostModel.find({});
    const FilteredData = data.filter((value) => value.Rating >= 8.5);
    res.status(200).json(shuffleArray(FilteredData));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Recent Release Router
movieRouter.get("/recent-release", async (req, res) => {
  try {
    const data = await MoviePostModel.find({});
    const FilteredData = data.filter((value) => {
      return value.ReleaseDate.year >= NewYear - 1;
    });
    res.json(FilteredData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Old Movies Router
movieRouter.get("/old-movies", async (req, res) => {
  try {
    const data = await MoviePostModel.find({});
    const FilteredData = data.filter((value) => {
      return value.ReleaseDate.year < NewYear - 2;
    });
    res.json(FilteredData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default movieRouter;
