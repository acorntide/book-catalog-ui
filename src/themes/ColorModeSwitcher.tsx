import * as React from 'react';
import { useMediaQuery, IconButton, SxProps, Tooltip } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { DarkMode, LightMode } from '@mui/icons-material';

export default function ColorModeSwitcher({ sx }: { sx?: SxProps }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const preferredMode = prefersDarkMode ? 'dark' : 'light';

    const { mode, setMode } = useColorScheme();
    const paletteMode = !mode || mode === 'system' ? preferredMode : mode;

    const toggleColorMode = React.useCallback(() => {
        setMode(paletteMode === 'light' ? 'dark' : 'light');
    }, [paletteMode, setMode]);

    return (
        <Tooltip
            title={`${paletteMode === 'dark' ? 'Light' : 'Dark'} mode`}
            enterDelay={1000}
        >
            <IconButton
                size="small"
                aria-label={`Switch to ${paletteMode === 'dark' ? 'light' : 'dark'} mode`}
                onClick={toggleColorMode}
                sx={sx}
            >
                {paletteMode === 'dark' ? (
                    <LightMode sx={{ color: 'white' }} />
                ) : (
                    <DarkMode sx={{ color: 'white' }} />
                )}
            </IconButton>
        </Tooltip>
    );
}