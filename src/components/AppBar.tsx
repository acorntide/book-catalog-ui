/**
 * @file AppBar Component
 * Displays the header with logo, title and search bar
 */

import * as React from 'react';
import { AppBar as MuiAppBar, Box, Toolbar, Typography, InputBase, Button } from '@mui/material';
import { Search as SearchIcon, LibraryBooks } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import ColorModeSwitcher from '../themes/ColorModeSwitcher.tsx';
import { sx } from '../themes/themePrimitives.ts';
import { useAppState } from '../context/appState.tsx';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.mode === 'light' 
        ? alpha(theme.palette.common.black, 0.08)  // darker tint for light mode
        : alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: theme.palette.mode === 'light'
            ? alpha(theme.palette.common.black, 0.12)
            : alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '16ch',  // increased from 12ch
            '&:focus': {
                width: '24ch',  // increased from 20ch
            },
        },
    },
}));

interface AppBarProps {
    onAddBook: () => void;
    isRailExpanded?: boolean;
}

export default function AppBar({ onAddBook, isRailExpanded = false }: AppBarProps) {
    const { dispatch } = useAppState();
    const [localSearchTerm, setLocalSearchTerm] = React.useState('');
    const [isScrolled, setIsScrolled] = React.useState(false);

    // Scroll detection effect
    React.useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const shouldBeScrolled = scrollTop > 20;
            if (shouldBeScrolled !== isScrolled) {
                setIsScrolled(shouldBeScrolled);
            }
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Check initial scroll position
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchTerm(value);
        
        // Only dispatch search when 4+ characters or empty (to clear search)
        if (value.length >= 4 || value.length === 0) {
            dispatch({ type: 'SET_SEARCH_TERM', payload: value });
        }
    };

    return (
        <Box sx={sx.headerWrap(isRailExpanded)}>
            <MuiAppBar
                position='static'
                elevation={0}
                color='inherit'
                sx={isScrolled ? sx.appBarScrolled : sx.appBarSeamless}
            >
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <LibraryBooks 
                            sx={{ 
                                mr: 1, 
                                fontSize: '1.8rem',
                                color: 'primary.main'
                            }} 
                        />
                        <Typography
                            variant='h5'
                            component='h1'
                            sx={{ 
                                fontFamily: '"Roboto", sans-serif',
                                fontWeight: 700,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: 'primary.main',
                                textShadow: (theme) => theme.palette.mode === 'light' 
                                    ? '0 1px 2px rgba(0,0,0,0.1)'
                                    : '0 1px 2px rgba(255,255,255,0.1)',
                                display: {
                                    xs: 'none',
                                    sm: 'block'
                                }
                            }}
                        >
                            BOOKS
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        variant="contained"
                        onClick={onAddBook}
                        sx={{ mr: 2 }}
                    >
                        + Add Book
                    </Button>
                    <Search>
                        <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                        <StyledInputBase
                            placeholder='Search...'
                            value={localSearchTerm}
                            onChange={handleSearchChange}
                            inputProps={{
                                'aria-label': 'search'
                            }}
                        />
                    </Search>
                    <ColorModeSwitcher sx={{ ml: 3 }} />
                </Toolbar>
            </MuiAppBar>
        </Box>
    );
}
