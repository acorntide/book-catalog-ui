/**
 * @file Book Utilities
 * Centralized utilities for book data processing, filtering, sorting, and normalization
 */

import type { Book } from '../types/book';
import type { SortOption, NavigationView } from '../context/appState';

/**
 * Normalize book data to ensure consistent format
 */
export function normalizeBook(book: Book): Book {
  return {
    ...book,
    // Ensure authors is always an array
    authors: Array.isArray(book.authors) ? book.authors : [],
    // Ensure arrays are never null/undefined
    categories: Array.isArray(book.categories) ? book.categories : [],
    tags: Array.isArray(book.tags) ? book.tags : [],
    // Ensure booleans have defaults
    favorite: Boolean(book.favorite),
    unread: Boolean(book.unread),
  };
}

/**
 * Sort books by the specified sort option
 */
export function sortBooks(books: Book[], sortOrder: SortOption): Book[] {
  const sortedBooks = [...books];
  
  switch (sortOrder) {
    case 'title-asc':
      return sortedBooks.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title-desc':
      return sortedBooks.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'author-asc':
      return sortedBooks.sort((a, b) => {
        const authorA = Array.isArray(a.authors) && a.authors.length > 0 ? a.authors[0] : '';
        const authorB = Array.isArray(b.authors) && b.authors.length > 0 ? b.authors[0] : '';
        return authorA.localeCompare(authorB);
      });
    case 'author-desc':
      return sortedBooks.sort((a, b) => {
        const authorA = Array.isArray(a.authors) && a.authors.length > 0 ? a.authors[0] : '';
        const authorB = Array.isArray(b.authors) && b.authors.length > 0 ? b.authors[0] : '';
        return authorB.localeCompare(authorA);
      });
    default:
      return sortedBooks;
  }
}

/**
 * Filter books by search term across multiple fields
 */
export function filterBooksBySearch(books: Book[], searchTerm: string): Book[] {
  if (!searchTerm || searchTerm.length < 4) {
    return books;
  }
  
  const term = searchTerm.toLowerCase();
  
  return books.filter(book => {
    // Search in title
    const titleMatch = (book.title || '').toLowerCase().includes(term);
    
    // Search in authors
    const authorsMatch = Array.isArray(book.authors) 
      ? book.authors.some(author => author.toLowerCase().includes(term))
      : false;
    
    // Search in description
    const descriptionMatch = (book.description || '').toLowerCase().includes(term);
    
    // Search in categories
    const categoriesMatch = Array.isArray(book.categories)
      ? book.categories.some(category => category.toLowerCase().includes(term))
      : false;
    
    // Search in tags
    const tagsMatch = Array.isArray(book.tags)
      ? book.tags.some(tag => tag.toLowerCase().includes(term))
      : false;
      
    return titleMatch || authorsMatch || descriptionMatch || categoriesMatch || tagsMatch;
  });
}

/**
 * Filter books by navigation view (favorites, tags, etc.)
 */
export function filterBooksByView(books: Book[], currentView: NavigationView, selectedTag: string | null): Book[] {
  switch (currentView) {
    case 'favorites':
      return books.filter(book => book.favorite === true);
    case 'tag-filter':
      if (!selectedTag) return [];
      return books.filter(book => 
        Array.isArray(book.tags) && 
        book.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    case 'library':
    case 'tags':
    default:
      return books;
  }
}

/**
 * Get all unique tags from a collection of books
 */
export function extractAllTags(books: Book[]): string[] {
  const tagSet = new Set<string>();
  books.forEach(book => {
    if (Array.isArray(book.tags)) {
      book.tags.forEach(tag => {
        if (tag && typeof tag === 'string') {
          tagSet.add(tag.toLowerCase());
        }
      });
    }
  });
  return Array.from(tagSet).sort();
}

/**
 * Count books that have a specific tag
 */
export function countBooksWithTag(books: Book[], tag: string): number {
  return books.filter(book => 
    Array.isArray(book.tags) && 
    book.tags.some(bookTag => bookTag.toLowerCase() === tag.toLowerCase())
  ).length;
}

/**
 * Apply all filters and sorting to a book collection
 */
export function processBooks(
  books: Book[], 
  {
    currentView = 'library',
    selectedTag = null,
    searchTerm = '',
    sortOrder = 'title-asc'
  }: {
    currentView?: NavigationView;
    selectedTag?: string | null;
    searchTerm?: string;
    sortOrder?: SortOption;
  }
): Book[] {
  // First normalize all books
  const normalizedBooks = books.map(normalizeBook);
  
  // Apply view-based filtering
  const viewFilteredBooks = filterBooksByView(normalizedBooks, currentView, selectedTag);
  
  // Apply search filtering
  const searchFilteredBooks = filterBooksBySearch(viewFilteredBooks, searchTerm);
  
  // Apply sorting
  return sortBooks(searchFilteredBooks, sortOrder);
}

/**
 * Get display text for authors
 */
export function getAuthorsDisplayText(book: Book): string {
  if (!Array.isArray(book.authors) || book.authors.length === 0) {
    return 'Unknown Author';
  }
  return book.authors.join(', ');
}

/**
 * Get display text for categories
 */
export function getCategoriesDisplayText(book: Book): string | undefined {
  if (!Array.isArray(book.categories) || book.categories.length === 0) {
    return undefined;
  }
  return book.categories.join(', ');
}

/**
 * Get display text for tags
 */
export function getTagsDisplayText(book: Book): string | undefined {
  if (!Array.isArray(book.tags) || book.tags.length === 0) {
    return undefined;
  }
  return book.tags.join(', ');
}