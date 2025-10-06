/**
 * @file Type definitions for Book object
 * Matches schema provided by book_catalog/get_metadata.py
 */

export type BookId = number | string;

// Set the book schema (should match schema from book_catalog/get_metadata.py)
// null values are fallbacks for optional properties
export interface Book {
  id: BookId;
  isbn: string;
  title: string;
  authors: string[];
  publisher?: string | null;
  publishedDate?: string | null;
  cover_url?: string | null;
  description?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
  favorite?: boolean;
  unread?: boolean;
  [key: string]: unknown;
}

// Payload for creating a book (id should not be present)
export type CreateBookPayload = Omit<Book, 'id'> & { id?: never };

// Payload for updating a book: partial set of fields (id is passed separately)
export type UpdateBookPayload = Partial<Omit<Book, 'id'>>;
