import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../types/user";
import { findUserById } from "../services/user";
import { AuthenticationError } from "../utils/errors";

export async function isTeacher(req: ExtendedRequest, _res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        const user = await findUserById(userId, false);

        if(!user) {
            throw new AuthenticationError("Unauthenticated user");
        }

        if(user.role !== "TEACHER") {
            throw new AuthenticationError("You don't have access to this action");
        }

        next();
    } catch(error) {
        next(error);
    }
}