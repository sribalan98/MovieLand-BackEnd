import mongoose from "mongoose";
const MoviePostSchema = new mongoose.Schema({
  Tittle: {
    required: true,
    type: String,
  },
  Genre: {
    required: true,
    type: Array,
  },
  Description: {
    required: true,
    type: String,
  },
  Duration: {
    required: true,
    type: Array,
  },
  Director: {
    required: true,
    type: Array,
  },
  MoviePosters: {
    required: true,
    type: String,
  },
  Rating: {
    required: true,
    type: Number,
  },
  ReleaseDate: {
    required: true,
    type: Object,
  },
});

export default mongoose.model("MoviePost", MoviePostSchema);
