const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const DistrictSchema = new mongoose.Schema(
  {
  },
  { timestamps: true }
);

export default mongoose.models._district ||
  mongoose.model("_district", DistrictSchema,'_district');
