/**
 * @file Sort Controls Component
 * Provides sorting options for the book grid
 */

import * as React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { Sort } from '@mui/icons-material';
import { useAppState } from '../context/appState';
import type { SortOption } from '../context/appState';
import { processBooks } from '../utils/bookUtils';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
  { value: 'author-asc', label: 'Author A-Z' },
  { value: 'author-desc', label: 'Author Z-A' },
];

export default function SortControls() {
  const { state, dispatch } = useAppState();
  const { sortOrder, books, searchTerm, currentView, selectedTag } = state;

  const handleSortChange = (value: SortOption) => {
    dispatch({ type: 'SET_SORT_ORDER', payload: value });
  };

  // Filter books using centralized utility (memoized)
  const filteredBooks = React.useMemo(() => {
    return processBooks(books, {
      currentView,
      selectedTag,
      searchTerm,
      sortOrder: 'title-asc' // Use basic sort just for counting
    });
  }, [books, currentView, selectedTag, searchTerm]);
  
  const displayCount = filteredBooks.length;
  const isFiltered = searchTerm && searchTerm.length >= 4 || currentView !== 'library';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        px: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {isFiltered 
          ? `${displayCount} of ${books.length} book${books.length !== 1 ? 's' : ''}`
          : `${displayCount} book${displayCount !== 1 ? 's' : ''}`
        }
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Sort fontSize="small" color="action" />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortOrder}
            label="Sort by"
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}