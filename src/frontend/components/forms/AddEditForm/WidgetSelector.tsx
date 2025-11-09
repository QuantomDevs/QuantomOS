import DeleteIcon from '@mui/icons-material/Delete';
import { Extension as ExtensionIconComponent } from '@mui/icons-material';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Divider, Grid2 as Grid, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { WIDGET_OPTIONS } from './constants';
import { FormValues } from './types';
import { deleteExtension, fetchExtensions } from '../../../api/extensions-api';
import { ExtensionMetadata } from '../../../types/extension.types';

type Props = {
    formContext: UseFormReturn<FormValues>
    setCurrentStep: Dispatch<SetStateAction<'select' | 'widget-select' | 'configure'>>;
    onExtensionSelect?: (extension: ExtensionMetadata) => void;
}

export const WidgetSelector = ({ formContext, setCurrentStep, onExtensionSelect }: Props) => {
    const [extensions, setExtensions] = useState<ExtensionMetadata[]>([]);
    const [loadingExtensions, setLoadingExtensions] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [deletingExtension, setDeletingExtension] = useState<string | null>(null);

    useEffect(() => {
        loadExtensionsList();
    }, []);

    const loadExtensionsList = async () => {
        try {
            const extensionsList = await fetchExtensions();
            setExtensions(extensionsList);
        } catch (error) {
            console.error('Error loading extensions:', error);
        } finally {
            setLoadingExtensions(false);
        }
    };

    const handleWidgetTypeSelect = (widgetTypeId: string) => {
        formContext.setValue('widgetType', widgetTypeId);
        setCurrentStep('configure');
    };

    const handleExtensionClick = (extension: ExtensionMetadata) => {
        if (onExtensionSelect) {
            onExtensionSelect(extension);
        }
    };

    const handleDeleteExtension = async (extensionId: string, extensionTitle: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent card click

        const confirmed = window.confirm(
            `Delete "${extensionTitle}"? This will remove the extension and cannot be undone.`
        );

        if (!confirmed) return;

        setDeletingExtension(extensionId);
        try {
            await deleteExtension(extensionId);
            // Reload extensions list
            await loadExtensionsList();
            // Show success message (you could use a toast notification here)
            console.log(`Extension "${extensionTitle}" deleted successfully`);
        } catch (error) {
            console.error('Error deleting extension:', error);
            alert('Failed to delete extension. Please try again.');
        } finally {
            setDeletingExtension(null);
        }
    };

    const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newView: 'grid' | 'list' | null) => {
        if (newView !== null) {
            setViewMode(newView);
        }
    };

    // Filter widgets and extensions based on search query
    const filteredWidgets = useMemo(() => {
        if (!searchQuery.trim()) return WIDGET_OPTIONS;

        const query = searchQuery.toLowerCase();
        return WIDGET_OPTIONS.filter(widget =>
            widget.label.toLowerCase().includes(query) ||
            widget.description.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const filteredExtensions = useMemo(() => {
        if (!searchQuery.trim()) return extensions;

        const query = searchQuery.toLowerCase();
        return extensions.filter(ext =>
            ext.title.toLowerCase().includes(query) ||
            ext.description.toLowerCase().includes(query)
        );
    }, [searchQuery, extensions]);

    const renderGridView = () => (
        <>
            {/* Built-in Widgets Section */}
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                {filteredWidgets.map((option) => {
                    const IconComponent = option.icon;

                    return (
                        <Grid
                            key={option.id}
                            size={{ xs: 6, sm: 6, md: 3 }}
                        >
                            <Box
                                onClick={() => handleWidgetTypeSelect(option.id)}
                                sx={{
                                    py: 2.5,
                                    px: .25,
                                    height: { xs: '180px', sm: '160px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    backgroundColor: 'var(--color-widget-background)',
                                    borderRadius: '8px',
                                    border: '2px solid var(--color-border)',
                                    transition: 'all 0.2s ease',
                                    '@media (pointer: fine)': {
                                        '&:hover': {
                                            backgroundColor: 'var(--color-secondary-background)',
                                            borderColor: 'var(--color-primary-accent)',
                                        },
                                    },

                                }}
                            >
                                <IconComponent
                                    size={option.iconSize || 32}
                                    style={{
                                        color: 'inherit',
                                        marginBottom: '8px'
                                    }}
                                />
                                <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Typography
                                        variant='subtitle2'
                                        sx={{
                                            color: 'var(--color-primary-text)',
                                            fontWeight: 600,
                                            mb: 0.5,
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {option.label}
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{
                                            fontSize: '0.7rem',
                                            lineHeight: 1.1,
                                            px: 0.5,
                                            color: 'var(--color-secondary-text)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: { xs: 4, sm: 3 },
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {option.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Custom Extensions Section */}
            {!loadingExtensions && filteredExtensions.length > 0 && (
                <>
                    <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
                        <Divider sx={{ flex: 1, borderColor: 'var(--color-border)' }} />
                        <Typography
                            variant='caption'
                            sx={{
                                px: 2,
                                color: 'var(--color-secondary-text)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Custom Extensions
                        </Typography>
                        <Divider sx={{ flex: 1, borderColor: 'var(--color-border)' }} />
                    </Box>

                    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                        {filteredExtensions.map((extension) => (
                            <Grid
                                key={extension.id}
                                size={{ xs: 6, sm: 6, md: 3 }}
                            >
                                <Box
                                    onClick={() => handleExtensionClick(extension)}
                                    sx={{
                                        py: 2.5,
                                        px: .25,
                                        height: { xs: '180px', sm: '160px' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        backgroundColor: 'var(--color-widget-background)',
                                        borderRadius: '8px',
                                        border: '2px solid var(--color-border)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        '@media (pointer: fine)': {
                                            '&:hover': {
                                                backgroundColor: 'var(--color-secondary-background)',
                                                borderColor: 'var(--color-primary-accent)',
                                            },
                                            '&:hover .delete-button': {
                                                opacity: 1,
                                            }
                                        },
                                    }}
                                >
                                    {/* Delete Button */}
                                    <Box
                                        className='delete-button'
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            opacity: 0,
                                            transition: 'opacity 0.2s ease',
                                        }}
                                    >
                                        <Tooltip title='Delete Extension'>
                                            <IconButton
                                                size='small'
                                                onClick={(e) => handleDeleteExtension(extension.id, extension.title, e)}
                                                disabled={deletingExtension === extension.id}
                                                sx={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                    color: 'var(--color-error)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--color-error)',
                                                        color: 'white',
                                                    }
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    <ExtensionIconComponent
                                        sx={{
                                            fontSize: 32,
                                            color: 'var(--color-primary-text)',
                                            mb: 1
                                        }}
                                    />
                                    <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography
                                            variant='subtitle2'
                                            sx={{
                                                color: 'var(--color-primary-text)',
                                                fontWeight: 600,
                                                mb: 0.5,
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {extension.title}
                                        </Typography>
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                fontSize: '0.7rem',
                                                lineHeight: 1.1,
                                                px: 0.5,
                                                color: 'var(--color-secondary-text)',
                                                display: '-webkit-box',
                                                WebkitLineClamp: { xs: 4, sm: 3 },
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {extension.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </>
    );

    const renderListView = () => (
        <>
            {/* Built-in Widgets Section */}
            <List sx={{ width: '100%' }}>
                {filteredWidgets.map((option) => {
                    const IconComponent = option.icon;

                    return (
                        <ListItem
                            key={option.id}
                            disablePadding
                            sx={{
                                mb: 1,
                                backgroundColor: 'var(--color-widget-background)',
                                borderRadius: '8px',
                                border: '2px solid var(--color-border)',
                                transition: 'all 0.2s ease',
                                '@media (pointer: fine)': {
                                    '&:hover': {
                                        backgroundColor: 'var(--color-secondary-background)',
                                        borderColor: 'var(--color-primary-accent)',
                                    },
                                },
                            }}
                        >
                            <ListItemButton
                                onClick={() => handleWidgetTypeSelect(option.id)}
                                sx={{ py: 2 }}
                            >
                                <ListItemIcon sx={{ minWidth: 56 }}>
                                    <IconComponent
                                        size={option.iconSize || 40}
                                        style={{ color: 'var(--color-primary-accent)' }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={option.label}
                                    secondary={option.description}
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        color: 'var(--color-primary-text)',
                                        fontSize: '1rem'
                                    }}
                                    secondaryTypographyProps={{
                                        color: 'var(--color-secondary-text)',
                                        fontSize: '0.85rem'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Custom Extensions Section */}
            {!loadingExtensions && filteredExtensions.length > 0 && (
                <>
                    <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
                        <Divider sx={{ flex: 1, borderColor: 'var(--color-border)' }} />
                        <Typography
                            variant='caption'
                            sx={{
                                px: 2,
                                color: 'var(--color-secondary-text)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Custom Extensions
                        </Typography>
                        <Divider sx={{ flex: 1, borderColor: 'var(--color-border)' }} />
                    </Box>

                    <List sx={{ width: '100%' }}>
                        {filteredExtensions.map((extension) => (
                            <ListItem
                                key={extension.id}
                                disablePadding
                                sx={{
                                    mb: 1,
                                    backgroundColor: 'var(--color-widget-background)',
                                    borderRadius: '8px',
                                    border: '2px solid var(--color-border)',
                                    transition: 'all 0.2s ease',
                                    '@media (pointer: fine)': {
                                        '&:hover': {
                                            backgroundColor: 'var(--color-secondary-background)',
                                            borderColor: 'var(--color-primary-accent)',
                                        },
                                    },
                                }}
                                secondaryAction={
                                    <Tooltip title='Delete Extension'>
                                        <IconButton
                                            edge='end'
                                            onClick={(e) => handleDeleteExtension(extension.id, extension.title, e)}
                                            disabled={deletingExtension === extension.id}
                                            sx={{
                                                color: 'var(--color-error)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                }
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            >
                                <ListItemButton
                                    onClick={() => handleExtensionClick(extension)}
                                    sx={{ py: 2 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 56 }}>
                                        <ExtensionIconComponent
                                            sx={{
                                                fontSize: 40,
                                                color: 'var(--color-primary-accent)'
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={extension.title}
                                        secondary={extension.description}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                            color: 'var(--color-primary-text)',
                                            fontSize: '1rem'
                                        }}
                                        secondaryTypographyProps={{
                                            color: 'var(--color-secondary-text)',
                                            fontSize: '0.85rem'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </>
    );

    return (
        <Box sx={{ mb: 2, width: '100%' }}>
            {/* Search and View Toggle Controls */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Search Input */}
                <TextField
                    fullWidth
                    placeholder='Search widgets...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon sx={{ color: 'var(--color-secondary-text)' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'var(--color-widget-background)',
                            borderRadius: '8px',
                            '& fieldset': {
                                borderColor: 'var(--color-border)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--color-hover-border)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--color-primary-accent)',
                            },
                        },
                        '& input': {
                            color: 'var(--color-primary-text)',
                        }
                    }}
                />

                {/* View Toggle */}
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label='view mode'
                    sx={{
                        backgroundColor: 'var(--color-widget-background)',
                        '& .MuiToggleButton-root': {
                            color: 'var(--color-secondary-text)',
                            borderColor: 'var(--color-border)',
                            '&.Mui-selected': {
                                color: 'var(--color-primary-accent)',
                                backgroundColor: 'var(--color-secondary-background)',
                            },
                            '&:hover': {
                                backgroundColor: 'var(--color-secondary-background)',
                            }
                        }
                    }}
                >
                    <ToggleButton value='grid' aria-label='grid view'>
                        <Tooltip title='Grid View'>
                            <GridViewIcon />
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value='list' aria-label='list view'>
                        <Tooltip title='List View'>
                            <ListIcon />
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Render based on view mode */}
            {viewMode === 'grid' ? renderGridView() : renderListView()}

            {/* Empty State */}
            {filteredWidgets.length === 0 && filteredExtensions.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant='h6' sx={{ color: 'var(--color-secondary-text)', mb: 1 }}>
                        No widgets found
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'var(--color-muted-text)' }}>
                        No widgets match your search &quot;{searchQuery}&quot;
                    </Typography>
                </Box>
            )}
        </Box>
    );
};
