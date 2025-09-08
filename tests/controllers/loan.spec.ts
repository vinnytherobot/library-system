import { randomUUID } from "crypto";
import * as loanController from "../../src/controllers/loan";
import * as loanService from "../../src/services/loan";

jest.mock("../../src/services/loan");

const mockLoanService = loanService as jest.Mocked<typeof loanService>;

describe("Loan Controller", () => {
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

    it("Should list all loans", async () => {
        const bookId = randomUUID();
        const mockLoans = [
            {
                id: randomUUID(),
                userId: undefined,
                bookId: bookId,
                loanDate: new Date(),
                returnDate: null,
                book: undefined,
                user: undefined
            },
            {
                id: randomUUID(),
                userId: undefined,
                bookId: bookId,
                loanDate: new Date(),
                returnDate: null,
                book: undefined,
                user: undefined
            }
        ];

        mockLoanService.getLoans.mockResolvedValue(mockLoans);

        await loanController.getAllLoans(req, res, next);

        expect(mockLoanService.getLoans).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockLoans,
            message: "All loans"
        })
    });

    it("Should create a loan", async () => {
        const bookId = randomUUID();

        const mockLoan = {
            id: randomUUID(),
            userId: undefined,
            bookId: bookId,
            loanDate: new Date(),
            returnDate: null,
            book: undefined,
            user: undefined
        }

        req.body = {
            bookId
        }

        mockLoanService.newLoan.mockResolvedValue(mockLoan);

        await loanController.createLoan(req, res, next);

        expect(mockLoanService.newLoan).toHaveBeenCalledTimes(1);
        expect(mockLoanService.newLoan).toHaveBeenCalledWith({
            userId: undefined,
            bookId
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockLoan,
            message: "Loan created successfully"
        })
    });
});