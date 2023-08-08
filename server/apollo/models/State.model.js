const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const StateSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.models.state ||
  mongoose.model("state", StateSchema, "state");
