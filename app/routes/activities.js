import { Router } from "express";
import { tokenValidator } from "../middleware";
import { compareAssignments, getPreviousChecks, getSingleCheck, rerun, uploadStudentAssignment } from "../controllers/activities"; 
import upload from "../multer";

const router = Router();

router.post("/compare", upload.array("file"), tokenValidator, compareAssignments, uploadStudentAssignment);
router.get("/previous-checks", tokenValidator, getPreviousChecks);
router.get("/previous-check/:id", tokenValidator, getSingleCheck);
router.patch("/rerun/:id", tokenValidator, rerun);

export default router;