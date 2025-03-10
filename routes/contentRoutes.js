import express from "express";
import { createContent } from "../controllers/contentController.js";
import { isAdmin, isAuthenticated } from "../middlewares/Auth.js";

const router = express.Router();

router.route("/createcontent").post(isAuthenticated, isAdmin, createContent);

export default router;
