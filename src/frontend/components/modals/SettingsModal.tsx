import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaGlobe } from 'react-icons/fa';

import { useSettingsModal } from '../../context/SettingsModalContext';
import { useInternetStatus } from '../../hooks/useInternetStatus';
import { BackgroundIconsSettings } from '../settings/BackgroundIconsSettings';
import { BackupDataPanel } from '../settings/BackupDataPanel';
import { GeneralSettingsPanel } from '../settings/GeneralSettingsPanel';
import { KeyboardShortcutsPanel } from '../settings/KeyboardShortcutsPanel';
import { PasswordChange } from '../settings/PasswordChange';
import { SettingsCategory, SettingsCategorySidebar } from '../settings/SettingsCategorySidebar';
import { ColorCustomization } from '../sidebar/ColorCustomization';
import { GridSettings } from '../sidebar/GridSettings';

export const SettingsModal: React.FC = () => {
    const { isOpen, closeModal } = useSettingsModal();
    const { internetStatus } = useInternetStatus();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedCategory, setSelectedCategory] = useState<SettingsCategory>('general');

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            // Lock body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeModal]);

    // Render the appropriate content panel based on selected category
    const renderContentPanel = () => {
        switch (selectedCategory) {
            case 'general':
                return <GeneralSettingsPanel />;
            case 'backup':
                return <BackupDataPanel />;
            case 'keyboard':
                return <KeyboardShortcutsPanel />;
            case 'security':
                return (
                    <Box>
                        <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                            Security
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 4, opacity: 0.8 }}>
                            Manage your account security settings.
                        </Typography>
                        <PasswordChange />
                    </Box>
                );
            case 'background':
                return <BackgroundIconsSettings />;
            case 'grid':
                return (
                    <Box>
                        <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                            Grid Customization
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 4, opacity: 0.8 }}>
                            Customize widget size, spacing, and border radius. All changes are saved automatically.
                        </Typography>
                        <GridSettings />
                    </Box>
                );
            case 'color':
                return <ColorCustomization />;
            default:
                return <GeneralSettingsPanel />;
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={closeModal}
            aria-labelledby='settings-modal-title'
            aria-describedby='settings-modal-description'
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }
            }}
        >
            <Box
                sx={{
                    width: 'min(90vw, 1200px)',
                    height: 'min(85vh, 800px)',
                    backgroundColor: 'var(--color-main-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    outline: 'none'
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 3,
                        py: 2,
                        borderBottom: '1px solid var(--color-border)'
                    }}
                >
                    <Typography
                        id='settings-modal-title'
                        variant='h5'
                        sx={{
                            fontWeight: 600,
                            color: 'var(--color-primary-text)'
                        }}
                    >
                        Settings
                    </Typography>

                    {/* Connection Status and Close Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Connection Status Indicator */}
                        <Tooltip
                            title={internetStatus === 'online' ? 'Internet connected' : 'Internet disconnected'}
                            placement='bottom'
                            arrow
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    cursor: 'help'
                                }}
                            >
                                <FaGlobe
                                    style={{
                                        fontSize: '1.2rem',
                                        color: internetStatus === 'online'
                                            ? '#4caf50'
                                            : '#f44336'
                                    }}
                                />
                            </Box>
                        </Tooltip>

                        {/* Close Button */}
                        <IconButton
                            onClick={closeModal}
                            aria-label='Close settings'
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 28, color: 'var(--color-primary-text)' }} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Main Content - Two Column Layout */}
                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        overflow: 'hidden'
                    }}
                >
                    {/* Left Sidebar - Categories */}
                    {!isMobile && (
                        <Box
                            sx={{
                                width: '280px',
                                flexShrink: 0,
                                overflowY: 'auto'
                            }}
                        >
                            <SettingsCategorySidebar
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
                        </Box>
                    )}

                    {/* Mobile Category Selector - Only show if mobile */}
                    {isMobile && (
                        <Box
                            sx={{
                                width: '100%',
                                borderBottom: '1px solid var(--color-border)',
                                p: 2
                            }}
                        >
                            <SettingsCategorySidebar
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
                        </Box>
                    )}

                    {/* Right Content Area */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 3
                        }}
                    >
                        {renderContentPanel()}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};
