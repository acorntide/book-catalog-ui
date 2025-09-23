import {Box, Drawer as MuiDrawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Circle } from '@mui/icons-material'

interface DrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function Drawer({open, onClose}: DrawerProps) {
    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
            <List>
                {['DrawerOption1', 'DrawerOption2', 'DrawerOption3'].map((text) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Circle sx={{ fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );

    return (
            <MuiDrawer open={open} onClose={onClose}>
                {DrawerList}
            </MuiDrawer>
    );
}
