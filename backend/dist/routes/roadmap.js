"use strict";
// import { Router } from "express";
// import {
//   getRoadmaps,
//   upvoteRoadmap,
// } from "../controllers/roadmapController";
// import { authenticateToken } from "../middlewares/authMiddleware";
// // import { authenticateToken } from "../middleware/authMiddleware";
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.get("/", getRoadmaps);
// router.patch("/:id/upvote", authenticateToken, upvoteRoadmap);
// export default router;
const express_1 = require("express");
const roadmapController_1 = require("../controllers/roadmapController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", roadmapController_1.getRoadmaps);
router.patch("/:id/upvote", authMiddleware_1.authenticateToken, roadmapController_1.upvoteRoadmap);
router.patch("/:id/downvote", authMiddleware_1.authenticateToken, roadmapController_1.downvoteRoadmap);
exports.default = router;
