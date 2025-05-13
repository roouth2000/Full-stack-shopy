import express from "express";
import {
  registerUser,
  registerUserpost,
  verifyUser,
  loginUser
} from "../Controllers/AuthController.js";
import { UserProfile } from "../Controllers/ProfileController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.get("/user/register", registerUserpost);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/profile", isAuth, UserProfile);

export default router;
