import { Router } from "express";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { authenticateToken } from "../middlewares/authMiddleware";
// import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getComments);
router.post("/", authenticateToken, addComment);
router.put("/:id", authenticateToken, updateComment);
router.delete("/:id", authenticateToken, deleteComment);

export default router;
