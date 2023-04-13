const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const ToDoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    gmap: { type: JSON },
  },
  { timestamps: true }
);
ToDoSchema.index( { "gmap.geoJson": "2dsphere" } )

export default mongoose.models._things_to_do ||
  mongoose.model("_things_to_do", ToDoSchema,'_things_to_do');
