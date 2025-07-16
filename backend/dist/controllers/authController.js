"use strict";
// import { Request, Response } from "express";
// import User from "../models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
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
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required" });
    try {
        const existingUser = yield User_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser)
            return res.status(400).json({ error: "User with this email already exists" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        yield newUser.save();
        // ✅ Return token so frontend can login immediately
        const token = jsonwebtoken_1.default.sign({ email: newUser.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(201).json({ token, email: newUser.email });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error during registration" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required" });
    try {
        const user = yield User_1.default.findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(400).json({ error: "Invalid credentials" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.json({ token, email: user.email });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error during login" });
    }
});
exports.login = login;
