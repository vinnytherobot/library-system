import { Router } from "express";
import * as UserController from "../controllers/user";
import { authenticateToken } from "../middleware/auth";
import { isTeacher } from "../middleware/isTeacher";

const router = Router();

router.use(authenticateToken);

router.get("/me", UserController.getCurrentUser);
router.put("/edit/me", UserController.editCurrentUser);
router.delete("/delete/me", UserController.deleteCurrentUser);

router.get("/:id/loans", authenticateToken, isTeacher, UserController.userLoansHistory);

export default router;