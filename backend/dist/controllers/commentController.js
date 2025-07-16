"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.addComment = exports.getComments = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const validateObjectId_1 = require("../validateObjectId");
// import { isValidObjectId } from "../utils/validateObjectId";
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roadmapId } = req.query;
    if (!roadmapId || typeof roadmapId !== "string")
        return res.status(400).json({ error: "roadmapId query param is required" });
    if (!(0, validateObjectId_1.isValidObjectId)(roadmapId))
        return res.status(400).json({ error: "Invalid roadmapId" });
    try {
        const comments = yield Comment_1.default.find({ roadmapId }).sort({ createdAt: -1 });
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});
exports.getComments = getComments;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roadmapId, parentCommentId, content } = req.body;
    const userEmail = req.userEmail;
    if (!userEmail)
        return res.status(401).json({ error: "Unauthorized" });
    if (!roadmapId || !content)
        return res.status(400).json({ error: "roadmapId and content are required" });
    if (content.length > 300)
        return res.status(400).json({ error: "Content exceeds 300 characters" });
    if (!(0, validateObjectId_1.isValidObjectId)(roadmapId))
        return res.status(400).json({ error: "Invalid roadmapId" });
    if (parentCommentId && !(0, validateObjectId_1.isValidObjectId)(parentCommentId))
        return res.status(400).json({ error: "Invalid parentCommentId" });
    try {
        const newComment = new Comment_1.default({
            roadmapId,
            parentCommentId,
            userEmail,
            content,
        });
        yield newComment.save();
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add comment" });
    }
});
exports.addComment = addComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const { content } = req.body;
    const userEmail = req.userEmail;
    if (!userEmail)
        return res.status(401).json({ error: "Unauthorized" });
    if (!content || content.length > 300)
        return res.status(400).json({ error: "Invalid content" });
    if (!(0, validateObjectId_1.isValidObjectId)(commentId))
        return res.status(400).json({ error: "Invalid comment ID" });
    try {
        const comment = yield Comment_1.default.findById(commentId);
        if (!comment)
            return res.status(404).json({ error: "Comment not found" });
        if (comment.userEmail !== userEmail)
            return res.status(403).json({ error: "Forbidden" });
        comment.content = content;
        yield comment.save();
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update comment" });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    const userEmail = req.userEmail;
    if (!userEmail)
        return res.status(401).json({ error: "Unauthorized" });
    if (!(0, validateObjectId_1.isValidObjectId)(commentId))
        return res.status(400).json({ error: "Invalid comment ID" });
    try {
        const comment = yield Comment_1.default.findById(commentId);
        if (!comment)
            return res.status(404).json({ error: "Comment not found" });
        if (comment.userEmail !== userEmail)
            return res.status(403).json({ error: "Forbidden" });
        // ✅ FIXED: Delete comment and nested replies with proper type
        const deleteRecursive = (id) => __awaiter(void 0, void 0, void 0, function* () {
            const replies = yield Comment_1.default.find({ parentCommentId: id });
            for (const reply of replies) {
                yield deleteRecursive(reply._id.toString());
            }
            yield Comment_1.default.findByIdAndDelete(id);
        });
        yield deleteRecursive(commentId);
        res.json({ message: "Comment deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete comment" });
    }
});
exports.deleteComment = deleteComment;
