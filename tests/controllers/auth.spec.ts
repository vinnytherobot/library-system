import request from "supertest";
import app from "../../src/app";
import * as userService from "../../src/services/user";
import { Role } from "@prisma/client";

jest.mock("../../src/services/user");
jest.mock("../../src/utils/jwt", () => ({
    createJWT: jest.fn().mockReturnValue("mock-jwt-token-123")
}));

const mockUserService = userService as jest.Mocked<typeof userService>;

describe("Auth Controller", () => {
    describe("POST /api/auth/signup", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("Should create user sucessfully", async () => {
            const mockUser = {
                id: "20834rnfef-3948rubvjs-93eiudh-03eoirubei",
                name: "John Doe",
                email: "john@example.com",
                role: "STUDENT" as Role,
                createdAt: new Date()
            }

            mockUserService.createUser.mockResolvedValue(mockUser);

            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "John123",
                role: "STUDENT"
            }

            const response = await request(app)
                .post("/api/auth/signup")
                .send(userData)
                .expect(201)

            expect(response.body).toMatchObject({
                success: true,
                message: "User created sucessfully",
                data: {
                    token: expect.any(String),
                    newUser: expect.objectContaining({
                        id: expect.any(String),
                        name: "John Doe",
                        email: "john@example.com",
                        role: "STUDENT"
                    })
                }
            })

            expect(mockUserService.createUser).toHaveBeenCalledWith({
                name: "John Doe",
                email: "john@example.com",
                password: "hashedPassword123",
                role: "STUDENT"
            })
        });

        it("Should return validation error for invalid email", async () => {
            const userData = {
                name: "John Doe",
                email: "invalid-email",
                password: "Password123",
                role: "STUDENT"
            };

            const response = await request(app)
                .post("/api/auth/signup")
                .send(userData)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: "VALIDATION_ERROR",
                message: "Invalid data"
            });

            expect(response.body.details).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: "email",
                        message: "Invalid email"
                    })
                ])
            );
        });

        it("Should return validation error for weak password", async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "123", // Very weak (don't pass)
                role: "STUDENT"
            };

            const response = await request(app)
                .post("/api/auth/signup")
                .send(userData)
                .expect(400);

            expect(response.body.details).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        field: "password",
                        message: expect.stringContaining("at least 6 characters")
                    }),
                    expect.objectContaining({
                        field: "password",
                        message: expect.stringContaining("uppercase letter")
                    })
                ])
            );
        });

        it("Should handle service errors", async () => {
            mockUserService.createUser.mockRejectedValue(
                new Error("Database connection failed")
            );

            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "John123",
                role: "STUDENT"
            };

            const response = await request(app)
                .post("/api/auth/signup")
                .send(userData)
                .expect(500);

            expect(response.body).toMatchObject({
                success: false,
                error: "INTERNAL_ERROR",
                message: "Internal error"
            });
        });
    })
})