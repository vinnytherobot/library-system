import { NextFunction, Response, Request } from "express";
import { ValidationError } from "../utils/errors";
import { z } from "zod";

export function validateRequest<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const mappedErrors = error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));
                
                try {
                    const validationError = new ValidationError('Invalid data', mappedErrors);
                    next(validationError);
                } catch (constructorError) {
                    next(new Error('Validation failed'));
                }
            } else {
                next(error);
            }
        }
    };
}