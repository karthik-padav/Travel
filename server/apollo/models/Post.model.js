const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    searchKeyword: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    lastScrappedOn: { type: Date },
    products: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    // updatedAt: { type: Date, default: Date.now },
    // creadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.post || mongoose.model("post", PostSchema);
