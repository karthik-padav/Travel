const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const CountrySchema = new mongoose.Schema(
  {
    country_name:String
  },
  { timestamps: true }
);

export default mongoose.models._country ||
  mongoose.model("_country", CountrySchema,'_country');
