import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { FaEdit, FaFolderOpen, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../../context/useAppContext';
import { CenteredModal } from '../modals/CenteredModal';
import { ConfirmationOptions, PopupManager } from '../modals/PopupManager';
import { ToastManager } from '../toast/ToastManager';

export const PagesManagement: React.FC = () => {
    const { pages, currentPageId, switchToPage, deletePage, pageNameToSlug, updateConfig, config } = useAppContext();
    const navigate = useNavigate();
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<any>(null);
    const [newPageName, setNewPageName] = useState('');

    const handleOpenPage = (page: any) => {
        switchToPage(page.id);
        const slug = pageNameToSlug(page.name);
        navigate(`/page/${slug}`);
        // Optionally close settings modal here if needed
    };

    const handleOpenRenameDialog = (page: any) => {
        setSelectedPage(page);
        setNewPageName(page.name);
        setRenameModalOpen(true);
    };

    const handleRename = async () => {
        if (!selectedPage || !config) return;

        if (!newPageName.trim()) {
            ToastManager.error('Page name cannot be empty');
            return;
        }

        try {
            // Update the pages array with the new name
            const updatedPages = pages.map(page =>
                page.id === selectedPage.id
                    ? { ...page, name: newPageName.trim() }
                    : page
            );

            // Update config with new pages array
            await updateConfig({ pages: updatedPages });

            ToastManager.success('Page renamed successfully');
            setRenameModalOpen(false);
            setSelectedPage(null);
            setNewPageName('');
        } catch (error) {
            console.error('Error renaming page:', error);
            ToastManager.error('Failed to rename page');
        }
    };

    const handleDelete = (page: any) => {
        const options: ConfirmationOptions = {
            title: `Delete page "${page.name}"?`,
            text: 'This action cannot be undone.',
            confirmAction: async () => {
                try {
                    await deletePage(page.id);
                    ToastManager.success('Page deleted successfully');

                    // If currently on the deleted page, navigate to home
                    if (currentPageId === page.id) {
                        switchToPage('');
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error deleting page:', error);
                    ToastManager.error('Failed to delete page');
                }
            }
        };

        PopupManager.deleteConfirmation(options);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant='h6'
                sx={{
                    color: 'var(--color-primary-text)',
                    fontWeight: 600,
                    mb: 2
                }}
            >
                Pages Management
            </Typography>

            {pages.length === 0 ? (
                <Box sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'var(--color-secondary-text)'
                }}>
                    <Typography variant='body1'>
                        No custom pages created yet.
                    </Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}>
                        Create pages from the dashboard to organize your items.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {pages.map((page) => (
                        <Box
                            key={page.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-secondary-background)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                }
                            }}
                        >
                            <Typography
                                variant='body1'
                                sx={{
                                    color: 'var(--color-primary-text)',
                                    fontWeight: 500,
                                    flex: 1
                                }}
                            >
                                {page.name}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                    onClick={() => handleOpenPage(page)}
                                    sx={{
                                        color: 'var(--color-primary-text)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                    title="Open page"
                                >
                                    <FaFolderOpen size={18} />
                                </IconButton>

                                <IconButton
                                    onClick={() => handleOpenRenameDialog(page)}
                                    sx={{
                                        color: 'var(--color-primary-text)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                    title="Rename page"
                                >
                                    <FaEdit size={18} />
                                </IconButton>

                                <IconButton
                                    onClick={() => handleDelete(page)}
                                    sx={{
                                        color: 'var(--color-error)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)'
                                        }
                                    }}
                                    title="Delete page"
                                >
                                    <FaTrash size={18} />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Rename Modal */}
            <CenteredModal
                open={renameModalOpen}
                handleClose={() => {
                    setRenameModalOpen(false);
                    setSelectedPage(null);
                    setNewPageName('');
                }}
                title="Rename Page"
            >
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        label="Page Name"
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleRename();
                            }
                        }}
                        sx={{
                            mb: 3,
                            '& .MuiInputBase-root': {
                                color: 'var(--color-primary-text)',
                                backgroundColor: 'var(--color-secondary-background)'
                            }
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => {
                                setRenameModalOpen(false);
                                setSelectedPage(null);
                                setNewPageName('');
                            }}
                            sx={{
                                color: 'var(--color-secondary-text)',
                                textTransform: 'none'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRename}
                            variant="contained"
                            sx={{
                                backgroundColor: 'var(--color-primary-accent)',
                                color: 'white',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'var(--color-secondary-accent)'
                                }
                            }}
                        >
                            Rename
                        </Button>
                    </Box>
                </Box>
            </CenteredModal>
        </Box>
    );
};
