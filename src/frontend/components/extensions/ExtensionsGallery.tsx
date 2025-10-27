import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    Grid,
    TextField,
    Alert,
    CircularProgress,
    Chip
} from '@mui/material';
import { Extension as ExtensionIcon } from '@mui/icons-material';

import { ExtensionMetadata } from '../../types/extension.types';
import { fetchExtensions } from '../../api/extensions-api';

interface ExtensionsGalleryProps {
    onSelectExtension: (extension: ExtensionMetadata) => void;
}

export const ExtensionsGallery: React.FC<ExtensionsGalleryProps> = ({ onSelectExtension }) => {
    const [extensions, setExtensions] = useState<ExtensionMetadata[]>([]);
    const [filteredExtensions, setFilteredExtensions] = useState<ExtensionMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadExtensions();
    }, []);

    useEffect(() => {
        // Ensure extensions is always an array
        const extensionsArray = Array.isArray(extensions) ? extensions : [];

        // Filter extensions based on search term
        if (!searchTerm.trim()) {
            setFilteredExtensions(extensionsArray);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = extensionsArray.filter(ext =>
                ext.name.toLowerCase().includes(term) ||
                ext.description.toLowerCase().includes(term) ||
                ext.author.toLowerCase().includes(term)
            );
            setFilteredExtensions(filtered);
        }
    }, [searchTerm, extensions]);

    const loadExtensions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchExtensions();

            // Ensure data is an array
            const extensionsArray = Array.isArray(data) ? data : [];
            setExtensions(extensionsArray);
            setFilteredExtensions(extensionsArray);
        } catch (err) {
            console.error('Error loading extensions:', err);
            setError('Failed to load extensions. Please try again.');
            // Set to empty arrays on error
            setExtensions([]);
            setFilteredExtensions([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error" action={
                    <Button color="inherit" size="small" onClick={loadExtensions}>
                        Retry
                    </Button>
                }>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (extensions.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <ExtensionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Extensions Available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Add custom extension JSON files to the <code>src/extensions/</code> directory.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Custom Extensions
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Browse and add custom extensions to your dashboard
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Search extensions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    sx={{ mt: 2 }}
                />
            </Box>

            {!Array.isArray(filteredExtensions) || filteredExtensions.length === 0 ? (
                <Alert severity="info">
                    No extensions match your search.
                </Alert>
            ) : (
                <Grid container spacing={2}>
                    {filteredExtensions.map(extension => (
                        <Grid item xs={12} sm={6} md={4} key={extension.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <ExtensionIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" component="div">
                                            {extension.name}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {extension.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                        <Chip
                                            label={`v${extension.version}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        {extension.settings && extension.settings.length > 0 && (
                                            <Chip
                                                label={`${extension.settings.length} setting${extension.settings.length !== 1 ? 's' : ''}`}
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                            />
                                        )}
                                    </Box>

                                    <Typography variant="caption" color="text.secondary">
                                        by {extension.author}
                                    </Typography>
                                </CardContent>

                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        fullWidth
                                        onClick={() => onSelectExtension(extension)}
                                    >
                                        Configure & Add
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
