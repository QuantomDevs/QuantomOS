import { Box, Button, Divider, Typography } from '@mui/material';
import React from 'react';
import { FaCog, FaDatabase, FaImage, FaKeyboard, FaLock, FaPalette, FaTh, FaBook, FaStore } from 'react-icons/fa';
import { FaRightFromBracket } from 'react-icons/fa6';

import { DashApi } from '../../api/dash-api';
import { useAppContext } from '../../context/useAppContext';
import { ToastManager } from '../toast/ToastManager';
import { useNavigate } from 'react-router-dom';

export type SettingsCategory =
    | 'general'
    | 'backup'
    | 'keyboard'
    | 'security'
    | 'background'
    | 'grid'
    | 'color';

interface SettingsCategorySidebarProps {
    selectedCategory: SettingsCategory;
    onSelectCategory: (category: SettingsCategory) => void;
}

export const SettingsCategorySidebar: React.FC<SettingsCategorySidebarProps> = ({
    selectedCategory,
    onSelectCategory
}) => {
    const { username, setIsLoggedIn, setUsername, setIsAdmin, refreshDashboard, editMode, setEditMode } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Turn off edit mode if it's active
            if (editMode) {
                setEditMode(false);
            }

            await DashApi.logout();

            // Reset all auth-related state variables in the correct order
            setIsAdmin(false);
            setUsername(null);
            setIsLoggedIn(false);

            localStorage.removeItem('username');

            // Force refresh dashboard
            refreshDashboard();

            // Navigate to login page
            navigate('/login');
            ToastManager.success('Logged out');
        } catch (error) {
            console.error('Logout error:', error);
            ToastManager.error('Logout error');
        }
    };

    const categories = [
        {
            section: 'General',
            items: [
                { id: 'general' as SettingsCategory, label: 'General Settings', icon: FaCog },
                { id: 'backup' as SettingsCategory, label: 'Backup & Data', icon: FaDatabase },
                { id: 'keyboard' as SettingsCategory, label: 'Keyboard Shortcuts', icon: FaKeyboard },
                { id: 'security' as SettingsCategory, label: 'Security', icon: FaLock },
            ]
        },
        {
            section: 'Appearance',
            items: [
                { id: 'background' as SettingsCategory, label: 'Background & Icons', icon: FaImage },
                { id: 'grid' as SettingsCategory, label: 'Grid Customization', icon: FaTh },
                { id: 'color' as SettingsCategory, label: 'Color Customization', icon: FaPalette },
            ]
        }
    ];

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
        }}>
            {/* Categories */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {categories.map((section, sectionIndex) => (
                    <Box key={section.section} sx={{ mb: sectionIndex < categories.length - 1 ? 3 : 0 }}>
                        <Typography
                            variant='caption'
                            sx={{
                                px: 1,
                                mb: 1,
                                display: 'block',
                                color: 'var(--color-secondary-text)',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            {section.section}
                        </Typography>
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const isSelected = selectedCategory === item.id;

                            return (
                                <Button
                                    key={item.id}
                                    fullWidth
                                    onClick={() => onSelectCategory(item.id)}
                                    startIcon={<Icon style={{ fontSize: '1.2rem' }} />}
                                    sx={{
                                        justifyContent: 'flex-start',
                                        textAlign: 'left',
                                        px: 2,
                                        py: 1.5,
                                        mb: 0.5,
                                        borderRadius: '0.5rem',
                                        color: isSelected ? 'var(--color-primary-accent)' : 'var(--color-primary-text)',
                                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                        fontWeight: isSelected ? 600 : 400,
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        '&:hover': {
                                            backgroundColor: isSelected
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'var(--color-secondary-font)',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </Box>
                ))}

                {/* Divider before bottom section */}
                <Divider sx={{ my: 2, borderColor: 'var(--color-border)' }} />

                {/* Marketplace Button */}
                <Button
                    fullWidth
                    startIcon={<FaStore style={{ fontSize: '1.2rem' }} />}
                    onClick={() => {
                        // TODO: Open marketplace
                        ToastManager.info('Marketplace coming soon!');
                    }}
                    sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        px: 2,
                        py: 1.5,
                        mb: 0.5,
                        borderRadius: '0.5rem',
                        color: 'var(--color-primary-text)',
                        backgroundColor: 'transparent',
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        '&:hover': {
                            backgroundColor: 'var(--color-secondary-font)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    Marketplace
                </Button>

                {/* Documentation Button */}
                <Button
                    fullWidth
                    startIcon={<FaBook style={{ fontSize: '1.2rem' }} />}
                    component='a'
                    href='https://docs.snenjih.de'
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        px: 2,
                        py: 1.5,
                        borderRadius: '0.5rem',
                        color: 'var(--color-primary-text)',
                        backgroundColor: 'transparent',
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        '&:hover': {
                            backgroundColor: 'var(--color-secondary-font)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    Documentation
                </Button>
            </Box>

            {/* Bottom Section - User Info and Logout */}
            <Box sx={{
                borderTop: '1px solid var(--color-border)',
                p: 2,
                backgroundColor: 'transparent'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1
                }}>
                    <Typography
                        variant='body2'
                        sx={{
                            color: 'var(--color-primary-text)',
                            fontWeight: 500
                        }}
                    >
                        {username || 'User'}
                    </Typography>
                    <Button
                        size='small'
                        onClick={handleLogout}
                        sx={{
                            minWidth: 'auto',
                            p: 1,
                            borderRadius: '0.5rem',
                            color: 'var(--color-primary-text)',
                            '&:hover': {
                                backgroundColor: 'var(--color-secondary-font)',
                            }
                        }}
                    >
                        <FaRightFromBracket style={{ fontSize: '1.1rem' }} />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
