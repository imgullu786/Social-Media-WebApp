import express from "express";
import { getUserProfile, getSuggestions, followUnfollowUser, updateUserProfile } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js"
const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile)
router.get("/suggest", protectRoute, getSuggestions)
router.post("/follow/:id", protectRoute, followUnfollowUser)
router.post("/update", protectRoute, updateUserProfile)

export default router;