import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/user";
import bcrypt from "bcrypt";
import { sendSuccessResponse } from "../utils/sucess";
import { AuthenticationError } from "../utils/errors";
import { createJWT } from "../utils/jwt";
import type { SignInType } from "../types/user";

// Create a new account
export async function signUp(request: Request, response: Response, next: NextFunction) {
    try {
        const { name, email, password, role } = request.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const data = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        }

        const newUser = await createUser(data);

        const token = createJWT(newUser.id);

        sendSuccessResponse(
            response,
            { newUser, token: token },
            "User created sucessfully",
            201
        );

    } catch (error) {
        next(error);
    }
}

// Login user
export async function signIn(request: Request, response: Response, next: NextFunction) {
    try {
        const { email, password }: SignInType = request.body;

        const user = await findUserByEmail(email, true);
        if (!user) {
            throw new AuthenticationError("Incorrect email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AuthenticationError("Incorrect email or password");
        }

        const responseData = {
            name: user.name,
            email: user.email,
            role: user.role
        }

        const token = createJWT(user.id);

        sendSuccessResponse(
            response, 
            { responseData, token: token }, 
            "Logged in sucessfully"
        );
    } catch(error){
        next(error);
    }
}