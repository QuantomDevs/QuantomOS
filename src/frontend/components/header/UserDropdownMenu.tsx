import { Avatar, Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaGear, FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';
import { PiGlobeSimple, PiGlobeSimpleX } from 'react-icons/pi';

interface UserDropdownMenuProps {
    anchorEl: HTMLElement | null;
    isOpen: boolean;
    onClose: () => void;
    internetStatus: 'online' | 'offline' | 'checking';
    username: string | null;
    isAdmin: boolean;
    onEditDashboard: () => void;
    onOpenSettings: () => void;
    onLogout: () => void;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
    anchorEl,
    isOpen,
    onClose,
    internetStatus,
    username,
    isAdmin,
    onEditDashboard,
    onOpenSettings,
    onLogout,
}) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={isOpen}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 280,
                        mt: 1,
                        backgroundColor: 'var(--color-sidebar-background)',
                        border: '1px solid var(--color-border)',
                    }
                }
            }}
        >
            {/* Connection Status */}
            <Box sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {internetStatus === 'online' ? (
                        <PiGlobeSimple style={{ color: '#4caf50', fontSize: '1.5rem' }} />
                    ) : internetStatus === 'offline' ? (
                        <PiGlobeSimpleX style={{ color: '#f44336', fontSize: '1.5rem' }} />
                    ) : (
                        <PiGlobeSimple style={{ color: 'gray', fontSize: '1.5rem' }} />
                    )}
                    <Typography variant='body2'>
                        {internetStatus === 'online' ? 'Connected' : internetStatus === 'offline' ? 'Disconnected' : 'Checking...'}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* User Info Card */}
            <Box sx={{
                mx: 2,
                my: 1.5,
                p: 1.5,
                backgroundColor: 'var(--color-secondary-background)',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
            }}>
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'var(--color-primary-accent)',
                        fontSize: 20
                    }}
                >
                    {username ? username.charAt(0).toUpperCase() : <FaUser style={{ fontSize: 20 }} />}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant='body1' sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {username || 'User'}
                    </Typography>
                    <Typography variant='caption' sx={{ color: 'var(--color-muted-text)' }}>
                        {isAdmin ? 'Administrator' : 'User'}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* Actions */}
            <MenuItem
                onClick={() => {
                    onEditDashboard();
                    onClose();
                }}
                sx={{
                    py: 1.5,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                <ListItemIcon>
                    <FaEdit style={{ fontSize: '1.2rem', color: 'var(--color-primary-text)' }} />
                </ListItemIcon>
                <ListItemText primary='Edit Dashboard' />
            </MenuItem>

            <MenuItem
                onClick={() => {
                    onOpenSettings();
                    onClose();
                }}
                sx={{
                    py: 1.5,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                <ListItemIcon>
                    <FaGear style={{ fontSize: '1.2rem', color: 'var(--color-primary-text)' }} />
                </ListItemIcon>
                <ListItemText primary='Settings' />
            </MenuItem>

            <Divider />

            <MenuItem
                onClick={() => {
                    onLogout();
                    onClose();
                }}
                sx={{
                    py: 1.5,
                    color: 'var(--color-error)',
                    '&:hover': {
                        backgroundColor: 'rgba(198, 17, 46, 0.1)'
                    }
                }}
            >
                <ListItemIcon>
                    <FaArrowRightFromBracket style={{ fontSize: '1.2rem', color: 'var(--color-error)' }} />
                </ListItemIcon>
                <ListItemText primary='Logout' />
            </MenuItem>
        </Menu>
    );
};
