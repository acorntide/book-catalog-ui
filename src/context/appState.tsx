/**
 * @file State management and context provider
 * App-wide context and reducer for managing book catalog state and async actions
 */

import * as React from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../types/book';
import { fetchBooks as apiFetchBooks, createBook, updateBook, fetchMetadata as apiFetchMetadata, deleteBook as apiDeleteBook } from '../api/books';

// State shape
// Unifies the state instead of scattering `useState` calls throughout project (reducer handles everything)
export type SortOption = 'title-asc' | 'title-desc' | 'author-asc' | 'author-desc';
export type NavigationView = 'library' | 'favorites' | 'tags' | 'tag-filter';

export type AppState = {
	books: Book[];
	selectedBook: Book | null;
	editingBook: Book | null;
	fetchedBookData: Book | null; // for storing metadata from ISBN fetch
	showModal: boolean;
	isLoading: boolean;
	error?: string | null;
	isRailExpanded: boolean;
	sortOrder: SortOption;
	searchTerm: string;
	currentView: NavigationView;
	selectedTag: string | null; // for tag-filter view
};

const initialState: AppState = {
	books: [],
	selectedBook: null,
	editingBook: null,
	fetchedBookData: null,
	showModal: false,
	isLoading: false,
	error: null,
	isRailExpanded: false,
	sortOrder: 'title-asc',
	searchTerm: '',
	currentView: 'library',
	selectedTag: null,
};


// Reducer - centralizes handling updates to various states
type Action =
	| { type: 'SET_BOOKS'; payload: Book[] } // replace the list of books
	| { type: 'ADD_OR_UPDATE_BOOK'; payload: Book } // update or insert one book
	| { type: 'DELETE_BOOK'; payload: string | number } // remove book by id
	| { type: 'SET_SELECTED_BOOK'; payload: Book | null } // open/close book detail modal
	| { type: 'SET_EDITING_BOOK'; payload: Book | null } // open/close book form modal
	| { type: 'SET_FETCHED_BOOK_DATA'; payload: Book | null } // store metadata from ISBN fetch
	| { type: 'FINISH_EDITING'; payload: Book } // atomic transition from edit to detail mode
	| { type: 'SET_SHOW_MODAL'; payload: boolean } // open/close book form modal
	| { type: 'SET_LOADING'; payload: boolean } // handle async state
	| { type: 'SET_ERROR'; payload?: string | null } // handle async error state
	| { type: 'SET_RAIL_EXPANDED'; payload?: boolean } // toggle NavRail expansion
	| { type: 'SET_SORT_ORDER'; payload: SortOption } // change sorting order
	| { type: 'SET_SEARCH_TERM'; payload: string } // update search filter
	| { type: 'SET_CURRENT_VIEW'; payload: NavigationView } // change navigation view
	| { type: 'SET_SELECTED_TAG'; payload: string | null } // select tag for filtering

function reducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'SET_BOOKS':
			return { ...state, books: action.payload };
		case 'ADD_OR_UPDATE_BOOK': {
			const book = action.payload;
			const idx = state.books.findIndex((b) => String(b.id) === String(book.id));
			const nextBooks = [...state.books];
			if (idx >= 0) nextBooks[idx] = book;
			else nextBooks.unshift(book);
			return { ...state, books: nextBooks };
		}
		case 'DELETE_BOOK': {
			const bookId = action.payload;
			const nextBooks = state.books.filter((b) => String(b.id) !== String(bookId));
			return { ...state, books: nextBooks };
		}
		case 'SET_SELECTED_BOOK':
			return { ...state, selectedBook: action.payload };
		case 'SET_EDITING_BOOK':
			return { ...state, editingBook: action.payload };
		case 'SET_FETCHED_BOOK_DATA':
			return { ...state, fetchedBookData: action.payload };
		case 'FINISH_EDITING':
			return { 
				...state, 
				editingBook: null, 
				selectedBook: action.payload 
			};
		case 'SET_SHOW_MODAL':
			return { ...state, showModal: action.payload };
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };
		case 'SET_ERROR':
			return { ...state, error: action.payload ?? null };
		case 'SET_RAIL_EXPANDED':
			return { ...state, isRailExpanded: action.payload ?? false };
		case 'SET_SORT_ORDER':
			return { ...state, sortOrder: action.payload };
		case 'SET_SEARCH_TERM':
			return { ...state, searchTerm: action.payload };
		case 'SET_CURRENT_VIEW':
			return { ...state, currentView: action.payload };
		case 'SET_SELECTED_TAG':
			return { ...state, selectedTag: action.payload };
		default:
			return state;
	}
}

