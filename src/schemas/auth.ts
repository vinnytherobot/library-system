import { Role } from "@prisma/client";
import z from "zod";

export const signUpSchema = z.object({
    name:
        z.string()
            .min(2, { message: "The name must be at least 2 characters long" })
            .max(100, { message: "The name must have a maximum of 100 characters" }),
    email:
        z.email({ message: "Invalid email" })
            .toLowerCase()
            .trim(),
    password:
        z.string()
            .min(6, { message: "The password must be at least 6 characters" })
            .max(100, { message: "The password must have a maximum of 100 characters" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            }),
    role: z.enum(Role)
})

export const signInSchema = z.object({
    email:
        z.email()
            .min(2, { message: "The name must be at least 2 characters long" })
            .max(100, { message: "The name must have a maximum of 100 characters" }),
    password:
        z.string()
            .min(6, { message: "The password must be at least 6 characters" })
            .max(100, { message: "The password must have a maximum of 100 characters" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            }),
})