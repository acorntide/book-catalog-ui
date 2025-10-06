/**
 * @file Add Book Form Component
 * Form for entering ISBN and fetching book metadata
 */

import * as React from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useAppState } from '../../context/appState';

export default function AddBookForm() {
  const { state, fetchMetadata } = useAppState();
  const { isLoading, error, books } = state;
  const [isbn, setIsbn] = React.useState('');
  const [duplicateError, setDuplicateError] = React.useState('');

  const isValidIsbn = isbn.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIsbn) return;
    
    const cleanIsbn = isbn.trim();
    
    // Check for duplicate ISBN
    const existingBook = books.find(book => book.isbn === cleanIsbn);
    if (existingBook) {
      setDuplicateError(`A book with ISBN ${cleanIsbn} already exists in your collection: "${existingBook.title}"`);
      return;
    }
    
    // Clear duplicate error and fetch metadata
    setDuplicateError('');
    await fetchMetadata(cleanIsbn);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Enter an ISBN to fetch book metadata and add it to your collection.
      </Typography>

      <TextField
        label="ISBN"
        value={isbn}
        onChange={(e) => {
          setIsbn(e.target.value);
          if (duplicateError) setDuplicateError(''); // Clear duplicate error when user types
        }}
        placeholder="Enter ISBN (10+ characters)"
        fullWidth
        variant="outlined"
        disabled={isLoading}
        sx={{ mb: 3 }}
        helperText="Enter at least 10 characters to enable the Fetch button"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {duplicateError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {duplicateError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValidIsbn || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Fetching...' : 'Fetch'}
        </Button>
      </Box>
    </Box>
  );
}