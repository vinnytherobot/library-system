export interface CreateNewBookType {
    author: string;
    title: string;
    category: string;
    isbn: string;
}

export interface UpdateBookType {
    author?: string;
    title?: string;
    category?: string;
    isbn?: string;
}

export interface Book {
    id: string;
    author: string;
    title: string;
    category: string;
    isbn: string;
    loans: [];
    createdAt: string;
}