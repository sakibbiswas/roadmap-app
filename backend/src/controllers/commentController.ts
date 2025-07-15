import { Request, Response } from "express";
import Comment, { IComment } from "../models/Comment";
import { isValidObjectId } from "../validateObjectId";
// import { isValidObjectId } from "../utils/validateObjectId";

export const getComments = async (req: Request, res: Response) => {
  const { roadmapId } = req.query;

  if (!roadmapId || typeof roadmapId !== "string")
    return res.status(400).json({ error: "roadmapId query param is required" });

  if (!isValidObjectId(roadmapId))
    return res.status(400).json({ error: "Invalid roadmapId" });

  try {
    const comments = await Comment.find({ roadmapId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { roadmapId, parentCommentId, content } = req.body;
  const userEmail = req.userEmail;

  if (!userEmail) return res.status(401).json({ error: "Unauthorized" });

  if (!roadmapId || !content)
    return res.status(400).json({ error: "roadmapId and content are required" });

  if (content.length > 300)
    return res.status(400).json({ error: "Content exceeds 300 characters" });

  if (!isValidObjectId(roadmapId))
    return res.status(400).json({ error: "Invalid roadmapId" });

  if (parentCommentId && !isValidObjectId(parentCommentId))
    return res.status(400).json({ error: "Invalid parentCommentId" });

  try {
    const newComment = new Comment({
      roadmapId,
      parentCommentId,
      userEmail,
      content,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const { content } = req.body;
  const userEmail = req.userEmail;

  if (!userEmail) return res.status(401).json({ error: "Unauthorized" });

  if (!content || content.length > 300)
    return res.status(400).json({ error: "Invalid content" });

  if (!isValidObjectId(commentId))
    return res.status(400).json({ error: "Invalid comment ID" });

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userEmail !== userEmail)
      return res.status(403).json({ error: "Forbidden" });

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const userEmail = req.userEmail;

  if (!userEmail) return res.status(401).json({ error: "Unauthorized" });

  if (!isValidObjectId(commentId))
    return res.status(400).json({ error: "Invalid comment ID" });

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userEmail !== userEmail)
      return res.status(403).json({ error: "Forbidden" });

    // ✅ FIXED: Delete comment and nested replies with proper type
    const deleteRecursive = async (id: string) => {
      const replies = await Comment.find({ parentCommentId: id });

      for (const reply of replies as IComment[]) {
        await deleteRecursive(reply._id.toString());
      }

      await Comment.findByIdAndDelete(id);
    };

    await deleteRecursive(commentId);

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
