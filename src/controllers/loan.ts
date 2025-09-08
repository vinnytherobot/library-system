import { NextFunction, Response, Request } from "express";
import { completeLoan, getLoans, newLoan } from "../services/loan";
import { sendSuccessResponse } from "../utils/sucess";
import type { ExtendedRequest } from "../types/user";

// Get all loans on DB
export async function getAllLoans(request: Request, response: Response, next: NextFunction) {
    try {
        const loans = await getLoans();

        sendSuccessResponse(
            response,
            loans,
            "All loans"
        )
    } catch (error) {
        next(error);
    }
}

// Create a new loan
export async function createLoan(request: ExtendedRequest, response: Response, next: NextFunction) {
    try {
        const userId = request.userId;
        const { bookId } = request.body;

        const loan = await newLoan({ userId: userId, bookId: bookId });

        sendSuccessResponse(
            response,
            loan,
            "Loan created successfully"
        )
    } catch (error) {
        next(error);
    }
}

// Return the loan
export async function returnLoan(request: ExtendedRequest, response: Response, next: NextFunction){
    try {
        const loanId = request.params.id;

        const completedLoan = await completeLoan(loanId, { returnDate: new Date() });

        sendSuccessResponse(
            response,
            completedLoan,
            "Loan returned"
        )
    } catch(error) {
        next(error);
    }
}