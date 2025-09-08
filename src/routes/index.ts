import { Router } from 'express';
import userRoutes from "./user";
import authRoutes from "./auth";
import bookRoutes from "./book";
import loanRoutes from "./loan";

const router = Router();

//Health check
router.get("/health", (_req, response) => {
    response.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env['NODE_ENV'] || "development"
    })
})

//API Routes
router.use("/api/users", userRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/books", bookRoutes);
router.use("/api/loans", loanRoutes)

export default router; 