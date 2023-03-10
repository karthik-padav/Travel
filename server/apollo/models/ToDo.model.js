const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const ToDoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    gmap: { type: JSON },
  },
  { timestamps: true }
);

export default mongoose.models.things_to_do ||
  mongoose.model("things_to_do", ToDoSchema,'things_to_do');
