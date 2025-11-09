import { Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import { useAppContext } from '../../context/useAppContext';

const KeyBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box sx={{
        px: 1,
        py: 0.5,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 0.5,
        fontSize: children === '⌘' ? { xs: '1.125rem', sm: '1.25rem' } : { xs: '0.875rem', sm: '1rem' },
        fontFamily: 'monospace',
        minWidth: '24px',
        height: '28px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        {children}
    </Box>
);

export const KeyboardShortcutsPanel: React.FC = () => {
    const { pages } = useAppContext();

    // Detect user's OS for appropriate command key display
    const isMac = useMemo(() => {
        return typeof navigator !== 'undefined' &&
               (navigator.platform.indexOf('Mac') > -1 || navigator.userAgent.indexOf('Mac') > -1);
    }, []);

    const commandKey = isMac ? '⌘' : 'Ctrl';

    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                Keyboard Shortcuts
            </Typography>

            <Typography variant='body2' sx={{ mb: 4, opacity: 0.8 }}>
                Use these keyboard shortcuts to quickly navigate and control your dashboard.
            </Typography>

            {/* Search Shortcuts */}
            <Box sx={{ mb: 4 }}>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>
                    Search
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    bgcolor: 'var(--color-secondary-background)',
                    borderRadius: 1,
                    border: '2px solid var(--color-border)'
                }}>
                    <Typography variant='body2'>Focus search bar</Typography>
                    <Box sx={{
                        display: 'flex',
                        gap: 0.5,
                        alignItems: 'center'
                    }}>
                        <KeyBadge>{commandKey}</KeyBadge>
                        <Typography variant='body2'>+</Typography>
                        <KeyBadge>K</KeyBadge>
                    </Box>
                </Box>
            </Box>

            {/* Page Navigation Shortcuts */}
            <Box>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>
                    Page Navigation
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    {/* Home page shortcut */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        bgcolor: 'var(--color-secondary-background)',
                        borderRadius: 1,
                        border: '2px solid var(--color-border)'
                    }}>
                        <Typography variant='body2'>Go to Home page</Typography>
                        <Box sx={{
                            display: 'flex',
                            gap: 0.5,
                            alignItems: 'center'
                        }}>
                            <KeyBadge>{commandKey}</KeyBadge>
                            <Typography variant='body2'>+</Typography>
                            <KeyBadge>1</KeyBadge>
                        </Box>
                    </Box>

                    {/* Custom pages shortcuts */}
                    {pages && pages.length > 0 && pages.map((page, index) => (
                        <Box key={page.id} sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            bgcolor: 'var(--color-secondary-background)',
                            borderRadius: 1,
                            border: '2px solid var(--color-border)'
                        }}>
                            <Typography variant='body2'>Go to {page.name}</Typography>
                            <Box sx={{
                                display: 'flex',
                                gap: 0.5,
                                alignItems: 'center'
                            }}>
                                <KeyBadge>{commandKey}</KeyBadge>
                                <Typography variant='body2'>+</Typography>
                                <KeyBadge>{index + 2}</KeyBadge>
                            </Box>
                        </Box>
                    ))}

                    {/* Settings page shortcut */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        bgcolor: 'var(--color-secondary-background)',
                        borderRadius: 1,
                        border: '2px solid var(--color-border)'
                    }}>
                        <Typography variant='body2'>Go to Settings page</Typography>
                        <Box sx={{
                            display: 'flex',
                            gap: 0.5,
                            alignItems: 'center'
                        }}>
                            <KeyBadge>{commandKey}</KeyBadge>
                            <Typography variant='body2'>+</Typography>
                            <KeyBadge>9</KeyBadge>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
