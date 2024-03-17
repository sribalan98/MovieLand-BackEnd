import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ip from "ip";
const app = express();
const ServerIP = ip.address();

//Router Backend Files Path
import movieRouter from "./routes/movieRouter.js";
import adminRouter from "./routes/adminRouter.js";
import CheckRouter from "./routes/checkRouter.js";

//mongoose
dotenv.config();
const { MONGOOSE, PORT, DB_NAME } = process.env;
const DATABASE_URL = MONGOOSE;

app.set("trust proxy", true);
app.use(express.json()); //add new
app.use(express.urlencoded({ extended: true })); //add new

//Routers For Fetch Data
// app.use("/movieland", cors(), router);
app.use(cors());
app.use("/movieland", adminRouter);
app.use("/movieland", movieRouter);
app.use("/movieland", CheckRouter);

mongoose
  .connect(DATABASE_URL + DB_NAME)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(`Error`);
    console.log(error.message);
  });

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
  console.log(`http://${ServerIP}:${PORT}/movieland/`);
});
