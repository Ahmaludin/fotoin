import express from "express";
import {
  getUsers,
  Register,
  Login,
  Logout,
} from "../controllers/UsersController.js";
import verifyToken from "../middleware/verifyToken.js";
import refreshToken from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
