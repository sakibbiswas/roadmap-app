"use strict";
// // controllers/roadmapController.ts
// import { Request, Response } from "express";
// import RoadmapItem from "../models/RoadmapItem";
// import { isValidObjectId } from "../validateObjectId";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downvoteRoadmap = exports.upvoteRoadmap = exports.getRoadmaps = void 0;
const RoadmapItem_1 = __importDefault(require("../models/RoadmapItem"));
const validateObjectId_1 = require("../validateObjectId");
// GET all roadmaps with filters and sorting
const getRoadmaps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, status, sortBy } = req.query;
    const filter = {};
    if (category)
        filter.category = category;
    if (status)
        filter.status = status;
    let sort = {};
    if (sortBy === "popularity")
        sort = { upvotes: -1 };
    else if (sortBy === "status")
        sort = { status: 1 };
    else if (sortBy === "category")
        sort = { category: 1 };
    else
        sort = { createdAt: -1 };
    try {
        const roadmaps = yield RoadmapItem_1.default.find(filter).sort(sort);
        res.json(roadmaps);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch roadmap items" });
    }
});
exports.getRoadmaps = getRoadmaps;
// PATCH /roadmaps/:id/upvote
const upvoteRoadmap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roadmapId = req.params.id;
    const userEmail = req.userEmail;
    if (!userEmail)
        return res.status(401).json({ error: "Unauthorized" });
    if (!(0, validateObjectId_1.isValidObjectId)(roadmapId))
        return res.status(400).json({ error: "Invalid roadmap ID" });
    try {
        const roadmap = yield RoadmapItem_1.default.findById(roadmapId);
        if (!roadmap)
            return res.status(404).json({ error: "Roadmap item not found" });
        roadmap.upvotedBy = roadmap.upvotedBy || [];
        roadmap.downvotedBy = roadmap.downvotedBy || [];
        // Remove from downvotes if exists
        roadmap.downvotedBy = roadmap.downvotedBy.filter(email => email !== userEmail);
        if (roadmap.upvotedBy.includes(userEmail)) {
            // Toggle off upvote
            roadmap.upvotedBy = roadmap.upvotedBy.filter(email => email !== userEmail);
        }
        else {
            roadmap.upvotedBy.push(userEmail);
        }
        roadmap.upvotes = roadmap.upvotedBy.length;
        roadmap.downvotes = roadmap.downvotedBy.length;
        yield roadmap.save();
        res.json(roadmap);
    }
    catch (error) {
        console.error("Upvote error:", error);
        res.status(500).json({ error: "Failed to upvote roadmap item" });
    }
});
exports.upvoteRoadmap = upvoteRoadmap;
// PATCH /roadmaps/:id/downvote
const downvoteRoadmap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roadmapId = req.params.id;
    const userEmail = req.userEmail;
    if (!userEmail)
        return res.status(401).json({ error: "Unauthorized" });
    if (!(0, validateObjectId_1.isValidObjectId)(roadmapId))
        return res.status(400).json({ error: "Invalid roadmap ID" });
    try {
        const roadmap = yield RoadmapItem_1.default.findById(roadmapId);
        if (!roadmap)
            return res.status(404).json({ error: "Roadmap item not found" });
        roadmap.upvotedBy = roadmap.upvotedBy || [];
        roadmap.downvotedBy = roadmap.downvotedBy || [];
        // Remove from upvotes if exists
        roadmap.upvotedBy = roadmap.upvotedBy.filter(email => email !== userEmail);
        if (roadmap.downvotedBy.includes(userEmail)) {
            // Toggle off downvote
            roadmap.downvotedBy = roadmap.downvotedBy.filter(email => email !== userEmail);
        }
        else {
            roadmap.downvotedBy.push(userEmail);
        }
        roadmap.upvotes = roadmap.upvotedBy.length;
        roadmap.downvotes = roadmap.downvotedBy.length;
        yield roadmap.save();
        res.json(roadmap);
    }
    catch (error) {
        console.error("Downvote error:", error);
        res.status(500).json({ error: "Failed to downvote roadmap item" });
    }
});
exports.downvoteRoadmap = downvoteRoadmap;
