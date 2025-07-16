"use strict";
// import { Router } from "express";
// import { register, login } from "../controllers/authController";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.post("/register", register);
// router.post("/login", login);
// export default router;
// routes/auth.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/signup", authController_1.register); // <== This must exist
router.post("/login", authController_1.login);
exports.default = router;
