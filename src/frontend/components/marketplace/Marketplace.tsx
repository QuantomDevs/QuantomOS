import { Box, Button, CircularProgress, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { FaDownload, FaExternalLinkAlt, FaGithub, FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

import { DashApi } from '../../api/dash-api';
import { ToastManager } from '../toast/ToastManager';

interface MarketplaceExtension {
    id: string;
    name: string;
    title: string;
    description: string;
    author: string;
    version: string;
    installed: boolean;
}

export const Marketplace: React.FC = () => {
    const [extensions, setExtensions] = useState<MarketplaceExtension[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
    const [installingId, setInstallingId] = useState<string | null>(null);

    // Fetch marketplace extensions on mount
    useEffect(() => {
        fetchExtensions();
    }, []);

    const fetchExtensions = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/extensions/marketplace/list');

            if (!response.ok) {
                throw new Error('Failed to fetch marketplace extensions');
            }

            const data = await response.json();
            setExtensions(data);
        } catch (error) {
            console.error('Error fetching marketplace:', error);
            ToastManager.error('Failed to load marketplace extensions');
        } finally {
            setLoading(false);
        }
    };

    const handleInstall = async (extensionId: string) => {
        try {
            setInstallingId(extensionId);

            const response = await fetch('/api/extensions/marketplace/install', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ extensionId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to install extension');
            }

            const result = await response.json();
            ToastManager.success(`${result.extension.name} installed successfully`);

            // Refresh the list to update installed status
            await fetchExtensions();
        } catch (error: any) {
            console.error('Error installing extension:', error);
            ToastManager.error(error.message || 'Failed to install extension');
        } finally {
            setInstallingId(null);
        }
    };

    const handleViewSource = (extensionId: string) => {
        const url = `https://github.com/QuantomDevs/QuantomOS/tree/main/extensions/${extensionId}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Filter and sort extensions
    const filteredAndSortedExtensions = useMemo(() => {
        let result = [...extensions];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().replace(/[-_.,]/g, '');
            result = result.filter(ext => {
                const searchableText = `${ext.name} ${ext.title} ${ext.description}`.toLowerCase().replace(/[-_.,]/g, '');
                return searchableText.includes(query);
            });
        }

        // Sort
        result.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [extensions, searchQuery, sortOrder]);

    const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setSortAnchorEl(null);
    };

    const handleSortChange = (order: 'asc' | 'desc') => {
        setSortOrder(order);
        handleSortMenuClose();
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Typography
                variant='h6'
                sx={{
                    color: 'var(--color-primary-text)',
                    fontWeight: 600,
                    mb: 2
                }}
            >
                Marketplace
            </Typography>

            <Typography
                variant='body2'
                sx={{
                    color: 'var(--color-secondary-text)',
                    mb: 3
                }}
            >
                Browse and install community extensions from the marketplace.
            </Typography>

            {/* Search and Sort */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {/* Search Input */}
                <TextField
                    fullWidth
                    placeholder="Search extensions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <FaSearch style={{ marginRight: '8px', color: 'var(--color-secondary-text)' }} />
                    }}
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: 'var(--color-background)',
                            borderRadius: '1rem',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-primary-text)'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                        }
                    }}
                />

                {/* Sort Button */}
                <Button
                    onClick={handleSortMenuOpen}
                    startIcon={sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
                    sx={{
                        backgroundColor: 'var(--color-background)',
                        borderRadius: '1rem',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-primary-text)',
                        textTransform: 'none',
                        px: 3,
                        minWidth: '120px',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }
                    }}
                >
                    {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                </Button>

                <Menu
                    anchorEl={sortAnchorEl}
                    open={Boolean(sortAnchorEl)}
                    onClose={handleSortMenuClose}
                    sx={{
                        '& .MuiPaper-root': {
                            bgcolor: 'var(--color-background)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '0.5rem'
                        }
                    }}
                >
                    <MenuItem onClick={() => handleSortChange('asc')}>
                        <FaSortAlphaDown style={{ marginRight: '8px' }} />
                        A-Z
                    </MenuItem>
                    <MenuItem onClick={() => handleSortChange('desc')}>
                        <FaSortAlphaUp style={{ marginRight: '8px' }} />
                        Z-A
                    </MenuItem>
                </Menu>
            </Box>

            {/* Extensions List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {filteredAndSortedExtensions.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 8,
                        color: 'var(--color-secondary-text)'
                    }}>
                        <FaGithub size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
                        <Typography variant='h6' sx={{ mb: 1 }}>
                            {searchQuery ? 'No extensions found' : 'No Extensions Available'}
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 2 }}>
                            {searchQuery
                                ? `No extensions match "${searchQuery}"`
                                : 'Unable to load extensions from the marketplace.'}
                        </Typography>
                        {!searchQuery && (
                            <Button
                                component='a'
                                href='https://github.com/QuantomDevs/QuantomOS'
                                target='_blank'
                                rel='noopener noreferrer'
                                startIcon={<FaGithub />}
                                sx={{
                                    backgroundColor: 'var(--color-primary-accent)',
                                    color: 'white',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'var(--color-secondary-accent)'
                                    }
                                }}
                            >
                                Open Repository
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {filteredAndSortedExtensions.map((extension) => (
                            <Box
                                key={extension.id}
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
                                {/* Extension Info */}
                                <Box sx={{ flex: 1, mr: 2 }}>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: 'var(--color-primary-text)',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            mb: 0.5
                                        }}
                                    >
                                        {extension.title || extension.name}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            color: 'var(--color-secondary-text)',
                                            mb: 1
                                        }}
                                    >
                                        {extension.description}
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{
                                            color: 'var(--color-muted-text)',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        By {extension.author} • v{extension.version}
                                    </Typography>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <IconButton
                                        onClick={() => handleViewSource(extension.id)}
                                        title="View source on GitHub"
                                        sx={{
                                            color: 'var(--color-primary-text)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        <FaExternalLinkAlt size={16} />
                                    </IconButton>

                                    <Button
                                        onClick={() => handleInstall(extension.id)}
                                        disabled={extension.installed || installingId === extension.id}
                                        startIcon={installingId === extension.id ? <CircularProgress size={16} /> : <FaDownload />}
                                        sx={{
                                            backgroundColor: extension.installed
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'var(--color-primary-accent)',
                                            color: extension.installed ? 'var(--color-secondary-text)' : 'white',
                                            textTransform: 'none',
                                            minWidth: '100px',
                                            '&:hover': {
                                                backgroundColor: extension.installed
                                                    ? 'rgba(255, 255, 255, 0.1)'
                                                    : 'var(--color-secondary-accent)'
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                color: 'var(--color-muted-text)'
                                            }
                                        }}
                                    >
                                        {extension.installed ? 'Installed' : 'Install'}
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};
