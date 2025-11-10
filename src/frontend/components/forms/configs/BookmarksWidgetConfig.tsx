import { Grid2 as Grid, Typography, Box, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, Paper } from '@mui/material';
import { Add, Delete, DragIndicator } from '@mui/icons-material';
import { UseFormReturn } from 'react-hook-form';
import { CheckboxElement, TextFieldElement, SelectElement } from 'react-hook-form-mui';
import React, { useState, useEffect } from 'react';

import { FormValues } from '../AddEditForm/types';

interface BookmarksWidgetConfigProps {
    formContext: UseFormReturn<FormValues>;
}

interface Bookmark {
    id: string;
    name: string;
    url: string;
    icon?: string;
}

const LAYOUT_OPTIONS = [
    { id: 'vertical', label: 'Vertical' },
    { id: 'horizontal', label: 'Horizontal' },
    { id: 'grid', label: 'Grid' },
    { id: 'grid-horizontal', label: 'Grid Horizontal' }
];

export const BookmarksWidgetConfig = ({ formContext }: BookmarksWidgetConfigProps) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
    const [bookmarkName, setBookmarkName] = useState('');
    const [bookmarkUrl, setBookmarkUrl] = useState('');

    // Initialize bookmarks from form context
    useEffect(() => {
        const currentBookmarks = formContext.getValues('bookmarks');
        if (currentBookmarks && Array.isArray(currentBookmarks)) {
            setBookmarks(currentBookmarks);
        }
    }, [formContext]);

    // Update form context when bookmarks change
    useEffect(() => {
        formContext.setValue('bookmarks', bookmarks);
    }, [bookmarks, formContext]);

    const handleOpenDialog = (bookmark?: Bookmark) => {
        if (bookmark) {
            setEditingBookmark(bookmark);
            setBookmarkName(bookmark.name);
            setBookmarkUrl(bookmark.url);
        } else {
            setEditingBookmark(null);
            setBookmarkName('');
            setBookmarkUrl('');
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingBookmark(null);
        setBookmarkName('');
        setBookmarkUrl('');
    };

    const handleSaveBookmark = () => {
        if (!bookmarkName.trim() || !bookmarkUrl.trim()) {
            return;
        }

        if (editingBookmark) {
            // Update existing bookmark
            setBookmarks(prev => prev.map(b =>
                b.id === editingBookmark.id
                    ? { ...b, name: bookmarkName, url: bookmarkUrl }
                    : b
            ));
        } else {
            // Add new bookmark
            const newBookmark: Bookmark = {
                id: Date.now().toString(),
                name: bookmarkName,
                url: bookmarkUrl
            };
            setBookmarks(prev => [...prev, newBookmark]);
        }

        handleCloseDialog();
    };

    const handleDeleteBookmark = (id: string) => {
        setBookmarks(prev => prev.filter(b => b.id !== id));
    };

    const handleMoveBookmark = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= bookmarks.length) return;

        const newBookmarks = [...bookmarks];
        [newBookmarks[index], newBookmarks[newIndex]] = [newBookmarks[newIndex], newBookmarks[index]];
        setBookmarks(newBookmarks);
    };

    return (
        <>
            <Grid container spacing={2} direction='column'>
                <Grid>
                    <TextFieldElement
                        name='displayName'
                        label='Display Name'
                        placeholder='Bookmarks'
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />
                </Grid>

                <Grid>
                    <TextFieldElement
                        name='title'
                        label='Widget Title'
                        placeholder='Bookmarks'
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />
                </Grid>

                <Grid>
                    <SelectElement
                        name='layout'
                        label='Layout'
                        options={LAYOUT_OPTIONS}
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                            '& .MuiSelect-icon': {
                                color: 'white',
                            },
                        }}
                    />
                </Grid>

                <Grid>
                    <CheckboxElement
                        label='Hide Title'
                        name='hideTitle'
                        sx={{
                            ml: 1,
                            color: 'white',
                            '& .MuiSvgIcon-root': { fontSize: 30 },
                        }}
                    />
                </Grid>

                <Grid>
                    <CheckboxElement
                        label='Hide Icons'
                        name='hideIcons'
                        sx={{
                            ml: 1,
                            color: 'white',
                            '& .MuiSvgIcon-root': { fontSize: 30 },
                        }}
                    />
                </Grid>

                <Grid>
                    <CheckboxElement
                        label='Hide Hostnames'
                        name='hideHostnames'
                        sx={{
                            ml: 1,
                            color: 'white',
                            '& .MuiSvgIcon-root': { fontSize: 30 },
                        }}
                    />
                </Grid>

                <Grid>
                    <CheckboxElement
                        label='Open in New Tab'
                        name='openInNewTab'
                        sx={{
                            ml: 1,
                            color: 'white',
                            '& .MuiSvgIcon-root': { fontSize: 30 },
                        }}
                    />
                </Grid>

                <Grid>
                    <CheckboxElement
                        label='Show Label'
                        name='showLabel'
                        sx={{
                            ml: 1,
                            color: 'white',
                            '& .MuiSvgIcon-root': { fontSize: 30 },
                        }}
                    />
                </Grid>

                <Grid>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant='subtitle1' sx={{ color: 'white', fontWeight: 600 }}>
                                Bookmarks ({bookmarks.length})
                            </Typography>
                            <Button
                                variant='contained'
                                startIcon={<Add />}
                                onClick={() => handleOpenDialog()}
                                sx={{
                                    backgroundColor: 'var(--color-primary-accent)',
                                    '&:hover': {
                                        backgroundColor: 'var(--color-secondary-accent)',
                                    }
                                }}
                            >
                                Add Bookmark
                            </Button>
                        </Box>

                        {bookmarks.length === 0 ? (
                            <Box
                                sx={{
                                    padding: 3,
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '8px',
                                    border: '1px dashed rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <Typography variant='body2' sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                    No bookmarks added yet. Click "Add Bookmark" to get started.
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ maxHeight: 300, overflowY: 'auto', padding: 0 }}>
                                {bookmarks.map((bookmark, index) => (
                                    <ListItem
                                        key={bookmark.id}
                                        sx={{
                                            marginBottom: 1,
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: 1.5
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                            <DragIndicator sx={{ color: 'rgba(255, 255, 255, 0.4)', cursor: 'grab' }} />

                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    variant='body2'
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {bookmark.name}
                                                </Typography>
                                                <Typography
                                                    variant='caption'
                                                    sx={{
                                                        color: 'rgba(255, 255, 255, 0.6)',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        display: 'block'
                                                    }}
                                                >
                                                    {bookmark.url}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Button
                                                    size='small'
                                                    onClick={() => handleOpenDialog(bookmark)}
                                                    sx={{ color: 'white', minWidth: 'auto', px: 1 }}
                                                >
                                                    Edit
                                                </Button>
                                                <IconButton
                                                    size='small'
                                                    onClick={() => handleDeleteBookmark(bookmark.id)}
                                                    sx={{ color: 'var(--color-error)' }}
                                                >
                                                    <Delete fontSize='small' />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {/* Add/Edit Bookmark Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth='sm'
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--color-secondary-background)',
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ color: 'white' }}>
                    {editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label='Name'
                            value={bookmarkName}
                            onChange={(e) => setBookmarkName(e.target.value)}
                            fullWidth
                            required
                            sx={{
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                            }}
                        />
                        <TextField
                            label='URL'
                            value={bookmarkUrl}
                            onChange={(e) => setBookmarkUrl(e.target.value)}
                            fullWidth
                            required
                            placeholder='https://example.com'
                            sx={{
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ color: 'white' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveBookmark}
                        variant='contained'
                        disabled={!bookmarkName.trim() || !bookmarkUrl.trim()}
                        sx={{
                            backgroundColor: 'var(--color-primary-accent)',
                            '&:hover': {
                                backgroundColor: 'var(--color-secondary-accent)',
                            }
                        }}
                    >
                        {editingBookmark ? 'Save Changes' : 'Add Bookmark'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
