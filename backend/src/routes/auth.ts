// import { Router } from "express";
// import { register, login } from "../controllers/authController";

// const router = Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;


// routes/auth.ts
import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

router.post("/signup", register);  // <== This must exist
router.post("/login", login);

export default router;

