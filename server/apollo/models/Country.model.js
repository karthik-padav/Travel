const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const CountrySchema = new mongoose.Schema(
  {
    country_name:String
  },
  { timestamps: true }
);

export default mongoose.models.country ||
  mongoose.model("country", CountrySchema,'country');