type AppStateContextType = {
	state: AppState;
	dispatch: React.Dispatch<Action>;
	// helpers
	fetchBooks: () => Promise<void>;
	fetchMetadata: (isbn: string) => Promise<void>;
	saveBook: (book: Partial<Book>) => Promise<void>;
	addBook: (book: Partial<Book>) => Promise<void>;
	deleteBook: (id: string | number) => Promise<void>;
	toggleFavorite: (id: string | number, currentFavorite: boolean) => Promise<void>;
};

const AppStateContext = React.createContext<AppStateContextType | undefined>(undefined);

// App wrapper - provides state, dispatch and async helpers to the rest of the frontend
export function AppStateProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = React.useReducer(reducer, initialState);

	const fetchBooks = React.useCallback(async () => {
		dispatch({ type: 'SET_LOADING', payload: true });
		try {
			const books = await apiFetchBooks();
			dispatch({ type: 'SET_BOOKS', payload: books });
			dispatch({ type: 'SET_ERROR', payload: null });
		} catch (err: any) {
			dispatch({ type: 'SET_ERROR', payload: String(err?.message ?? err) });
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}, []);

	const fetchMetadata = React.useCallback(async (isbn: string) => {
		dispatch({ type: 'SET_LOADING', payload: true });
		dispatch({ type: 'SET_ERROR', payload: null });
		try {
			const bookData = await apiFetchMetadata(isbn);
			
			// Check if we got ISBN-13 data and the original was ISBN-10
			const isIsbn10 = isbn.length === 10;
			const hasIsbn13 = bookData.isbn && bookData.isbn.length === 13 && bookData.isbn !== isbn;
			
			if (isIsbn10 && hasIsbn13) {
				// Refetch with ISBN-13 to get better cover image
				try {
					const betterBookData = await apiFetchMetadata(bookData.isbn);
					dispatch({ type: 'SET_FETCHED_BOOK_DATA', payload: betterBookData });
				} catch (refetchErr) {
					// If refetch fails, use original data
					console.warn('Failed to refetch with ISBN-13, using original data:', refetchErr);
					dispatch({ type: 'SET_FETCHED_BOOK_DATA', payload: bookData });
				}
			} else {
				dispatch({ type: 'SET_FETCHED_BOOK_DATA', payload: bookData });
			}
		} catch (err: any) {
			dispatch({ type: 'SET_ERROR', payload: String(err?.message ?? err) });
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false });
		}
	}, []);

	// saveBook mirrors the handleSave from your example but uses API helpers
	const saveBook = React.useCallback(
		async (book: Partial<Book>) => {
			dispatch({ type: 'SET_LOADING', payload: true });
			dispatch({ type: 'SET_ERROR', payload: null });
			try {
				let savedBook: Book | null = null;

				// build payload: include only non-empty values (same logic you had)
				const payload: Record<string, unknown> = {};
				Object.entries(book).forEach(([key, value]) => {
					if (key === 'id') return;
					if (value !== '' && value !== null && value !== undefined) {
						payload[key] = value as unknown;
					}
				});

				if (book.id) {
					// update
					savedBook = await updateBook(book.id as string | number, payload as any);
				} else {
					// create
					// ensure id is not present
					delete (payload as any).id;
					savedBook = await createBook(payload as any);
				}

				// update local state: add or update book
				if (savedBook) {
					dispatch({ type: 'ADD_OR_UPDATE_BOOK', payload: savedBook });
					// Atomically transition from edit to detail mode
					dispatch({ type: 'FINISH_EDITING', payload: savedBook });
				}
			} catch (err: any) {
				console.error('Error saving book', err);
				dispatch({ type: 'SET_ERROR', payload: String(err?.message ?? err) });
			} finally {
				dispatch({ type: 'SET_LOADING', payload: false });
			}
		},
		[],
	);

	// addBook specifically for adding new books (creates and closes modal)
	const addBook = React.useCallback(
		async (book: Partial<Book>) => {
			dispatch({ type: 'SET_LOADING', payload: true });
			dispatch({ type: 'SET_ERROR', payload: null });
		try {
			// build payload: include all values, ensuring required fields are present
			const payload: Record<string, unknown> = {
				cover_url: book.cover_url || '' // Always include cover_url as it's required by API
			};
			Object.entries(book).forEach(([key, value]) => {
				if (key === 'id') return;
				if (value !== '' && value !== null && value !== undefined) {
					payload[key] = value as unknown;
				}
			});

			// ensure id is not present
			delete (payload as any).id;
			const savedBook = await createBook(payload as any);				// update local state: add the new book
				if (savedBook) {
					dispatch({ type: 'ADD_OR_UPDATE_BOOK', payload: savedBook });
					// Close modal completely
					dispatch({ type: 'SET_SHOW_MODAL', payload: false });
					dispatch({ type: 'SET_SELECTED_BOOK', payload: null });
					dispatch({ type: 'SET_EDITING_BOOK', payload: null });
					dispatch({ type: 'SET_FETCHED_BOOK_DATA', payload: null });
				}
			} catch (err: any) {
				console.error('Error adding book', err);
				const errorMessage = String(err?.message ?? err);
				// Check if it's a duplicate error from backend
				if (errorMessage.includes('duplicate') || errorMessage.includes('already exists') || errorMessage.includes('422')) {
					dispatch({ type: 'SET_ERROR', payload: 'This book already exists in your collection.' });
				} else {
					dispatch({ type: 'SET_ERROR', payload: errorMessage });
				}
			} finally {
				dispatch({ type: 'SET_LOADING', payload: false });
			}
		},
		[],
	);

	// deleteBook removes a book from the backend and local state
	const deleteBook = React.useCallback(
		async (id: string | number) => {
			dispatch({ type: 'SET_LOADING', payload: true });
			dispatch({ type: 'SET_ERROR', payload: null });
			try {
				await apiDeleteBook(id);
				
				// Remove from local state
				dispatch({ type: 'DELETE_BOOK', payload: id });
				
				// Close modal if we're viewing the deleted book
				dispatch({ type: 'SET_SHOW_MODAL', payload: false });
				dispatch({ type: 'SET_SELECTED_BOOK', payload: null });
				dispatch({ type: 'SET_EDITING_BOOK', payload: null });
			} catch (err: any) {
				console.error('Error deleting book', err);
				dispatch({ type: 'SET_ERROR', payload: String(err?.message ?? err) });
			} finally {
				dispatch({ type: 'SET_LOADING', payload: false });
			}
		},
		[],
	);

	// toggleFavorite updates the favorite status of a book
	const toggleFavorite = React.useCallback(
		async (id: string | number, currentFavorite: boolean) => {
			dispatch({ type: 'SET_LOADING', payload: true });
			dispatch({ type: 'SET_ERROR', payload: null });
			
			// Optimistic update - immediately update local state
			const updatedBook = state.books.find(book => String(book.id) === String(id));
			if (updatedBook) {
				const optimisticBook = { ...updatedBook, favorite: !currentFavorite };
				dispatch({ type: 'ADD_OR_UPDATE_BOOK', payload: optimisticBook });
				
				// Update selected book if it's the one being toggled
				if (state.selectedBook && String(state.selectedBook.id) === String(id)) {
					dispatch({ type: 'SET_SELECTED_BOOK', payload: optimisticBook });
				}
			}
			
			try {
				const payload = { favorite: !currentFavorite };
				const savedBook = await updateBook(id, payload);
				
				// Update with server response
				dispatch({ type: 'ADD_OR_UPDATE_BOOK', payload: savedBook });
				
				// Update selected book if it's the one being toggled
				if (state.selectedBook && String(state.selectedBook.id) === String(id)) {
					dispatch({ type: 'SET_SELECTED_BOOK', payload: savedBook });
				}
			} catch (err: any) {
				console.error('Error toggling favorite', err);
				dispatch({ type: 'SET_ERROR', payload: String(err?.message ?? err) });
				
				// Revert optimistic update on error
				if (updatedBook) {
					dispatch({ type: 'ADD_OR_UPDATE_BOOK', payload: updatedBook });
					if (state.selectedBook && String(state.selectedBook.id) === String(id)) {
						dispatch({ type: 'SET_SELECTED_BOOK', payload: updatedBook });
					}
				}
			} finally {
				dispatch({ type: 'SET_LOADING', payload: false });
			}
		},
		[state.books, state.selectedBook],
	);

	const value = React.useMemo(
		() => ({ state, dispatch, fetchBooks, fetchMetadata, saveBook, addBook, deleteBook, toggleFavorite }),
		[state, dispatch, fetchBooks, fetchMetadata, saveBook, addBook, deleteBook, toggleFavorite],
	);

	return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
	const ctx = React.useContext(AppStateContext);
	if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
	return ctx;
}
