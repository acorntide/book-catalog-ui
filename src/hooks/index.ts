/**
 * @file Custom Hooks
 * Reusable custom hooks for common state patterns and logic
 */

import * as React from 'react';
import { useAppState } from '../context/appState';
import { processBooks, extractAllTags, countBooksWithTag } from '../utils/bookUtils';
import type { Book } from '../types/book';

/**
 * Hook for managing processed books with filtering, sorting, and searching
 * Centralizes the common pattern used in Grid and SortControls
 */
export function useProcessedBooks() {
  const { state } = useAppState();
  const { books, sortOrder, searchTerm, currentView, selectedTag } = state;

  const processedBooks = React.useMemo(() => {
    return processBooks(books, {
      currentView,
      selectedTag,
      searchTerm,
      sortOrder
    });
  }, [books, currentView, selectedTag, searchTerm, sortOrder]);

  const isFiltered = searchTerm && searchTerm.length >= 4 || currentView !== 'library';

  return {
    processedBooks,
    totalBooks: books.length,
    filteredCount: processedBooks.length,
    isFiltered
  };
}

/**
 * Hook for managing tag-related operations
 * Centralizes tag extraction and counting logic
 */
export function useBookTags() {
  const { state } = useAppState();
  const { books } = state;

  const allTags = React.useMemo(() => {
    return extractAllTags(books);
  }, [books]);

  const getTagCount = React.useCallback((tag: string) => {
    return countBooksWithTag(books, tag);
  }, [books]);

  return {
    allTags,
    getTagCount,
    tagCount: allTags.length
  };
}

/**
 * Hook for managing modal state and transitions
 * Centralizes modal-related state management
 */
export function useModalState() {
  const { state, dispatch } = useAppState();
  const { selectedBook, editingBook, fetchedBookData, showModal } = state;

  const openBookDetail = React.useCallback((book: Book) => {
    dispatch({ type: 'SET_SELECTED_BOOK', payload: book });
    dispatch({ type: 'SET_SHOW_MODAL', payload: true });
  }, [dispatch]);

  const openAddBook = React.useCallback(() => {
    dispatch({ type: 'SET_SELECTED_BOOK', payload: null });
    dispatch({ type: 'SET_SHOW_MODAL', payload: true });
  }, [dispatch]);

  const startEditing = React.useCallback((book: Book) => {
    dispatch({ type: 'SET_EDITING_BOOK', payload: book });
  }, [dispatch]);

  const closeModal = React.useCallback(() => {
    dispatch({ type: 'SET_SHOW_MODAL', payload: false });
    dispatch({ type: 'SET_SELECTED_BOOK', payload: null });
    dispatch({ type: 'SET_EDITING_BOOK', payload: null });
    dispatch({ type: 'SET_FETCHED_BOOK_DATA', payload: null });
    dispatch({ type: 'SET_ERROR', payload: null });
  }, [dispatch]);

  const cancelEditing = React.useCallback(() => {
    dispatch({ type: 'SET_EDITING_BOOK', payload: null });
  }, [dispatch]);

  // Determine modal mode
  const mode: 'detail' | 'edit' | 'edit-for-add' | 'add' =
    editingBook ? 'edit' : 
    fetchedBookData ? (selectedBook ? 'detail' : 'edit-for-add') : 
    selectedBook ? 'detail' : 
    'add';

  const bookToDisplay = selectedBook || fetchedBookData;

  return {
    showModal,
    mode,
    bookToDisplay,
    selectedBook,
    editingBook,
    fetchedBookData,
    openBookDetail,
    openAddBook,
    startEditing,
    closeModal,
    cancelEditing
  };
}

/**
 * Hook for managing navigation state
 * Centralizes navigation-related state management
 */
export function useNavigation() {
  const { state, dispatch } = useAppState();
  const { currentView, selectedTag, isRailExpanded } = state;

  const navigateTo = React.useCallback((view: 'library' | 'favorites' | 'tags') => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
    // Clear selected tag when switching views (except for tags view)
    if (view !== 'tags') {
      dispatch({ type: 'SET_SELECTED_TAG', payload: null });
    }
  }, [dispatch]);

  const selectTag = React.useCallback((tag: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'tag-filter' });
    dispatch({ type: 'SET_SELECTED_TAG', payload: tag });
  }, [dispatch]);

  const backToTags = React.useCallback(() => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'tags' });
    dispatch({ type: 'SET_SELECTED_TAG', payload: null });
  }, [dispatch]);

  const toggleRail = React.useCallback(() => {
    dispatch({ type: 'SET_RAIL_EXPANDED', payload: !isRailExpanded });
  }, [dispatch, isRailExpanded]);

  return {
    currentView,
    selectedTag,
    isRailExpanded,
    navigateTo,
    selectTag,
    backToTags,
    toggleRail
  };
}

/**
 * Hook for managing search functionality
 * Centralizes search-related state management
 */
export function useSearch() {
  const { state, dispatch } = useAppState();
  const { searchTerm } = state;

  const setSearchTerm = React.useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, [dispatch]);

  const clearSearch = React.useCallback(() => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
  }, [dispatch]);

  const isSearchActive = searchTerm && searchTerm.length >= 4;

  return {
    searchTerm,
    setSearchTerm,
    clearSearch,
    isSearchActive
  };
}