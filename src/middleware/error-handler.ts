import { Request, Response, NextFunction } from 'express';
import { AppError, sendErrorResponse } from '../utils/errors';

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });

    if (res.headersSent) {
        return;
    }

    if (error instanceof AppError) {
        sendErrorResponse(res, error);
        return;
    }

    if (error.name === 'ZodError') {
        const validationError = new AppError('Invalid data', 400, 'VALIDATION_ERROR');
        (validationError as any).details = (error as any).errors;
        sendErrorResponse(res, validationError);
        return;
    }

    if (error.name === 'PrismaClientKnownRequestError') {
        const prismaError = error as any;

        switch (prismaError.code) {
            case 'P2002':
                sendErrorResponse(res, new AppError('Duplicate data', 409, 'DUPLICATE_ENTRY'));
                return;
            case 'P2025':
                sendErrorResponse(res, new AppError('Resource not found', 404, 'NOT_FOUND'));
                return;
            default:
                sendErrorResponse(res, new AppError('Error on database', 500, 'DATABASE_ERROR'));
                return;
        }
    }
    
    sendErrorResponse(res, new AppError('Internal error', 500, 'INTERNAL_ERROR'));
}

export function notFoundHandler(_req: Request, res: Response): void {
    sendErrorResponse(res, new AppError('Route not found', 404, 'NOT_FOUND'));
} 