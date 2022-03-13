import { Router } from "express";
import { tokenValidator } from "../middleware";
import { compareAssignments, uploadStudentAssignment } from "../controllers/activities"; 
import upload from "../multer";

const router = Router();

router.post("/compare", upload.array("file"), tokenValidator, compareAssignments, uploadStudentAssignment);

export default router;