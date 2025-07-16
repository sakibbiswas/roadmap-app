"use strict";
// import mongoose from "mongoose";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const mongoose_1 = __importDefault(require("mongoose"));
const roadmapItemSchema = new mongoose_1.default.Schema({
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
const RoadmapItem = mongoose_1.default.model("RoadmapItem", roadmapItemSchema);
exports.default = RoadmapItem;
