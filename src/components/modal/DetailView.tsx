/**
 * @file Book Detail Modal Content
 * Read-only book detail layout with cover image on left and book metadata on right
 */

import * as React from 'react';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import type { Book } from '../../types/book';
import { sx } from '../../themes/themePrimitives';
import SafeImage from '../SafeImage';
import { useAppState } from '../../context/appState';
import { getAuthorsDisplayText, getCategoriesDisplayText, getTagsDisplayText } from '../../utils/bookUtils';

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ minHeight: 56 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontSize: '0.875rem' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{value}</Typography>
    </Stack>
  );
}

export default function DetailView({ book }: { book: Book }) {
  const { toggleFavorite } = useAppState();
  
  const handleFavoriteToggle = () => {
    if (book.id) {
      toggleFavorite(book.id, book.favorite || false);
    }
  };

  return (
    <Stack direction="row" spacing={3} alignItems="flex-start">
      {/* Cover */}
      <Box sx={sx.coverViewport}>
        <SafeImage
          src={book.cover_url || ''}
          alt={book.title || 'Book cover'}
          sx={sx.coverImg}
        />
      </Box>

      {/* Metadata */}
      <Stack spacing={2} sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {book.title}
          </Typography>
          <IconButton
            onClick={handleFavoriteToggle}
            sx={{ 
              color: book.favorite ? '#d32f2f' : 'action.active',
              '&:hover': {
                color: book.favorite ? '#b71c1c' : '#d32f2f',
              }
            }}
            aria-label={book.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {book.favorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
        <InfoRow
          label="Authors"
          value={getAuthorsDisplayText(book)}
        />
        <InfoRow
          label="Publisher"
          value={book.publisher}
        />
        <InfoRow label="ISBN" value={book.isbn} />
        <InfoRow label="Published" value={book.publishedDate} />
        <InfoRow
          label="Categories"
          value={getCategoriesDisplayText(book)}
        />
        <InfoRow
          label="Tags"
          value={getTagsDisplayText(book)}
        />

        {book.description && (
          <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ minHeight: 56 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, mt: 1.5, fontSize: '0.875rem' }}>
              Description
            </Typography>
            <Box
              sx={{
                flex: 1,
                maxHeight: 180,
                overflow: 'auto',
                pr: 1,
                whiteSpace: 'pre-line',
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{book.description}</Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
