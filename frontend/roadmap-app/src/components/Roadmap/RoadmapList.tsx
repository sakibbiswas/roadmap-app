import { useEffect, useState } from "react";
import RoadmapItem from "./RoadmapItem";
import api from "../../api/api";

export interface RoadmapItemType {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "Planned" | "In Progress" | "Completed";
  upvotes: number;
  upvotedBy: string[];
}

const categories = ["All", "UI", "Mobile", "Backend"];
const statuses = ["All", "Planned", "In Progress", "Completed"];
const sortOptions = [
  { label: "Title", value: "title" },
  { label: "Popularity", value: "popularity" },
  { label: "Status", value: "status" },
];

const RoadmapList = () => {
  const [roadmaps, setRoadmaps] = useState<RoadmapItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("title");

  const fetchRoadmaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filterCategory !== "All") params.category = filterCategory;
      if (filterStatus !== "All") params.status = filterStatus;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get<RoadmapItemType[]>("/roadmaps", { params });

      const cleanedData = res.data.map((item) => ({
        ...item,
        upvotes: typeof item.upvotes === "number" ? item.upvotes : 0,
        upvotedBy: Array.isArray(item.upvotedBy) ? item.upvotedBy : [],
      }));

      setRoadmaps(cleanedData);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load roadmap items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [filterCategory, filterStatus, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
          Product Roadmap
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
          >
            {sortOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                Sort by {label}
              </option>
            ))}
          </select>
        </div>

        {/* Loading/Error */}
        {loading && (
          <p className="text-center text-indigo-600 font-medium">Loading roadmap items...</p>
        )}
        {error && (
          <p className="text-center text-red-600 bg-red-100 p-3 rounded shadow mb-4">
            {error}
          </p>
        )}

        {/* List */}
        <div className="space-y-6">
          {roadmaps.length === 0 && !loading ? (
            <p className="text-center text-gray-600">No roadmap items found.</p>
          ) : (
            roadmaps.map((item) => (
              <RoadmapItem
                key={item._id}
                roadmap={item}
                onUpdate={(updatedItem) =>
                  setRoadmaps((prev) =>
                    prev.map((r) => (r._id === updatedItem._id ? updatedItem : r))
                  )
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapList;
