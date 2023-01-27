import express from "express";
import { getUsers, Register } from "../controllers/UsersController.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", Register);

export default router;
