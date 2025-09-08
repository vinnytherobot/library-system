import { Response } from "express";
import { ApiResponse } from "../types/response";

export function sendSuccessResponse<T = any>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
): void {
    const response: ApiResponse<T> = {
        success: true,
        data
    };
    if (message !== undefined) {
        response.message = message;
    }
    res.status(statusCode).json(response);
} 