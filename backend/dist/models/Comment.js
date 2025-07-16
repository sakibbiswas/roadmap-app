"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    roadmapId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "RoadmapItem",
        required: true,
    },
    parentCommentId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = (0, mongoose_1.model)("Comment", CommentSchema);
