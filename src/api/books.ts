/**
 * @file API helper
 * Centralizes communication with the book_catalog API
 */

import type { Book, CreateBookPayload, UpdateBookPayload, BookId } from '../types/book';

const BASE = (import.meta.env.VITE_API_BASE as string) ?? 'http://127.0.0.1:8000';

async function checkRes(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE}/books`);
  return checkRes(res);
}

export async function fetchMetadata(isbn: string): Promise<Book> {
  const res = await fetch(`${BASE}/metadata/${isbn}`);
  return checkRes(res);
}

export async function createBook(payload: CreateBookPayload): Promise<Book> {
  const res = await fetch(`${BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return checkRes(res);
}

export async function updateBook(id: BookId, payload: UpdateBookPayload): Promise<Book> {
  const res = await fetch(`${BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return checkRes(res);
}

export async function deleteBook(id: BookId): Promise<void> {
  const res = await fetch(`${BASE}/books/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
}
