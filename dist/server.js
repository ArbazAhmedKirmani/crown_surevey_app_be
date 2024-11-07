"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
// API Routes
app.use("/api", auth_routes_1.default);
// app.post("/api/user/forms", async (req, res) => {
//   const post = new Post({
//     title: req.body.title,
//     content: req.body.content,
//   });
//   try {
//     const savedPost = await post.save();
//     res.json(savedPost);
//   } catch (error: Error) {
//     res.status(400).json({ message: error.message });
//   }
// });
// app.get("/api/user/forms/:id", async (req, res) => {
//   try {
//     const { id } = req.query;
//     const user = await UserSchema.exists(id).json();
//     if (!user) res.json({ message: "User didn't exists" });
//     const forms = await FormSchema.find().json();
//     res.json(user, forms);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
