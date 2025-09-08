import z from "zod";

export const createBookSchema = z.object({
    author: z.string()
        .min(2, { message: "The author name must be at least 2 characters long" })
        .max(100, { message: "The author name must have a maximum of 100 characters" }),
    title: z.string()
        .min(2, { message: "The title must be at least 2 characters long" })
        .max(100, { message: "The book title must have a maximum of 100 characters" }),
    category: z.string()
        .min(2, { message: "The category must be at least 2 characters long" })
        .max(100, { message: "The category must have a maximum of 100 characters" }),
    isbn: z.string()
        .min(13, { message: "The ISBN must be at least 13 characters long" })
        .max(13, { message: "The ISBN must have a maximum of 13 characters" })
});