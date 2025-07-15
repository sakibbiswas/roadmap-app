import { Schema, model } from "mongoose";
const CommentSchema = new Schema({
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
}, {
    timestamps: true,
});
export default model("Comment", CommentSchema);
