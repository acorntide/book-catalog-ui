/**
 * @file Book Grid component
 * Displays book cards in a grid with sorting functionality
 */

import * as React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import { useAppState } from '../context/appState';
import type { Book } from '../types/book';
import { processBooks } from '../utils/bookUtils';
import Card from './Card';

interface GridProps {
  handleModalOpen: (book?: Book | null) => void;
}

export default function Grid({ handleModalOpen }: GridProps) {
  const { state } = useAppState();
  const { books, sortOrder, searchTerm, currentView, selectedTag } = state;
  
  // Memoize expensive book processing to avoid recalculation on every render
  const processedBooks = React.useMemo(() => {
    return processBooks(books, {
      currentView,
      selectedTag,
      searchTerm,
      sortOrder
    });
  }, [books, currentView, selectedTag, searchTerm, sortOrder]);
  
  return (
    <MuiGrid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
    >
        {processedBooks.map((book) => (
          <MuiGrid key={book.id} size="auto" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card book={book} handleModalOpen={handleModalOpen} />
          </MuiGrid>
        ))}
    </MuiGrid>
  );
}