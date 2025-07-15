import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/api";
import type { CommentType } from "./CommentsList";

interface Props {
  comment: CommentType & { replies?: CommentType[] };
  depth: number;
  allComments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  maxDepth: number;
}

const CommentItem = ({
  comment,
  depth,
  allComments,
  setComments,
  maxDepth,
}: Props) => {
  const { token, email } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isOwner = email === comment.userEmail;

  const handleAddReply = async () => {
    if (!token) return setError("You must be logged in to reply.");
    if (!replyContent.trim()) return setError("Reply cannot be empty.");
    if (replyContent.length > 300) return setError("Reply must be under 300 characters.");

    setError(null);
    setLoading(true);

    const tempId = `temp-reply-${Date.now()}`;
    const newReply: CommentType = {
      _id: tempId,
      roadmapId: comment.roadmapId,
      parentCommentId: comment._id,
      userEmail: email!,
      content: replyContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComments((prev) => [newReply, ...prev]);
    setReplyContent("");
    setShowReply(false);

    try {
      const res = await api.post<CommentType>("/comments", {
        roadmapId: comment.roadmapId,
        parentCommentId: comment._id,
        content: replyContent,
      });
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? res.data : c))
      );
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add reply");
      setComments((prev) => prev.filter((c) => c._id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return setError("You must be logged in to delete comments.");

    setLoading(true);
    setError(null);

    const idsToRemove = new Set<string>();
    const collectIds = (cId: string) => {
      idsToRemove.add(cId);
      allComments.forEach((c) => {
        if (c.parentCommentId === cId) collectIds(c._id);
      });
    };
    collectIds(comment._id);

    const oldComments = [...allComments];
    setComments((prev) => prev.filter((c) => !idsToRemove.has(c._id)));

    try {
      await api.delete(`/comments/${comment._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete comment");
      setComments(oldComments); // revert
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!token) return setError("You must be logged in to edit comments.");
    if (!editContent.trim()) return setError("Comment content cannot be empty.");
    if (editContent.length > 300) return setError("Comment must be under 300 characters.");

    setError(null);
    setLoading(true);

    const oldContent = comment.content;
    setComments((prev) =>
      prev.map((c) => (c._id === comment._id ? { ...c, content: editContent } : c))
    );

    try {
      await api.put(`/comments/${comment._id}`, { content: editContent });
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update comment");
      setComments((prev) =>
        prev.map((c) => (c._id === comment._id ? { ...c, content: oldContent } : c))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white border border-gray-300 rounded-lg p-4 my-3 shadow-sm"
      style={{ marginLeft: depth * 20 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-blue-700 text-sm">
          {comment.userEmail}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-2 py-1 rounded mb-2 text-sm">
          {error}
        </div>
      )}

      {editing ? (
        <>
          <textarea
            className="w-full border border-gray-300 rounded p-2 mb-2"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={300}
            rows={3}
            disabled={loading}
          />
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
              onClick={handleEdit}
              disabled={loading}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              onClick={() => {
                setEditing(false);
                setEditContent(comment.content);
                setError(null);
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
      )}

      <div className="flex gap-3 mt-2 text-sm text-blue-600">
        {depth < maxDepth - 1 && token && (
          <button
            onClick={() => {
              setShowReply((show) => !show);
              setError(null);
            }}
            className="hover:underline"
          >
            {showReply ? "Cancel Reply" : "Reply"}
          </button>
        )}

        {isOwner && !editing && (
          <>
            <button
              onClick={() => {
                setEditing(true);
                setError(null);
              }}
              className="hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="hover:underline text-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {showReply && (
        <div className="mt-3">
          <textarea
            rows={2}
            maxLength={300}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="w-full border border-blue-300 rounded p-2 text-sm"
            disabled={loading}
          />
          <button
            onClick={handleAddReply}
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            {loading ? "Replying..." : "Reply"}
          </button>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              allComments={allComments}
              setComments={setComments}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
