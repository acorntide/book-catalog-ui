import * as React from 'react';
import { IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useColorScheme } from '@mui/material/styles';

export default function ColorModeSwitcher(props: React.ComponentProps<typeof IconButton>) {
  const { mode, setMode } = useColorScheme(); // 'light' | 'dark' | 'system'
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const resolved = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;
  const next = resolved === 'dark' ? 'light' : 'dark';

  // no side-effects required

  return (
    <Tooltip title={`Switch to ${next} mode`} enterDelay={600}>
      <IconButton
        onClick={() => {
          try {
            setMode(next);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('setMode error', e);
          }

          try {
            localStorage.setItem('mui-mode', next);
          } catch (e) {
            /* ignore storage errors (e.g., private mode) */
          }
        }}
        aria-label={`toggle color mode to ${next}`}
        {...props}
      >
        {resolved === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
}
