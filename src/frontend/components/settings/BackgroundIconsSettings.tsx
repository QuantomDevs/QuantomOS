import { Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { FaTrashCan, FaUpload } from 'react-icons/fa6';

import { DashApi } from '../../api/dash-api';
import { BACKEND_URL } from '../../constants/constants';
import { useAppContext } from '../../context/useAppContext';
import { PopupManager } from '../modals/PopupManager';
import { ToastManager } from '../toast/ToastManager';

// Image preview card component
const ImagePreviewCard = ({ image, onDelete, formatFileSize }: {
    image: any;
    onDelete: () => void;
    formatFileSize: (bytes: number) => string;
}) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Box
            sx={{
                border: '2px solid var(--color-border)',
                borderRadius: 1,
                pt: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                    borderColor: 'var(--color-primary-accent)'
                }
            }}
        >
            {/* Image Preview */}
            <Box sx={{
                width: '100%',
                height: '100px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: imageError ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}>
                {imageError ? (
                    <Typography variant='caption' sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '12px'
                    }}>
                        Preview unavailable
                    </Typography>
                ) : (
                    <img
                        src={`${BACKEND_URL}${image.path}`}
                        alt={image.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center'
                        }}
                        onError={() => setImageError(true)}
                    />
                )}
            </Box>

            {/* Image Info */}
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 0.5, flexGrow: 1 }}>
                <Typography variant='caption' sx={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.75rem',
                    mb: 0.5
                }}>
                    {image.name}
                </Typography>

                {/* Two-column layout for details */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 0.5,
                    fontSize: '0.7rem'
                }}>
                    <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                        Size:
                    </Typography>
                    <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                        {formatFileSize(image.size)}
                    </Typography>

                    <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                        Uploaded:
                    </Typography>
                    <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                        {new Date(image.uploadDate).toLocaleDateString()}
                    </Typography>

                    <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>
                        Type:
                    </Typography>
                    <Typography variant='caption' sx={{
                        fontSize: '0.7rem',
                        textTransform: 'capitalize'
                    }}>
                        {image.type.replace('-', ' ')}
                    </Typography>
                </Box>

                <Button
                    variant='contained'
                    color='error'
                    size='small'
                    startIcon={<FaTrashCan style={{ fontSize: '0.8rem' }} />}
                    onClick={onDelete}
                    sx={{
                        mt: 1,
                        fontSize: '0.7rem',
                        py: 0.5,
                        minHeight: 'unset'
                    }}
                >
                    Delete
                </Button>
            </Box>
        </Box>
    );
};

