"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// // backend/src/server.ts
// import app from "./app";
// //  Don't use app.listen()
// //  Instead, export the app for Vercel
// export default app;
