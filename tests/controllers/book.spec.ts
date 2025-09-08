import { randomUUID } from "node:crypto";
import * as bookController from "../../src/controllers/book";
import * as bookService from "../../src/services/book";

jest.mock("../../src/services/book");
const mockBookService = bookService as jest.Mocked<typeof bookService>;

describe("Book Controller", () => {
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

        next = jest.fn();
    });

    it("Should list all books", async () => {
        const mockBooks = [
            {
                id: randomUUID(),
                author: "John Doe",
                title: "John Doe and your codes",
                category: "Programming",
                isbn: "29iejfhru3iowd",
                createdAt: new Date(),
                loans: undefined
            },
            {
                id: randomUUID(),
                author: "John Doe",
                title: "John Doe and your codes",
                category: "Programming",
                isbn: "9iejfhru3iowd1",
                createdAt: new Date(),
                loans: undefined
            }
        ];

        mockBookService.getBooks.mockResolvedValue(mockBooks);

        await bookController.getAllBooks(req, res, next);

        expect(bookService.getBooks).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockBooks,
            message: "All books"
        })
    });

    it("Should create a new book", async () => {
        // Note: The TEACHER role check is done in the middleware
        // This test assumes that the middleware has already validated that the user is a TEACHER

        const mockBook = {
            id: randomUUID(),
            author: "John Doe",
            title: "John Doe and your codes",
            category: "Programming",
            isbn: "29iejfhru3iow",
            createdAt: new Date(),
        };

        const currentUserId = randomUUID();

        req.userId = currentUserId;
        req.headers = {
            Authorization: "Bearer valid-jwt-token"
        };
        req.body = {
            author: mockBook.author,
            title: mockBook.title,
            category: mockBook.category,
            isbn: mockBook.isbn
        };

        mockBookService.newBook.mockResolvedValue(mockBook);

        await bookController.createBook(req, res, next);

        expect(bookService.newBook).toHaveBeenCalledTimes(1);
        expect(bookService.newBook).toHaveBeenCalledWith(
            req.body
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockBook,
            message: "Book created successfully"
        });
    });

    it("Should search a specify book", async () => {
        const mockBook = {
            id: randomUUID(),
            author: "John Doe",
            title: "John Doe and your codes",
            category: "Programming",
            isbn: "29iejfhru3iowd",
            createdAt: new Date(),
            loans: undefined
        }

        req.params.id = mockBook.id;

        mockBookService.findBookById.mockResolvedValue(mockBook);

        await bookController.getBook(req, res, next);

        expect(bookService.findBookById).toHaveBeenCalledTimes(1);
        expect(bookService.findBookById).toHaveBeenCalledWith(mockBook.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockBook,
            message: "Book found"
        });
    });

    it("Should call next with NotFoundError when book is not found", async () => {
        const nonExistentId = randomUUID();
        
        req.params.id = nonExistentId;
    
        mockBookService.findBookById.mockResolvedValue(null);
    
        await bookController.getBook(req, res, next);
    
        expect(bookService.findBookById).toHaveBeenCalledTimes(1);
        expect(bookService.findBookById).toHaveBeenCalledWith(nonExistentId);
        
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "This book not exists"
            })
        );
        
        const calledError = next.mock.calls[0][0];
        expect(calledError.constructor.name).toBe("NotFoundError");
    });

    it("Should update a book successfully", async () => {
        const bookId = randomUUID();
        
        const updateData = {
            title: "Updated Title",
            author: "Updated Author",
            category: "Updated Category"
        };
    
        const mockUpdatedBook = {
            id: bookId,
            title: updateData.title,
            author: updateData.author,
            category: updateData.category,
            isbn: "29iejfhru3iowd",
            createdAt: new Date(),
            loans: undefined
        };
    
        const currentUserId = randomUUID();
    
        req.userId = currentUserId;
        req.params.id = bookId;
        req.body = updateData;
    
        mockBookService.editBook.mockResolvedValue(mockUpdatedBook);
    
        await bookController.updateBook(req, res, next);
    
        expect(bookService.editBook).toHaveBeenCalledTimes(1);
        expect(bookService.editBook).toHaveBeenCalledWith(bookId, updateData);
        expect(next).not.toHaveBeenCalled();
    });

    it("Should delete a book successfully", async () => {
        const bookId = randomUUID();
        const currentUserId = randomUUID();
    
        req.userId = currentUserId;
        req.params.id = bookId;
    
        mockBookService.removeBook.mockResolvedValue(undefined);
    
        await bookController.deleteBook(req, res, next);
    
        expect(bookService.removeBook).toHaveBeenCalledTimes(1);
        expect(bookService.removeBook).toHaveBeenCalledWith(bookId);
        expect(next).not.toHaveBeenCalled();
    });
})