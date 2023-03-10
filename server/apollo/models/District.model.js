const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const DistrictSchema = new mongoose.Schema(
  {
  },
  { timestamps: true }
);

export default mongoose.models.district ||
  mongoose.model("district", DistrictSchema,'district');