export const BackgroundIconsSettings: React.FC = () => {
    const { updateConfig, config } = useAppContext();
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [backgroundType, setBackgroundType] = useState<'image' | 'color'>('image');
    const [backgroundColor, setBackgroundColor] = useState<string>('#1a1a1a');
    const backgroundFileInputRef = useRef<HTMLInputElement>(null);
    const iconFileInputRef = useRef<HTMLInputElement>(null);

    // Format file size for display
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Load uploaded images
    const loadUploadedImages = async () => {
        setLoadingImages(true);
        try {
            const images = await DashApi.getUploadedImages();
            setUploadedImages(images);
        } catch (error) {
            console.error('Error loading uploaded images:', error);
            ToastManager.error('Failed to load uploaded images');
        } finally {
            setLoadingImages(false);
        }
    };

    // Delete uploaded image
    const deleteUploadedImage = async (imagePath: string, imageName: string, imageType: string) => {
        PopupManager.deleteConfirmation({
            title: 'Delete Image',
            text: `Are you sure you want to delete "${imageName}"? This action cannot be undone.`,
            confirmAction: async () => {
                try {
                    const success = await DashApi.deleteUploadedImage(imagePath);
                    if (success) {
                        // If a background image is deleted, reset config to default
                        if (imageType === 'background') {
                            try {
                                await updateConfig({ backgroundImage: '' });
                                ToastManager.success('Background image deleted and reset to default');
                            } catch (configError) {
                                console.error('Error resetting background config:', configError);
                                ToastManager.success('Image deleted successfully, but failed to reset background config');
                            }
                        } else {
                            ToastManager.success(`${imageName} deleted successfully`);
                        }
                        await loadUploadedImages(); // Refresh the list
                    } else {
                        ToastManager.error('Failed to delete image');
                    }
                } catch (error) {
                    console.error('Error deleting image:', error);
                    ToastManager.error('Failed to delete image');
                }
            }
        });
    };

    // Handle background upload
    const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // TypeScript doesn't know updateConfig can handle File objects, but it can
            await updateConfig({ backgroundImage: file as any });
            await loadUploadedImages();
            ToastManager.success('Background uploaded successfully!');
        } catch (error) {
            ToastManager.error('Failed to upload background');
            console.error('Error uploading background:', error);
        }

        // Reset input
        if (backgroundFileInputRef.current) {
            backgroundFileInputRef.current.value = '';
        }
    };

    // Handle app icon uploads
    const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        try {
            const uploadedIcons = await DashApi.uploadAppIconsBatch(files);
            if (uploadedIcons.length > 0) {
                ToastManager.success(`${uploadedIcons.length} app icon(s) uploaded successfully!`);
                await loadUploadedImages();
            } else {
                ToastManager.error('Failed to upload app icons. Please try again.');
            }
        } catch (error) {
            ToastManager.error('Failed to upload app icons. Please try again.');
            console.error('Error uploading app icons:', error);
        }

        // Reset input
        if (iconFileInputRef.current) {
            iconFileInputRef.current.value = '';
        }
    };

    // Reset background
    const resetBackground = async () => {
        PopupManager.deleteConfirmation({
            title: 'Reset Background',
            text: 'This will restore the default background and remove all uploaded background images.',
            confirmText: 'Yes, Reset',
            confirmAction: async () => {
                try {
                    // First clean up all background images in the root directory
                    await DashApi.cleanBackgroundImages();

                    // Then update the config to use the default background
                    await updateConfig({ backgroundImage: '' });

                    // Refresh the images list
                    await loadUploadedImages();

                    ToastManager.success('Background has been reset');
                } catch (error) {
                    ToastManager.error('Failed to reset background. Please try again.');
                    console.error('Error resetting background:', error);
                }
            }
        });
    };

    // Clear icon cache
    const clearIconCache = async () => {
        try {
            const response = await DashApi.clearIconCache();
            ToastManager.success(response.message || 'Icon cache cleared successfully');
        } catch (error) {
            console.error('Error clearing icon cache:', error);
            ToastManager.error('Failed to clear icon cache');
        }
    };

    // Load images on component mount
    useEffect(() => {
        loadUploadedImages();
    }, []);

    // Initialize background type and color from config
    useEffect(() => {
        if (config?.background) {
            setBackgroundType(config.background.type);
            setBackgroundColor(config.background.value);
        } else {
            // Default to image if no background config exists
            setBackgroundType('image');
        }
    }, [config]);

    // Handle background type toggle
    const handleBackgroundTypeChange = async (_event: React.MouseEvent<HTMLElement>, newType: 'image' | 'color' | null) => {
        if (newType === null) return; // Prevent deselection

        setBackgroundType(newType);

        try {
            await updateConfig({
                background: {
                    type: newType,
                    value: newType === 'color' ? backgroundColor : (config?.backgroundImage || '')
                }
            });
            ToastManager.success(`Switched to ${newType === 'image' ? 'background image' : 'background color'} mode`);
        } catch (error) {
            console.error('Error updating background type:', error);
            ToastManager.error('Failed to update background type');
        }
    };

    // Handle background color change
    const handleBackgroundColorChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.target.value;
        setBackgroundColor(newColor);

        try {
            await updateConfig({
                background: {
                    type: 'color',
                    value: newColor
                }
            });
            // Apply the color to the CSS variable immediately
            document.documentElement.style.setProperty('--color-background', newColor);
        } catch (error) {
            console.error('Error updating background color:', error);
            ToastManager.error('Failed to update background color');
        }
    };

    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                Background & Icons
            </Typography>

            <Typography variant='body2' sx={{ mb: 4, opacity: 0.8 }}>
                Set your dashboard background image or color, and upload custom app icons. All changes are saved automatically.
            </Typography>

            {/* Background Type Toggle */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1.5, fontWeight: 500 }}>
                    Background Type
                </Typography>
                <ToggleButtonGroup
                    value={backgroundType}
                    exclusive
                    onChange={handleBackgroundTypeChange}
                    sx={{
                        mb: 2,
                        '& .MuiToggleButton-root': {
                            color: 'var(--color-primary-text)',
                            borderColor: 'var(--color-border)',
                            textTransform: 'none',
                            fontWeight: 500,
                            '&.Mui-selected': {
                                backgroundColor: 'var(--color-primary-accent)',
                                color: 'var(--color-primary-text)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-secondary-accent)',
                                }
                            },
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }
                    }}
                >
                    <ToggleButton value='image'>
                        Background Image
                    </ToggleButton>
                    <ToggleButton value='color'>
                        Background Color
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Background Color Picker - Only show when color mode is active */}
            {backgroundType === 'color' && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                        Background Color
                    </Typography>
                    <Typography variant='caption' sx={{ display: 'block', mb: 1.5, opacity: 0.7 }}>
                        Choose a solid color for your dashboard background
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            type='color'
                            value={backgroundColor}
                            onChange={handleBackgroundColorChange}
                            sx={{
                                width: '100px',
                                '& input': {
                                    height: '50px',
                                    cursor: 'pointer'
                                }
                            }}
                        />
                        <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>
                            {backgroundColor}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Background Image Upload - Only show when image mode is active */}
            {backgroundType === 'image' && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                        Background Image
                    </Typography>
                    <Typography variant='caption' sx={{ display: 'block', mb: 1.5, opacity: 0.7 }}>
                        Upload a background image for your dashboard
                    </Typography>
                    <input
                        type='file'
                        ref={backgroundFileInputRef}
                        onChange={handleBackgroundUpload}
                        accept='image/*'
                        style={{ display: 'none' }}
                    />
                    <Button
                        variant='contained'
                        startIcon={<FaUpload />}
                        onClick={() => backgroundFileInputRef.current?.click()}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        Upload Background
                    </Button>
                </Box>
            )}

            {/* App Icons Upload */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    App Icons
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1.5, opacity: 0.7 }}>
                    Upload custom app icons (up to 20 files at once)
                </Typography>
                <input
                    type='file'
                    ref={iconFileInputRef}
                    onChange={handleIconUpload}
                    accept='image/*'
                    multiple
                    style={{ display: 'none' }}
                />
                <Button
                    variant='contained'
                    startIcon={<FaUpload />}
                    onClick={() => iconFileInputRef.current?.click()}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Upload App Icons
                </Button>
            </Box>

            {/* Action Buttons */}
            <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                mb: 4
            }}>
                <Button
                    variant='contained'
                    color='error'
                    onClick={clearIconCache}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Clear Icon Cache
                </Button>
                <Button
                    variant='contained'
                    color='error'
                    onClick={resetBackground}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Reset Background
                </Button>
            </Box>

            {/* Uploaded Images Section */}
            <Box>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>
                    Uploaded Images
                </Typography>
                {loadingImages ? (
                    <Typography>Loading images...</Typography>
                ) : uploadedImages.length === 0 ? (
                    <Typography variant='body2' sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                        No uploaded images found.
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {uploadedImages.map((image, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <ImagePreviewCard
                                    image={image}
                                    onDelete={() => deleteUploadedImage(image.path, image.name, image.type)}
                                    formatFileSize={formatFileSize}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};
