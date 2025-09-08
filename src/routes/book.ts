import { Router } from "express";
import * as BookController from "../controllers/book";
import { authenticateToken } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";
import { createBookSchema } from "../schemas/book";
import { isTeacher } from "../middleware/isTeacher";

const router = Router();

router.get("/", BookController.getAllBooks);
router.get("/:id", BookController.getBook);
router.post("/", validateRequest(createBookSchema), authenticateToken, isTeacher, BookController.createBook);
router.put("/edit/:id", authenticateToken, isTeacher, BookController.updateBook);
router.delete("/delete/:id", authenticateToken, isTeacher, BookController.deleteBook);

export default router;