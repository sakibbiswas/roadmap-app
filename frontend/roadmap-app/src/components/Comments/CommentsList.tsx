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

  // Fetch comments for roadmap
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

  // Add new comment (top level)
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

    // Optimistic UI update
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
      // Replace temp comment with server comment
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? res.data : c))
      );
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add comment");
      // Remove temp comment on error
      setComments((prev) => prev.filter((c) => c._id !== tempId));
    }
  };

  // Build nested comment tree helper
  const buildTree = (
    flatComments: CommentType[],
    parentId: string | undefined = undefined,
    depth: number = 0
  ): CommentType[] => {
    if (depth >= MAX_NEST_DEPTH) return [];
    return flatComments
      .filter((c) => c.parentCommentId === parentId)
      .map((c) => ({
        ...c,
        replies: buildTree(flatComments, c._id, depth + 1),
      }));
  };

  // Flattened comments do not have replies property, add via typing
  interface CommentWithReplies extends CommentType {
    replies?: CommentWithReplies[];
  }

  const nestedComments: CommentWithReplies[] = buildTree(comments);

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {token && (
        <div className="mb-4">
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={MAX_COMMENT_LENGTH}
          />
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>{newComment.length} / {MAX_COMMENT_LENGTH}</span>
            <button
              onClick={handleAddComment}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}

      {loading && <p>Loading comments...</p>}
      {!loading && nestedComments.length === 0 && <p>No comments yet.</p>}

      <div>
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
