import { CreateNewBookType, UpdateBookType } from "../types/book";
import { ConflictError, NotFoundError } from "../utils/errors";
import { prisma } from "../utils/prisma";

export async function getBooks() {
    try {
        const books = await prisma.book.findMany({ include: { loans: true } });

        return books;
    } catch (error) {
        console.error("Error on get all books: ", error);
        throw error;
    }
}

export async function findBookByISBN(isbn: string) {
    try {
        const existingBook = await prisma.book.findUnique({
            where: { isbn },
            include: {
                loans: true,
            }
        });

        return existingBook;
    } catch (error) {
        console.error("Error searching book by ISBN: ", error);
        throw error;
    }
}

export async function findBookById(bookId: string) {
    try {
        const existingBook = await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                loans: true
            }
        });

        return existingBook;
    } catch (error) {
        console.error("Error on searching book by ID: ", error);
        throw error;
    }
}

export async function newBook(data: CreateNewBookType) {
    try {
        const existingBook = await findBookByISBN(data.isbn);

        if (existingBook) {
            throw new ConflictError("This book already exists");
        }

        const newBook = await prisma.book.create({
            data: {
                ...data
            }
        })

        return newBook;
    } catch (error) {
        console.error("Error creating book: ", error);
        throw error;
    }
}

export async function editBook(bookId: string, data: UpdateBookType) {
    try {
        const existingBook = await prisma.book.findUnique({ where: { id: bookId } });

        if (!existingBook) {
            throw new NotFoundError("This book don't exists");
        }

        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: {
                ...data
            },
            include: {
                loans: true
            }
        })

        return updatedBook;
    } catch (error) {
        console.error("Error editing book: ", error);
        throw error;
    }
}

export async function removeBook(bookId: string) {
    try {
        const existingBook = await prisma.book.findUnique({ where: { id: bookId } });

        if (!existingBook) {
            throw new NotFoundError("This book don't exists");
        }

        return await prisma.book.delete({ where: { id: bookId } });
    } catch (error) {
        console.error("Error deleting book: ", error);
        throw error;
    }
}