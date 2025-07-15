

// import mongoose from "mongoose";

// const roadmapItemSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   category: { type: String, required: true },
//   status: { type: String, required: true },
//   createdBy: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   upvotes: { type: Number, default: 0 },
//   upvotedBy: { type: [String], default: [] },
// });

// const RoadmapItem = mongoose.model("RoadmapItem", roadmapItemSchema);
// export default RoadmapItem;











import mongoose from "mongoose";

const roadmapItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  status: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: { type: [String], default: [] },
  downvotedBy: { type: [String], default: [] },
});

const RoadmapItem = mongoose.model("RoadmapItem", roadmapItemSchema);
export default RoadmapItem;
