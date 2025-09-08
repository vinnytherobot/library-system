import { CreateLoanType, LoanUpdateType } from "../types/loan";
import { ConflictError, NotFoundError, ValidationError } from "../utils/errors";
import { prisma } from "../utils/prisma";

export async function getLoans() {
    try {
        const loans = await prisma.loan.findMany();

        return loans;
    } catch (error) {
        console.error("Error getting all loans: ", error);
        throw error;
    }
}

export async function findLoanById(loanId: string){
        
    try {
        const loan = await prisma.loan.findUnique({ where: { id: loanId }});

        return loan;
    } catch(error) {
        console.error("Error searching loan by ID: ", error);
        throw error;
    }
}

export async function getUserLoansHistory(userId) {
    try {
        const loansHistory = await prisma.loan.findMany({ where: { userId } });

        return loansHistory;
    } catch (error) {
        console.error("Error searching Loans History: ", error);
        throw error;
    }
}

export async function newLoan(data: CreateLoanType) {
    try {
        const book = await prisma.book.findUnique({ where: { id: data.bookId } })

        if (!book) {
            throw new NotFoundError("Book not found");
        }

        const existingLoan = await prisma.loan.findFirst({
            where: {
                bookId: data.bookId,
                returnDate: null
            }
        });

        if (existingLoan) {
            throw new ValidationError("This book is already on loan");
        }

        const userHasThisBook = await prisma.loan.findFirst({
            where: {
                userId: data.userId,
                bookId: data.bookId,
                returnDate: null
            }
        });

        if (userHasThisBook) {
            throw new ValidationError("User already has this book on loan");
        }

        const userActiveLoans = await prisma.loan.count({
            where: {
                userId: data.userId,
                returnDate: null
            }
        });

        const MAX_LOANS_PER_USER = 3; // max 3 books per user
        if (userActiveLoans >= MAX_LOANS_PER_USER) {
            throw new ValidationError(`User has reached the maximum limit of ${MAX_LOANS_PER_USER} active loans`);
        }

        const loan = await prisma.loan.create({
            data: {
                userId: data.userId,
                bookId: data.bookId,
                loanDate: new Date()
            },
            include: {
                user: {
                    omit: {
                        password: true,
                        createdAt: true
                    }
                },
                book: true
            }
        });

        return loan;

    } catch (error) {
        console.error("Error creating loan: ", error);
        throw error;
    }
}


export async function completeLoan(loanId: string, data: LoanUpdateType){
    try {
        const loan = await findLoanById(loanId);

        if(!loan) {
            throw new NotFoundError("This loan doesn't exists");
        }

        if(loan.returnDate) {
            throw new ConflictError("Loan already completed");
        }

        return await prisma.loan.update({
            where: { id: loanId },
            data: {
                ...data
            },
            include: {
                book: {
                    omit: {
                        createdAt: true
                    }
                },
                user: {
                    omit: {
                        password: true,
                        createdAt: true
                    }
                }
            }
        });
    } catch(error){
        console.error("Error on completing loan: ", error);
        throw error;
    }
}