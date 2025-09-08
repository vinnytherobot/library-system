import { randomUUID } from "node:crypto";
import { isTeacher } from "../../src/middleware/isTeacher";
import { findUserById } from "../../src/services/user";
import { AuthenticationError } from "../../src/utils/errors";
import { Role } from "@prisma/client";

jest.mock("../../src/services/user");
const mockFindUserById = findUserById as jest.MockedFunction<typeof findUserById>;

describe("isTeacher Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            userId: null
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        next = jest.fn();
    });

    it("Should call next() when user is TEACHER", async () => {
        const userId = randomUUID();
        const mockTeacher = {
            id: userId,
            name: "John Teacher",
            email: "teacher@example.com",
            password: "John123",
            role: "TEACHER" as Role,
            createdAt: new Date()
        };

        req.userId = userId;
        mockFindUserById.mockResolvedValue(mockTeacher);

        await isTeacher(req, res, next);

        expect(findUserById).toHaveBeenCalledTimes(1);
        expect(findUserById).toHaveBeenCalledWith(userId, false);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });

    it("Should call next() with AuthenticationError when user is not found", async () => {
        const userId = randomUUID();
        
        req.userId = userId;
        mockFindUserById.mockResolvedValue(null);

        await isTeacher(req, res, next);

        expect(findUserById).toHaveBeenCalledTimes(1);
        expect(findUserById).toHaveBeenCalledWith(userId, false);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Unauthenticated user"
            })
        );
        
        const calledError = next.mock.calls[0][0];
        expect(calledError).toBeInstanceOf(AuthenticationError);
    });

    it("Should call next() with AuthenticationError when user is STUDENT", async () => {
        const userId = randomUUID();
        const mockStudent = {
            id: userId,
            name: "John Student",
            email: "student@example.com",
            password: "John123",
            role: "STUDENT" as Role,
            createdAt: new Date()
        };

        req.userId = userId;
        mockFindUserById.mockResolvedValue(mockStudent);

        await isTeacher(req, res, next);

        expect(findUserById).toHaveBeenCalledTimes(1);
        expect(findUserById).toHaveBeenCalledWith(userId, false);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "You don't have access to this action"
            })
        );
        
        const calledError = next.mock.calls[0][0];
        expect(calledError).toBeInstanceOf(AuthenticationError);
    });

    it("Should call next() with error when findUserById throws an error", async () => {
        const userId = randomUUID();
        const databaseError = new Error("Database connection failed");

        req.userId = userId;
        mockFindUserById.mockRejectedValue(databaseError);

        await isTeacher(req, res, next);

        expect(findUserById).toHaveBeenCalledTimes(1);
        expect(findUserById).toHaveBeenCalledWith(userId, false);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(databaseError);
    });
});