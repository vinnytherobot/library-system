import { prisma } from "../utils/prisma";
import { CreateUserType, updateUserType } from "../types/user";
import { ConflictError, NotFoundError } from "../utils/errors";

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            omit: {
                password: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return users;
    } catch (error) {
        console.error("Error on getting all users: ", error);
        throw error;
    }
}

export async function findUserByEmail(email: string, includePassword: boolean) {

    try {
        const user = await prisma.user.findUnique({ where: { email }, omit: { password: !includePassword } });

        return user;

    } catch (error) {
        console.error("Error on searching user by email: ", error);
        throw error;
    }
}


export async function findUserById(userId: string, includePassword: boolean) {

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            omit: { password: !includePassword }
        })

        return user;
    } catch (error) {
        console.error("Error on searching user by ID: ", error);
        throw error;
    }
}

export async function createUser(data: CreateUserType) {

    try {
        const existingUser = await findUserByEmail(data.email, false);

        if (existingUser) {
            throw new ConflictError("This email is already in use");
        }

        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            },
            omit: {
                password: true
            }
        })

        return newUser;

    } catch (error) {
        console.error("Error creating user: ", error);
        throw error;
    }
}

export async function updateUser(userId: string, userData: updateUserType) {

    try {
        const user = await findUserById(userId, true);

        if (!user) {
            throw new NotFoundError("User not exists");
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...userData
            },
            omit: {
                password: true
            }
        });

        return updatedUser;
    } catch (error) {
        console.error("Error on update user: ", error);
        throw error;
    }
}

export async function deleteUser(userId: string) {
    try {
        const user = await findUserById(userId, false);

        if (!user) {
            throw new NotFoundError("User not exists");
        }

        await prisma.user.delete({
            where: { id: userId }
        });
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
}