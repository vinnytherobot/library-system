import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "../utils/errors";
import { findUserById } from "../services/user";
import { ExtendedRequest } from "../types/user";

export async function authenticateToken(
    req: ExtendedRequest,
    _res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AuthenticationError("Token not provided");
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new AuthenticationError("Token not provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

        if (!decoded.userId) {
            throw new AuthenticationError("Invalid token");
        }

        const user = await findUserById(decoded.userId, false);

        if (!user) {
            throw new AuthenticationError("User not found");
        }

        req.userId = user.id;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AuthenticationError("Invalid token"));
            return;
        }

        if (error instanceof jwt.TokenExpiredError) {
            next(new AuthenticationError("Expired token"));
            return;
        }

        next(error);
    }
}

export function requireAuth(req: ExtendedRequest, _res: Response, next: NextFunction): void {
    if (!req.userId) {
        next(new AuthenticationError("Authentication required"));
        return;
    }
    next();
} 