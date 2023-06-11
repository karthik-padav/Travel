const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const WeatherSchema = new mongoose.Schema(
  { title: { type: JSON } },
  { timestamps: true }
);

export default mongoose.models.weather ||
  mongoose.model("weather", WeatherSchema, "weather");
