import * as React from 'react'
import { Box, Container, Fab } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Add } from '@mui/icons-material'
import AppBar from './components/AppBar';
import Grid from './components/Grid';
import Modal from './components/Modal';
import defaultTheme from './themes/defaultTheme';

export default function App() {
  // Modal open/close handlers
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
          <AppBar />
        <Box sx={{ m: 4 }}>

          <Grid handleModalOpen={handleModalOpen} />

          <Fab
            color="primary"
            onClick={handleModalOpen}
            aria-label="add"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
          >
            <Add />
          </Fab>

          <Modal open={modalOpen} handleClose={handleModalClose} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
