import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/api";

export interface CommentType {
  _id: string;
  roadmapId: string;
  parentCommentId?: string;
  userEmail: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  roadmapId: string;
}

const MAX_COMMENT_LENGTH = 300;
const MAX_NEST_DEPTH = 3;

const CommentsList = ({ roadmapId }: Props) => {
  const { token, email } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<CommentType[]>(`/comments?roadmapId=${roadmapId}`);
      setComments(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [roadmapId]);

  const handleAddComment = async () => {
    if (!token || !email) {
      setError("You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    if (newComment.length > MAX_COMMENT_LENGTH) {
      setError(`Comment must be under ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }

    setError(null);

    const tempId = `temp-${Date.now()}`;
    const newCommentObj: CommentType = {
      _id: tempId,
      roadmapId,
      userEmail: email,
      content: newComment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComments((prev) => [newCommentObj, ...prev]);
    setNewComment("");

    try {
      const res = await api.post<CommentType>("/comments", {
        roadmapId,
        content: newComment,
      });
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? res.data : c))
      );
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add comment");
      setComments((prev) => prev.filter((c) => c._id !== tempId));
    }
  };

  const buildTree = (
    flatComments: CommentType[],
    parentId: string | undefined = undefined,
    depth: number = 0
  ): CommentWithReplies[] => {
    if (depth >= MAX_NEST_DEPTH) return [];
    return flatComments
      .filter((c) => c.parentCommentId === parentId)
      .map((c) => ({
        ...c,
        replies: buildTree(flatComments, c._id, depth + 1),
      }));
  };

  interface CommentWithReplies extends CommentType {
    replies?: CommentWithReplies[];
  }

  const nestedComments: CommentWithReplies[] = buildTree(comments);

  return (
    <div className="mt-6 bg-white rounded-lg p-5 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">💬 Comments</h3>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {token && (
        <div className="mb-5">
          <textarea
            className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={MAX_COMMENT_LENGTH}
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>{newComment.length} / {MAX_COMMENT_LENGTH}</span>
            <button
              onClick={handleAddComment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow disabled:opacity-50"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-sm text-gray-600">Loading comments...</p>}
      {!loading && nestedComments.length === 0 && (
        <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
      )}

      <div className="mt-4 space-y-4">
        {nestedComments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            depth={0}
            allComments={comments}
            setComments={setComments}
            maxDepth={MAX_NEST_DEPTH}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
