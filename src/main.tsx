import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App.tsx';
import { AppStateProvider } from './context/appState';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);