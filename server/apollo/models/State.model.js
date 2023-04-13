const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const StateSchema = new mongoose.Schema(
  {
  },
  { timestamps: true }
);

export default mongoose.models._state ||
  mongoose.model("_state", StateSchema,'_state');
