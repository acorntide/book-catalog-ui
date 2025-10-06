/**
 * @file Tags View Component
 * Displays all unique tags as chips and allows filtering books by tag
 */

import * as React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { useAppState } from '../context/appState';
import Grid from './Grid';
import type { Book } from '../types/book';
import { extractAllTags, countBooksWithTag } from '../utils/bookUtils';
import { useNavigation } from '../hooks';

export default function TagsView({ handleModalOpen }: { handleModalOpen: (book?: Book | null) => void }) {
  const { state } = useAppState();
  const { books } = state;
  const { selectedTag, selectTag, backToTags } = useNavigation();

  // Get all unique tags from all books using centralized utility (memoized)
  const allTags = React.useMemo(() => {
    return extractAllTags(books);
  }, [books]);

  // Get books for selected tag
  const filteredBooks = React.useMemo(() => {
    if (!selectedTag) return [];
    return books.filter(book => 
      Array.isArray(book.tags) && 
      book.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
    );
  }, [books, selectedTag]);

  // If a tag is selected, show filtered books
  if (selectedTag) {
    return (
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Chip
            label={`← Back to Tags`}
            onClick={backToTags}
            variant="outlined"
            clickable
          />
          <Typography variant="h6">
            Books tagged with "{selectedTag}"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''})
          </Typography>
        </Stack>
        <Grid handleModalOpen={handleModalOpen} />
      </Box>
    );
  }

  // Show all tags
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Tags ({allTags.length})
      </Typography>
      
      {allTags.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No tags found. Add tags to books in the edit view to see them here.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {allTags.map((tag) => {
            // Count books with this tag using centralized utility
            const bookCount = countBooksWithTag(books, tag);

            return (
              <Chip
                key={tag}
                label={`${tag} (${bookCount})`}
                onClick={() => selectTag(tag)}
                variant="outlined"
                clickable
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  }
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}