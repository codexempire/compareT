import { Router } from "express";
import { createAssistant, loginUser, resetPassword } from "../controllers/auth";

const router = Router();

router.post("/admin/create", createAssistant);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);

export default router;