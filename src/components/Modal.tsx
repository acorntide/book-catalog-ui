/**
 * @file Modal Router
 * Chooses content based on app state and renders it inside ModalShell
 */


import { Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useAppState } from '../context/appState';
import type { Book } from '../types/book';
import ModalShell from './modal/ModalShell';
import DetailView from './modal/DetailView';
import AddBookForm from './modal/AddBookForm';
import EditBookForm, { type EditBookFormRef } from './modal/EditBookForm';
import * as React from 'react';

type ModalProps = {
  open: boolean;
  handleClose: () => void;
};

export default function Modal({ open, handleClose }: ModalProps) {
  const { state, dispatch, saveBook, addBook, deleteBook } = useAppState();
  const { selectedBook, editingBook, fetchedBookData } = state;
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  
  // Refs for form submission
  const editFormRef = React.useRef<EditBookFormRef>(null);
  const addFormRef = React.useRef<EditBookFormRef>(null);

  // Simple mode machine - now handles edit-for-add mode
  const mode: 'detail' | 'edit' | 'edit-for-add' | 'add' =
    editingBook ? 'edit' : 
    fetchedBookData ? (selectedBook ? 'detail' : 'edit-for-add') : 
    selectedBook ? 'detail' : 
    'add';

  // Determine which book to show in detail view
  const bookToDisplay = selectedBook || fetchedBookData;

  const handleEditSubmit = async (formData: Partial<Book>) => {
    if (editingBook) {
      await saveBook({ ...formData, id: editingBook.id });
    }
  };

  const handleAddSubmit = async (formData: Partial<Book>) => {
    await addBook(formData);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDisplay?.id) {
      await deleteBook(bookToDisplay.id);
      setShowDeleteConfirm(false);
    }
  };

  // Custom close handler that preserves state during edit mode
  const handleModalClose = () => {
    if (mode === 'edit' || mode === 'edit-for-add') {
      // Don't close modal during edit, just cancel editing
      return;
    }
    handleClose();
  };

  const headerActions =
    mode === 'detail' ? (
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => bookToDisplay && dispatch({ type: 'SET_EDITING_BOOK', payload: bookToDisplay })}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete
        </Button>
        <Button variant="text" color="secondary" onClick={handleClose}>
          Close
        </Button>
      </Stack>
    ) : mode === 'edit' ? (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          disabled={state.isLoading}
          onClick={() => editFormRef.current?.submit()}
        >
          {state.isLoading ? 'Saving...' : 'Submit'}
        </Button>
        <Button 
          variant="text" 
          color="secondary" 
          onClick={() => dispatch({ type: 'SET_EDITING_BOOK', payload: null })}
          disabled={state.isLoading}
        >
          Cancel
        </Button>
      </Stack>
    ) : mode === 'edit-for-add' ? (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          disabled={state.isLoading}
          onClick={() => addFormRef.current?.submit()}
        >
          {state.isLoading ? 'Adding...' : 'Add Book'}
        </Button>
        <Button 
          variant="text" 
          color="secondary" 
          onClick={() => {
            dispatch({ type: 'SET_FETCHED_BOOK_DATA', payload: null });
          }}
          disabled={state.isLoading}
        >
          Cancel
        </Button>
      </Stack>
    ) : (
      <Stack direction="row" spacing={1}>
        <Button variant="text" color="secondary" onClick={handleClose}>
          Close
        </Button>
      </Stack>
    );

  return (
    <>
      <ModalShell
        open={open}
        onClose={handleModalClose}
        title={mode === 'detail' ? bookToDisplay?.title || 'Book' : 
               mode === 'edit' ? 'Edit Book' : 
               mode === 'edit-for-add' ? 'Add Book' : 
               'Add Book'}
        headerActions={headerActions}
      >
        {mode === 'detail' && bookToDisplay ? (
          <DetailView book={bookToDisplay} />
        ) : mode === 'edit' && editingBook ? (
          <EditBookForm 
            ref={editFormRef}
            key={`edit-${editingBook.id}`}
            book={editingBook} 
            onSubmit={handleEditSubmit}
            isLoading={state.isLoading}
          />
        ) : mode === 'edit-for-add' && fetchedBookData ? (
          <EditBookForm 
            ref={addFormRef}
            key={`add-${fetchedBookData.isbn}`}
            book={fetchedBookData} 
            onSubmit={handleAddSubmit}
            isLoading={state.isLoading}
          />
        ) : (
          <AddBookForm />
        )}
      </ModalShell>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{bookToDisplay?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
