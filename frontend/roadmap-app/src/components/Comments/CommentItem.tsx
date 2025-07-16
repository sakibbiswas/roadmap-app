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

const CommentItem: React.FC<Props> = ({
  comment,
  depth,
  allComments,
  setComments,
  maxDepth,
}) => {
  const { token, email } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isOwner = email === comment.userEmail;

  const handleAddReply = async () => {
    if (!token) return setError("🔒 Please login to reply.");
    if (!replyContent.trim()) return setError("⚠️ Reply cannot be empty.");
    if (replyContent.length > 300) return setError("⚠️ Max 300 characters.");

    setError(null);
    setLoading(true);

    const tempId = `temp-${Date.now()}`;
    const newReply: CommentType = {
      _id: tempId,
      roadmapId: comment.roadmapId,
      parentCommentId: comment._id,
      userEmail: email!,
      content: replyContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic UI update - add reply immediately
    setComments((prev) => [newReply, ...prev]);
    setReplyContent("");
    setShowReply(false);

    try {
      const { data } = await api.post<CommentType>("/comments", {
        roadmapId: comment.roadmapId,
        parentCommentId: comment._id,
        content: replyContent,
      });
      // Replace temp reply with real data from server
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? data : c))
      );
    } catch (err: any) {
      setError(err.response?.data?.error || "❌ Failed to add reply.");
      // Remove temp reply on error
      setComments((prev) => prev.filter((c) => c._id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return setError("🔒 Login required to delete.");

    setLoading(true);
    setError(null);

    // Collect all comment IDs to remove (comment + all nested replies)
    const idsToRemove = new Set<string>();
    const collectIds = (id: string) => {
      idsToRemove.add(id);
      allComments.forEach((c) => {
        if (c.parentCommentId === id) collectIds(c._id);
      });
    };
    collectIds(comment._id);

    const oldComments = [...allComments];
    // Remove all affected comments from UI immediately
    setComments((prev) => prev.filter((c) => !idsToRemove.has(c._id)));

    try {
      await api.delete(`/comments/${comment._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "❌ Delete failed.");
      // Revert UI on failure
      setComments(oldComments);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!token) return setError("🔒 Login required to edit.");
    if (!editContent.trim()) return setError("⚠️ Content is empty.");
    if (editContent.length > 300)
      return setError("⚠️ Max 300 characters allowed.");

    setLoading(true);
    setError(null);

    const oldContent = comment.content;
    // Optimistically update UI
    setComments((prev) =>
      prev.map((c) =>
        c._id === comment._id ? { ...c, content: editContent } : c
      )
    );

    try {
      await api.put(`/comments/${comment._id}`, { content: editContent });
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "❌ Update failed.");
      // Revert UI if update failed
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id ? { ...c, content: oldContent } : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Safe fallback for replies
  const replies = comment.replies ?? [];

  return (
    <div
      className="border rounded p-3 my-2 bg-white shadow-sm"
      style={{ marginLeft: depth * 20 }}
    >
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="font-medium">{comment.userEmail}</span>
        <span className="text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {error && <p className="text-red-500 text-sm mb-1">{error}</p>}

      {editing ? (
        <>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full border p-2 rounded"
            disabled={loading}
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditContent(comment.content);
                setError(null);
              }}
              className="bg-gray-400 text-black px-3 py-1 rounded hover:bg-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="whitespace-pre-wrap">{comment.content}</p>
      )}

      <div className="flex gap-4 text-sm mt-2">
        {depth < maxDepth - 1 && token && (
          <button
            onClick={() => {
              setShowReply(!showReply);
              setError(null);
            }}
            className="text-blue-600 hover:underline"
          >
            {showReply ? "Cancel" : "Reply"}
          </button>
        )}

        {isOwner && !editing && (
          <>
            <button
              onClick={() => {
                setEditing(true);
                setError(null);
              }}
              className="text-yellow-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:underline"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
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
            className="w-full border p-2 rounded"
            disabled={loading}
          />
          <button
            onClick={handleAddReply}
            disabled={loading}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Replying..." : "Reply"}
          </button>
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-2">
          {replies.map((reply) => (
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
