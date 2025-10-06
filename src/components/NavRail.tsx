/**
 * @file NavRail Component
 * Displays the expandable Nav Bar with icon-only or expanded icon+text view
 */

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Menu, MenuOpen, LocalLibrary, Favorite, Label } from '@mui/icons-material';
import { sx } from '../themes/themePrimitives';
import { useNavigation } from '../hooks';

const navigationItems = [
    { icon: LocalLibrary, label: 'Library', tooltip: 'Library', view: 'library' as const },
    { icon: Favorite, label: 'Favorites', tooltip: 'Favorites', view: 'favorites' as const },
    { icon: Label, label: 'Tags', tooltip: 'Tags', view: 'tags' as const },
];

export default function NavRail() {
    const { currentView, isRailExpanded, navigateTo, toggleRail } = useNavigation();
    
    return (
        <Box sx={sx.rail(isRailExpanded)}>
            {/* Menu toggle button */}
            {isRailExpanded ? (
                <Box sx={sx.railItemContainer(isRailExpanded)}>
                    <IconButton
                        onClick={toggleRail}
                        sx={sx.railIconButton}
                    >
                        <MenuOpen />
                    </IconButton>
                    <Typography 
                        variant="body2" 
                        sx={sx.railLabel(isRailExpanded)}
                    >
                        Navigation
                    </Typography>
                </Box>
            ) : (
                <IconButton
                    onClick={toggleRail}
                    sx={sx.railIconButton}
                >
                    <Menu />
                </IconButton>
            )}

            {/* Navigation items */}
            {navigationItems.map(({ icon: Icon, label, tooltip, view }) => (
                isRailExpanded ? (
                    <Box 
                        key={label} 
                        sx={{
                            ...sx.railItemContainer(isRailExpanded),
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                            backgroundColor: currentView === view ? 'action.selected' : 'transparent',
                        }}
                        onClick={() => navigateTo(view)}
                    >
                        <Tooltip title="" placement="right">
                            <IconButton sx={sx.railIconButton}>
                                <Icon />
                            </IconButton>
                        </Tooltip>
                        <Typography 
                            variant="body2" 
                            sx={sx.railLabel(isRailExpanded)}
                        >
                            {label}
                        </Typography>
                    </Box>
                ) : (
                    <Tooltip key={label} title={tooltip} placement="right">
                        <IconButton 
                            sx={{
                                ...sx.railIconButton,
                                backgroundColor: currentView === view ? 'action.selected' : 'transparent',
                            }}
                            onClick={() => navigateTo(view)}
                        >
                            <Icon />
                        </IconButton>
                    </Tooltip>
                )
            ))}
        </Box>
    );
}