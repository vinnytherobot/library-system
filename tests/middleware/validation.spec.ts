import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../../src/middleware/validation";
import { ValidationError } from "../../src/utils/errors";
import { signInSchema, signUpSchema } from "../../src/schemas/auth"

describe("Validation Middleware (SignUp)", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {},
        };

        res = {};
        next = jest.fn();
    })

    const testSchema = signUpSchema;

    it("Should validate and pass valid data", () => {
        req.body = {
            name: "John doe", // pass
            email: "john@example.com", // pass
            password: "John123", // pass
            role: "STUDENT" // pass
        }

        const middleware = validateRequest(testSchema);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body).toEqual({
            name: "John doe",
            email: "john@example.com",
            password: "John123",
            role: "STUDENT"
        });
    })

    it("Should create ValidationError for invalid data (All fields)", () => {
        req.body = {
            name: "A", // Too short (don't pass)
            email: "invalid-email", // Invalid format (don't pass)
            password: "john", // Very weak and don't have uppercase letter and (don't pass, 2 errors)
            role: "invalid-role" // invalid role (don't pass)
        };

        const middleware = validateRequest(testSchema);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        const calledError = (next as jest.Mock).mock.calls[0][0];
        expect(calledError.message).toBe("Invalid data");
        expect(calledError.details).toHaveLength(5);
    });

    it("Should create ValidationError for invalid data (Name)", () => {
        req.body = {
            name: "A", // Too short (don't pass)
            email: "john@example.com", // Correct (pass)
            password: "John123", // Correct (pass)
            role: "STUDENT" // Correct (pass)
        };

        const middleware = validateRequest(testSchema);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        const calledError = (next as jest.Mock).mock.calls[0][0];
        expect(calledError.message).toBe("Invalid data");
        expect(calledError.details).toHaveLength(1);
    });

    it("Should create ValidationError for invalid data (email)", () => {
        req.body = {
            name: "John Doe", // Correct (pass)
            email: "email-dont-pass", // Incorrect (dont't pass)
            password: "John123", // Correct (pass)
            role: "TEACHER" // Correct (pass)
        };

        const middleware = validateRequest(testSchema);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        const calledError = (next as jest.Mock).mock.calls[0][0];
        expect(calledError.message).toBe("Invalid data");
        expect(calledError.details).toHaveLength(1);
    });

    it("Should handle non-Zod errors", () => {
        // Mock to simulate non-Zod error
        const mockSchema = {
            parse: jest.fn().mockImplementation(() => {
                throw new Error("Generic error");
            })
        };

        req.body = { test: "data" };

        const middleware = validateRequest(mockSchema as any);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        const calledError = (next as jest.Mock).mock.calls[0][0];
        expect(calledError.message).toBe("Generic error");
    });
})

describe("Validation Middleware (SignIn)", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {},
        };

        res = {};
        next = jest.fn();
    })

    const testSchema = signInSchema;

    it("Should validate and pass valid data", () => {
        req.body = {
            email: "john@example.com", // pass
            password: "John123", // pass
        }

        const middleware = validateRequest(testSchema);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body).toEqual({
            email: "john@example.com",
            password: "John123",
        });
    });

    it("Should create ValidationError for invalid data (email)", () => {
        req.body = {
            email: "email-dont-pass", // Incorrect (dont't pass)
            password: "John123", // Correct (pass)
        };

        const middleware = validateRequest(testSchema);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        const calledError = (next as jest.Mock).mock.calls[0][0];
        expect(calledError.message).toBe("Invalid data");
        expect(calledError.details).toHaveLength(1);
    });

    it("Should create ValidationError for invalid data (password)", () => {
        req.body = {
            email: "john@example.com", // Correct (pass)
            password: "john", // Very weak and don't have uppercase letter and (don't pass, 2 errors)
        };

        const middleware = validateRequest(testSchema);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        const calledError = (next as jest.Mock).mock.calls[0][0];
        expect(calledError.message).toBe("Invalid data");
        expect(calledError.details).toHaveLength(2);
    });
})