import { NextFunction, Response } from "express";
import { deleteUser, findUserById, updateUser } from "../services/user";
import { sendSuccessResponse } from "../utils/sucess";
import type { ExtendedRequest, updateUserType } from "../types/user";
import { NotFoundError } from "../utils/errors";
import { getUserLoansHistory } from "../services/loan";

// Get current user
export async function getCurrentUser(request: ExtendedRequest, response: Response, next: NextFunction) {
    try {
        const currentUserId = request.userId;

        const user = await findUserById(currentUserId, false);

        if (!user) {
            throw new NotFoundError("User not exists");
        }

        sendSuccessResponse(
            response,
            user,
            "User found"
        )
    } catch (error) {
        next(error);
    }
}

// Edit current user
export async function editCurrentUser(request: ExtendedRequest, response: Response, next: NextFunction) {
    try {
        const currentUserId = request.userId;

        const user = await findUserById(currentUserId, false);

        if (!user) {
            throw new NotFoundError("User not exists");
        }

        const userDataEdit: updateUserType = request.body;

        const updatedUser = await updateUser(currentUserId, userDataEdit);

        sendSuccessResponse(
            response,
            updatedUser,
            "User updated sucessfully"
        )
    } catch (error) {
        next(error);
    }
}

// Delete current user
export async function deleteCurrentUser(request: ExtendedRequest, response: Response, next: NextFunction) {
    try {
        const currentUserId = request.userId;

        const user = await findUserById(currentUserId, false);

        if (!user) {
            throw new NotFoundError("User not exists");
        }

        await deleteUser(currentUserId);

        sendSuccessResponse(
            response,
            null,
            "User deleted successfully"
        )
    } catch (error) {
        next(error);
    }
}

// Get full user loans history
export async function userLoansHistory(request: ExtendedRequest, response: Response, next: NextFunction) {
    try {
        const userId = request.userId;

        const loansHistory = await getUserLoansHistory(userId);

        sendSuccessResponse(
            response,
            loansHistory,
            loansHistory.length === 0 ? "No history" : "User loans history"
        )
    } catch (error) {
        next(error);
    }
}