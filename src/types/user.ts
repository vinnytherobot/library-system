import { Role } from "@prisma/client";
import { Request } from "express";

export interface CreateUserType {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export interface SignInType {
    email: string;
    password: string;
}

export interface updateUserType {
    name?: string;
    email?: string;
}

export interface ExtendedRequest extends Request {
    userId?: string;
    body: any;
    params: any;
    headers: any;
}