const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const ToDoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    gmap: {
      geoJson: {
        type: { type: String, default: "Point" },
        coordinates: [{ type: "Number" }],
      },
    },
  },
  { timestamps: true }
);
ToDoSchema.index({ "gmap.geoJson": "2dsphere" });

export default mongoose.models.things_to_do ||
  mongoose.model("things_to_do", ToDoSchema, "things_to_do");
