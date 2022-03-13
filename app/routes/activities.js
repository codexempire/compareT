import { Router } from "express";
import { tokenValidator } from "../middleware";
import { compareAssignments, getPreviousChecks, uploadStudentAssignment } from "../controllers/activities"; 
import upload from "../multer";

const router = Router();

router.post("/compare", upload.array("file"), tokenValidator, compareAssignments, uploadStudentAssignment);
router.get("/previous-checks", tokenValidator, getPreviousChecks);

export default router;