/**
 * @file Edit Book Form Component
 * Editable form that mirrors the DetailView layout with TextField components
 */

import * as React from 'react';
import { Box, Stack, Typography, TextField, Chip, Paper, ClickAwayListener } from '@mui/material';
import type { Book } from '../../types/book';
import { sx } from '../../themes/themePrimitives';
import { useAppState } from '../../context/appState';
import SafeImage from '../SafeImage';

export interface EditBookFormRef {
  submit: () => void;
}

interface EditBookFormProps {
  book: Book;
  onSubmit: (formData: Partial<Book>) => void;
  isLoading?: boolean;
}

const EditBookForm = React.forwardRef<EditBookFormRef, EditBookFormProps>((
  { book, onSubmit }: EditBookFormProps, 
  ref
) => {
  
  const [formData, setFormData] = React.useState({
    title: book.title || '',
    authors: Array.isArray(book.authors) ? book.authors : [],
    isbn: book.isbn || '',
    publisher: book.publisher || '',
    publishedDate: book.publishedDate || '',
    categories: Array.isArray(book.categories) ? book.categories : [],
    tags: Array.isArray(book.tags) ? book.tags : [],
    description: book.description || '',
    cover_url: book.cover_url || ''
  });

  // Expose submit function via ref
  React.useImperativeHandle(ref, () => ({
    submit: () => onSubmit(formData)
  }), [formData, onSubmit]);

  const isAddMode = !book.id;

function EditableRow({ 
  label, 
  value, 
  onChange, 
  multiline = false,
  disabled = false 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  multiline?: boolean;
  disabled?: boolean;
}) {
  return (
    <Stack direction="row" spacing={1} alignItems={multiline ? "flex-start" : "center"} sx={{ minHeight: 56 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, mt: multiline ? 1.5 : 0, fontSize: '0.875rem' }}>
        {label}
      </Typography>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        multiline={multiline}
        minRows={multiline ? 3 : 1}
        maxRows={multiline ? 6 : 1}
        disabled={disabled}
        size="small"
        sx={{ 
          flex: 1,
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
          }
        }}
      />
    </Stack>
  );
}

function EditableChipRow({
  label,
  value,
  onChange
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [inputValue, setInputValue] = React.useState('');
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newValue = inputValue.trim();
      if (!value.includes(newValue)) {
        onChange([...value, newValue]);
      }
      setInputValue('');
    }
  };

  const handleDelete = (chipToDelete: string) => {
    onChange(value.filter(chip => chip !== chipToDelete));
  };

  return (
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ minHeight: 56 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, mt: 1.5, fontSize: '0.875rem' }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, minHeight: value.length > 0 ? 32 : 0 }}>
          {value.map((item) => (
            <Chip
              key={item}
              label={item}
              onDelete={() => handleDelete(item)}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
        <TextField
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${label.toLowerCase()} (press Enter)`}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
            }
          }}
        />
      </Box>
    </Stack>
  );
}

function EditableTagRow({
  label,
  value,
  onChange
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const { state } = useAppState();
  const [inputValue, setInputValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  
  // Get all existing tags from all books (flattened and unique) - memoized
  const allExistingTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    state.books.forEach(book => {
      if (Array.isArray(book.tags)) {
        book.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            tagSet.add(tag.toLowerCase());
          }
        });
      }
    });
    return Array.from(tagSet).sort();
  }, [state.books]);
  
  // Filter suggestions based on input
  const suggestions = React.useMemo(() => {
    if (!inputValue || inputValue.length < 1) return [];
    
    const lowercaseInput = inputValue.toLowerCase();
    return allExistingTags
      .filter(tag => 
        tag.includes(lowercaseInput) && 
        !value.map(v => v.toLowerCase()).includes(tag)
      )
      .slice(0, 8); // Limit to 8 suggestions
  }, [inputValue, allExistingTags, value]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.length > 0);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newValue = inputValue.trim();
      if (!value.map(v => v.toLowerCase()).includes(newValue.toLowerCase())) {
        onChange([...value, newValue]);
      }
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleDelete = (chipToDelete: string) => {
    onChange(value.filter(chip => chip !== chipToDelete));
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    // Find the original case version from existing tags
    const originalTag = allExistingTags.find(tag => tag.toLowerCase() === suggestion.toLowerCase()) || suggestion;
    if (!value.map(v => v.toLowerCase()).includes(originalTag.toLowerCase())) {
      onChange([...value, originalTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ minHeight: 56 }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, mt: 1.5, fontSize: '0.875rem' }}>
          {label}
        </Typography>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, minHeight: value.length > 0 ? 32 : 0 }}>
            {value.map((item) => (
              <Chip
                key={item}
                label={item}
                onDelete={() => handleDelete(item)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
          <TextField
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
            placeholder={`Add ${label.toLowerCase()} (press Enter)`}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
              }
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: 200,
                overflow: 'auto',
                mt: 0.5,
              }}
            >
              {suggestions.map((suggestion) => (
                <Box
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {suggestion}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      </Stack>
    </ClickAwayListener>
  );
}

  return (
    <Box>
      <Stack direction="row" spacing={3} alignItems="flex-start">
        {/* Cover - not editable */}
        <Box sx={sx.coverViewport}>
          <SafeImage
            src={book.cover_url || ''}
            alt={book.title || 'Book cover'}
            sx={sx.coverImg}
          />
        </Box>

        {/* Complete editable form */}
        <Stack spacing={2} sx={{ minWidth: 0, flex: 1 }}>
          <EditableRow
            label="Title"
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
          />
          
          <EditableChipRow
            label="Authors"
            value={formData.authors}
            onChange={(value) => setFormData(prev => ({ ...prev, authors: value }))}
          />
          
          <EditableRow
            label="Publisher"
            value={formData.publisher}
            onChange={(value) => setFormData(prev => ({ ...prev, publisher: value }))}
          />
          
          <EditableRow
            label="ISBN"
            value={formData.isbn}
            onChange={(value) => setFormData(prev => ({ ...prev, isbn: value }))}
            disabled={!isAddMode}
          />
          
          <EditableRow
            label="Published"
            value={formData.publishedDate}
            onChange={(value) => setFormData(prev => ({ ...prev, publishedDate: value }))}
          />
          
          <EditableChipRow
            label="Categories"
            value={formData.categories}
            onChange={(value) => setFormData(prev => ({ ...prev, categories: value }))}
          />
          
          <EditableTagRow
            label="Tags"
            value={formData.tags}
            onChange={(value) => setFormData(prev => ({ ...prev, tags: value }))}
          />
          
          <EditableRow
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            multiline
          />
        </Stack>
      </Stack>
    </Box>
  );
});

EditBookForm.displayName = 'EditBookForm';

export default EditBookForm;