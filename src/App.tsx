/**
 * @file Root app shell 
 * Provides the theme, providers and top-level layout and routines
 */

import * as React from 'react'
import { Box, Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from './components/AppBar';
import Grid from './components/Grid';
import Modal from './components/Modal';
import NavRail from './components/NavRail';
import SortControls from './components/SortControls';
import TagsView from './components/TagsView';
import defaultTheme from './themes/defaultTheme';
import { sx } from './themes/themePrimitives';
import { useAppState } from './context/appState';
import { useModalState } from './hooks';

export default function App() {
  const { state, fetchBooks } = useAppState();
  const { currentView } = state;
  const { showModal, openBookDetail, openAddBook, closeModal } = useModalState();

  React.useEffect(() => { fetchBooks(); }, [fetchBooks]);

  // Wrapper to handle the optional book parameter from components
  const handleModalOpen = React.useCallback((book?: any) => {
    if (book) {
      openBookDetail(book);
    } else {
      openAddBook();
    }
  }, [openBookDetail, openAddBook]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline enableColorScheme />
      <Container maxWidth={false} disableGutters>
        <Box sx={sx.appRoot(state.isRailExpanded)}>
          <NavRail />
          <AppBar onAddBook={() => handleModalOpen(null)} isRailExpanded={state.isRailExpanded} />
          <Box sx={sx.content}>
            {currentView === 'tags' || currentView === 'tag-filter' ? (
              <TagsView handleModalOpen={handleModalOpen} />
            ) : (
              <>
                <SortControls />
                <Grid handleModalOpen={handleModalOpen} />
              </>
            )}
          </Box>
        </Box>

        <Modal 
          open={showModal}
          handleClose={closeModal}
        />
      </Container>
    </ThemeProvider>
  );
}
