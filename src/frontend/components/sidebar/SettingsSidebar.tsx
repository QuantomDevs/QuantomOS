import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, Box, Drawer, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';

import { useSettingsSidebar } from '../../context/SettingsSidebarContext';
import { SettingsForm } from '../forms/SettingsForm';

export const SettingsSidebar: React.FC = () => {
    const { isOpen, closeSidebar } = useSettingsSidebar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));

    // Determine sidebar width based on screen size with enhanced widths for larger screens
    const sidebarWidth = isMobile ? '95%' : isTablet ? '480px' : isLargeDesktop ? '640px' : '560px';

    // Handle ESC key to close sidebar
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                closeSidebar();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            // Lock body scroll when sidebar is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeSidebar]);

    // Focus management - focus close button when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                const closeButton = document.querySelector('[aria-label="Close settings"]') as HTMLElement;
                if (closeButton) {
                    closeButton.focus();
                }
            }, 100);
        }
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <Backdrop
                open={isOpen}
                onClick={closeSidebar}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer - 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            />

            {/* Sidebar Drawer */}
            <Drawer
                anchor='right'
                open={isOpen}
                onClose={closeSidebar}
                variant='persistent'
                sx={{
                    '& .MuiDrawer-paper': {
                        width: sidebarWidth,
                        maxWidth: '100vw',
                        boxSizing: 'border-box',
                        backgroundColor: 'var(--color-sidebar-background)',
                        transition: 'transform 0.3s ease-in-out',
                    }
                }}
                ModalProps={{
                    keepMounted: false,
                }}
                role='dialog'
                aria-modal='true'
                aria-labelledby='settings-sidebar-title'
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            pb: 0,
                        }}
                    >
                        <Typography variant='h5' id='settings-sidebar-title' sx={{ fontWeight: 600, visibility: 'hidden' }}>
                            Settings
                        </Typography>
                        <IconButton
                            onClick={closeSidebar}
                            aria-label='Close settings'
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 28 }} />
                        </IconButton>
                    </Box>

                    {/* Settings Form Content */}
                    <Box sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        px: 1
                    }}>
                        <SettingsForm />
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};
