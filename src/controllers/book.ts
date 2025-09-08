import { Request, Response, NextFunction } from "express";
import { editBook, findBookById, getBooks, newBook, removeBook } from "../services/book";
import { sendSuccessResponse } from "../utils/sucess";
import { ExtendedRequest } from "../types/user";
import { UpdateBookType } from "../types/book";
import { NotFoundError } from "../utils/errors";


// Get all books on DB
export async function getAllBooks(request: Request, response: Response, next: NextFunction) {
    try {
        const books = await getBooks();

        sendSuccessResponse(
            response,
            books,
            "All books"
        )
    } catch (error) {
        next(error);
    }
}

// Create a new book
export async function createBook(request: ExtendedRequest, response: Response, next: NextFunction) {
    try {
        const { title, author, isbn, category } = request.body;

        const bookData = {
            title,
            author,
            isbn,
            category
        }

        const createdBook = await newBook(bookData);

        sendSuccessResponse(
            response,
            createdBook,
            "Book created successfully",
            201
        )
    } catch (error) {
        next(error);
    }
}

// Update an book
export async function updateBook(request: ExtendedRequest, response: Response, next: NextFunction) {
    try {
        const bookId = request.params.id;
        const data: UpdateBookType = request.body;

        const updatedBook = await editBook(bookId, data);

        sendSuccessResponse(
            response,
            updatedBook,
            "Book updated successfully"
        )
    } catch (error) {
        next(error);
    }
}

// Delete a book
export async function deleteBook(request: ExtendedRequest, response: Response, next: NextFunction){
    try {
        const bookId = request.params.id;

        await removeBook(bookId);

        sendSuccessResponse(
            response,
            null,
            "Book removed successfully"
        )
    } catch(error) {
        next(error);
    }
}

// Get a specify book
export async function getBook(request: Request, response: Response, next: NextFunction){
    try {
        const bookId = request.params.id;
        const book = await findBookById(bookId);

        if(!book) {
            throw new NotFoundError("This book not exists");
        }

        sendSuccessResponse(
            response,
            book,
            "Book found"
        )
    } catch(error) {
        next(error);
    }
}