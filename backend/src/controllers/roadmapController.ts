

// // controllers/roadmapController.ts
// import { Request, Response } from "express";
// import RoadmapItem from "../models/RoadmapItem";
// import { isValidObjectId } from "../validateObjectId";

// export const getRoadmaps = async (req: Request, res: Response) => {
//   const { category, status, sortBy } = req.query;

//   const filter: any = {};
//   if (category) filter.category = category;
//   if (status) filter.status = status;

//   let sort: any = {};
//   if (sortBy === "popularity") sort = { upvotes: -1 };
//   else if (sortBy === "status") sort = { status: 1 };
//   else if (sortBy === "category") sort = { category: 1 };
//   else sort = { createdAt: -1 };

//   try {
//     const roadmaps = await RoadmapItem.find(filter).sort(sort);
//     res.json(roadmaps);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch roadmap items" });
//   }
// };

// export const upvoteRoadmap = async (req: Request, res: Response) => {
//   const roadmapId = req.params.id;
//   const userEmail = req.userEmail;

//   if (!userEmail) return res.status(401).json({ error: "Unauthorized" });

//   if (!isValidObjectId(roadmapId))
//     return res.status(400).json({ error: "Invalid roadmap ID" });

//   try {
//     const roadmap = await RoadmapItem.findById(roadmapId);
//     if (!roadmap) return res.status(404).json({ error: "Roadmap item not found" });

//     // Defensive fix
//     roadmap.upvotedBy = roadmap.upvotedBy || [];
//     roadmap.upvotes = roadmap.upvotes || 0;

//     if (roadmap.upvotedBy.includes(userEmail)) {
//       return res.status(400).json({ error: "You have already upvoted this item" });
//     }

//     roadmap.upvotes += 1;
//     roadmap.upvotedBy.push(userEmail);

//     await roadmap.save();
//     res.json(roadmap);
//   } catch (error) {
//     console.error("Upvote error:", error);
//     res.status(500).json({ error: "Failed to upvote roadmap item" });
//   }
// };





import { Request, Response } from "express";
import RoadmapItem from "../models/RoadmapItem";
import { isValidObjectId } from "../validateObjectId";

// GET all roadmaps with filters and sorting
export const getRoadmaps = async (req: Request, res: Response) => {
  const { category, status, sortBy } = req.query;

  const filter: any = {};
  if (category) filter.category = category;
  if (status) filter.status = status;

  let sort: any = {};
  if (sortBy === "popularity") sort = { upvotes: -1 };
  else if (sortBy === "status") sort = { status: 1 };
  else if (sortBy === "category") sort = { category: 1 };
  else sort = { createdAt: -1 };

  try {
    const roadmaps = await RoadmapItem.find(filter).sort(sort);
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roadmap items" });
  }
};

// PATCH /roadmaps/:id/upvote
export const upvoteRoadmap = async (req: Request, res: Response) => {
  const roadmapId = req.params.id;
  const userEmail = req.userEmail;

  if (!userEmail) return res.status(401).json({ error: "Unauthorized" });
  if (!isValidObjectId(roadmapId))
    return res.status(400).json({ error: "Invalid roadmap ID" });

  try {
    const roadmap = await RoadmapItem.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ error: "Roadmap item not found" });

    roadmap.upvotedBy = roadmap.upvotedBy || [];
    roadmap.downvotedBy = roadmap.downvotedBy || [];

    // Remove from downvotes if exists
    roadmap.downvotedBy = roadmap.downvotedBy.filter(email => email !== userEmail);

    if (roadmap.upvotedBy.includes(userEmail)) {
      // Toggle off upvote
      roadmap.upvotedBy = roadmap.upvotedBy.filter(email => email !== userEmail);
    } else {
      roadmap.upvotedBy.push(userEmail);
    }

    roadmap.upvotes = roadmap.upvotedBy.length;
    roadmap.downvotes = roadmap.downvotedBy.length;

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    console.error("Upvote error:", error);
    res.status(500).json({ error: "Failed to upvote roadmap item" });
  }
};

// PATCH /roadmaps/:id/downvote
export const downvoteRoadmap = async (req: Request, res: Response) => {
  const roadmapId = req.params.id;
  const userEmail = req.userEmail;

  if (!userEmail) return res.status(401).json({ error: "Unauthorized" });
  if (!isValidObjectId(roadmapId))
    return res.status(400).json({ error: "Invalid roadmap ID" });

  try {
    const roadmap = await RoadmapItem.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ error: "Roadmap item not found" });

    roadmap.upvotedBy = roadmap.upvotedBy || [];
    roadmap.downvotedBy = roadmap.downvotedBy || [];

    // Remove from upvotes if exists
    roadmap.upvotedBy = roadmap.upvotedBy.filter(email => email !== userEmail);

    if (roadmap.downvotedBy.includes(userEmail)) {
      // Toggle off downvote
      roadmap.downvotedBy = roadmap.downvotedBy.filter(email => email !== userEmail);
    } else {
      roadmap.downvotedBy.push(userEmail);
    }

    roadmap.upvotes = roadmap.upvotedBy.length;
    roadmap.downvotes = roadmap.downvotedBy.length;

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    console.error("Downvote error:", error);
    res.status(500).json({ error: "Failed to downvote roadmap item" });
  }
};
