import { useState } from "react";
import CommentsList from "../Comments/CommentsList";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/api";
import type { RoadmapItemType } from "./RoadmapList";

interface Props {
  roadmap: RoadmapItemType;
  onUpdate: (updated: RoadmapItemType) => void;
}

const RoadmapItem = ({ roadmap, onUpdate }: Props) => {
  const { token, email } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const userId = email || "";
  const hasVoted = roadmap.upvotedBy.includes(userId);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (!token) {
      setError("You must be logged in to vote.");
      return;
    }

    if (type === "upvote" && hasVoted) {
      setError("You have already upvoted this item.");
      return;
    }

    if (type === "downvote" && !hasVoted) {
      setError("You haven't upvoted yet.");
      return;
    }

    setError(null);
    setLoading(true);

    const updatedItem =
      type === "upvote"
        ? {
            ...roadmap,
            upvotes: roadmap.upvotes + 1,
            upvotedBy: [...roadmap.upvotedBy, userId],
          }
        : {
            ...roadmap,
            upvotes: roadmap.upvotes - 1,
            upvotedBy: roadmap.upvotedBy.filter((id) => id !== userId),
          };

    onUpdate(updatedItem);

    try {
      await api.patch(`/roadmaps/${roadmap._id}/${type}`);
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to ${type}`);
      onUpdate(roadmap); // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition duration-200">
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">{roadmap.title}</h2>
      <p className="text-gray-700 mb-4">{roadmap.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
          Category: {roadmap.category}
        </span>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
          Status: {roadmap.status}
        </span>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
          Upvotes: {roadmap.upvotes}
        </span>
      </div>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-300 p-2 rounded mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={() => handleVote("upvote")}
          disabled={loading || hasVoted}
          className={`px-4 py-2 rounded-lg transition ${
            hasVoted
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          👍 Upvote
        </button>

        <button
          onClick={() => handleVote("downvote")}
          disabled={loading || !hasVoted}
          className={`px-4 py-2 rounded-lg transition ${
            !hasVoted
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          👎 Downvote
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="ml-auto px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {showComments && <CommentsList roadmapId={roadmap._id} />}
    </div>
  );
};

export default RoadmapItem;
