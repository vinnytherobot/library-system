import { Router } from "express";
import * as LoanController from "../controllers/loan";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", LoanController.getAllLoans);
router.post("/", authenticateToken, LoanController.createLoan);
router.put("/:id/return", authenticateToken, LoanController.returnLoan);

export default router;