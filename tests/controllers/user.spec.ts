import * as userService from "../../src/services/user";
import * as userController from "../../src/controllers/user";
import * as loanService from "../../src/services/loan";
import { Role } from "@prisma/client";
import { randomUUID } from "crypto";

jest.mock("../../src/services/user");
jest.mock("../../src/services/loan");

const mockUserService = userService as jest.Mocked<typeof userService>;
const mockLoanService = loanService as jest.Mocked<typeof loanService>;

describe("User Controller", () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
            params: {},
            query: {}
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        }
    });

    it("Should show current user", async () => {
        const currentUserId = "JWT-TOKEN"

        const mockCurrentUser = {
            id: "138e1a7c-47cd-4d34-adae-8c146e3189d0",
            name: "John Doe",
            email: "john@example.com",
            password: "John123",
            role: "STUDENT" as Role,
            createdAt: new Date()
        }

        req.userId = currentUserId;

        mockUserService.findUserById.mockResolvedValue(mockCurrentUser);

        await userController.getCurrentUser(req, res, next);

        expect(userService.findUserById).toHaveBeenCalledTimes(1);
        expect(userService.findUserById).toHaveBeenCalledWith(currentUserId, false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockCurrentUser,
            message: "User found"
        });
    });

    it("Should edit current user", async () => {
        const currentUserId = "JWT-TOKEN"
        const mockCurrentUser = {
            id: "138e1a7c-47cd-4d34-adae-8c146e3189d0",
            name: "John Doe",
            email: "john@example.com",
            role: "STUDENT" as Role,
            createdAt: new Date()
        }

        const userUpdated = {
            name: "John Doe (Edited)"
        }

        req.userId = currentUserId;
        req.body = userUpdated;

        mockUserService.updateUser.mockResolvedValue(mockCurrentUser);

        await userController.editCurrentUser(req, res, next);

        expect(mockUserService.updateUser).toHaveBeenCalledTimes(1);
        expect(mockUserService.updateUser).toHaveBeenCalledWith(currentUserId, userUpdated);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockCurrentUser,
            message: "User updated sucessfully"
        });
    });

    it("Should delete user", async () => {
        const currentUserId = "JWT-TOKEN"

        req.userId = currentUserId;

        mockUserService.deleteUser.mockResolvedValue();

        await userController.deleteCurrentUser(req, res, next);

        expect(mockUserService.deleteUser).toHaveBeenCalledTimes(1);
        expect(mockUserService.deleteUser).toHaveBeenCalledWith(currentUserId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: null,
            message: "User deleted successfully"
        });
    });

    it("Should show user loans history", async () => {
        const currentUserId = "JWT-TOKEN";

        const mockLoansHistory = [
            {
                id: randomUUID(),
                userId: currentUserId,
                bookId: randomUUID(),
                loanDate: new Date(),
                returnDate: null
            }
        ];

        req.userId = currentUserId;

        mockLoanService.getUserLoansHistory.mockResolvedValue(mockLoansHistory);

        await userController.userLoansHistory(req, res, next);

        expect(loanService.getUserLoansHistory).toHaveBeenCalledTimes(1);
        expect(loanService.getUserLoansHistory).toHaveBeenCalledWith(currentUserId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockLoansHistory,
            message: "User loans history"
        });
    });

    it("Should show empty history message when user has no loans", async () => {
        const currentUserId = "JWT-TOKEN";
        const emptyHistory = [];

        req.userId = currentUserId;

        mockLoanService.getUserLoansHistory.mockResolvedValue(emptyHistory);

        await userController.userLoansHistory(req, res, next);

        expect(loanService.getUserLoansHistory).toHaveBeenCalledTimes(1);
        expect(loanService.getUserLoansHistory).toHaveBeenCalledWith(currentUserId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: emptyHistory,
            message: "No history"
        });
    });
});