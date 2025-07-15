import mongoose, { Schema, Types, model } from "mongoose";

export interface IComment {
  _id: Types.ObjectId; // ✅ make this required
  roadmapId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  userEmail: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    roadmapId: {
      type: Schema.Types.ObjectId,
      ref: "RoadmapItem",
      required: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    userEmail: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IComment>("Comment", CommentSchema);
