import { Router } from "express";
import * as AuthController from "../controllers/auth";
import { validateRequest } from "../middleware/validation";
import { signInSchema, signUpSchema } from "../schemas/auth";

const router = Router();

//Auth routes
router.post("/signup", validateRequest(signUpSchema), AuthController.signUp);
router.post("/signin", validateRequest(signInSchema), AuthController.signIn);

export default router;