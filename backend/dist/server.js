"use strict";
// import app from "./app";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// backend/src/server.ts
const app_1 = __importDefault(require("./app"));
//  Don't use app.listen()
//  Instead, export the app for Vercel
exports.default = app_1.default;
