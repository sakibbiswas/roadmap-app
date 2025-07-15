// import { Router } from "express";
// import {
//   getRoadmaps,
//   upvoteRoadmap,
// } from "../controllers/roadmapController";
// import { authenticateToken } from "../middlewares/authMiddleware";
// // import { authenticateToken } from "../middleware/authMiddleware";

// const router = Router();

// router.get("/", getRoadmaps);
// router.patch("/:id/upvote", authenticateToken, upvoteRoadmap);

// export default router;


import { Router } from "express";
import {
  getRoadmaps,
  upvoteRoadmap,
  downvoteRoadmap,
} from "../controllers/roadmapController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getRoadmaps);
router.patch("/:id/upvote", authenticateToken, upvoteRoadmap);
router.patch("/:id/downvote", authenticateToken, downvoteRoadmap);

export default router;
