import { Box, Button, Slider, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { FaFileDownload, FaFileUpload, FaUndo } from 'react-icons/fa';

import { ColorTheme, DEFAULT_THEME, useTheme } from '../../context/ThemeContext';
import { PopupManager } from '../modals/PopupManager';
import { ToastManager } from '../toast/ToastManager';

interface ColorInputProps {
    label: string;
    description?: string;
    value: string;
    onChange: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, description, value, onChange }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        // Validate hex color
        if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 500 }}>
                {label}
            </Typography>
            {description && (
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    {description}
                </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Color preview box */}
                <Box
                    onClick={() => setShowPicker(!showPicker)}
                    sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: value,
                        border: '2px solid var(--color-border)',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            borderColor: 'var(--color-primary-accent)'
                        }
                    }}
                />
                {/* Hex input */}
                <TextField
                    value={localValue}
                    onChange={handleHexChange}
                    size='small'
                    placeholder='#FFFFFF'
                    sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                            fontFamily: 'monospace'
                        }
                    }}
                />
            </Box>
            {/* Color picker dropdown */}
            {showPicker && (
                <Box
                    sx={{
                        position: 'relative',
                        mt: 1,
                        p: 2,
                        backgroundColor: 'var(--color-sidebar-background)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 1,
                        zIndex: 1000
                    }}
                >
                    <HexColorPicker
                        color={value}
                        onChange={(color) => {
                            onChange(color);
                            setLocalValue(color);
                        }}
                        style={{ width: '100%' }}
                    />
                    <Button
                        onClick={() => setShowPicker(false)}
                        fullWidth
                        variant='outlined'
                        size='small'
                        sx={{ mt: 1 }}
                    >
                        Close
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export const ColorCustomization: React.FC = () => {
    const { colorTheme, updateColor, resetTheme, exportTheme, importTheme } = useTheme();

    const handleImportTheme = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                try {
                    const text = await file.text();
                    const success = importTheme(text);
                    if (success) {
                        ToastManager.success('Theme imported successfully!');
                    } else {
                        ToastManager.error('Invalid theme file');
                    }
                } catch (error) {
                    ToastManager.error('Failed to import theme');
                    console.error('Import error:', error);
                }
            }
        };
        input.click();
    };

    const handleResetTheme = () => {
        PopupManager.deleteConfirmation({
            title: 'Reset Color Theme',
            text: 'This will reset all colors to their default values. This action cannot be undone.',
            confirmText: 'Yes, Reset',
            confirmAction: () => {
                resetTheme();
                ToastManager.success('Theme reset to defaults');
            }
        });
    };

    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 2 }}>
                Color Customization
            </Typography>

            <Typography variant='body2' sx={{ mb: 3, opacity: 0.8 }}>
                Customize the color scheme of your dashboard. Changes are applied in real-time and saved automatically.
            </Typography>

            {/* Theme Actions */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Button
                    variant='outlined'
                    size='small'
                    startIcon={<FaFileDownload />}
                    onClick={exportTheme}
                >
                    Export Theme
                </Button>
                <Button
                    variant='outlined'
                    size='small'
                    startIcon={<FaFileUpload />}
                    onClick={handleImportTheme}
                >
                    Import Theme
                </Button>
                <Button
                    variant='outlined'
                    size='small'
                    color='error'
                    startIcon={<FaUndo />}
                    onClick={handleResetTheme}
                >
                    Reset to Default
                </Button>
            </Box>

            {/* Background Colors */}
            <Typography variant='subtitle1' sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                Background Colors
            </Typography>
            <ColorInput
                label='Main Background'
                description='The background color of the entire dashboard'
                value={colorTheme.backgroundColor}
                onChange={(color) => updateColor('backgroundColor', color)}
            />
            <ColorInput
                label='Widget Background'
                description='The base background color of widgets and cards'
                value={colorTheme.widgetBackground}
                onChange={(color) => updateColor('widgetBackground', color)}
            />
            <ColorInput
                label='Header Background'
                description='The background color of the top navigation bar'
                value={colorTheme.headerBackground}
                onChange={(color) => updateColor('headerBackground', color)}
            />
            <ColorInput
                label='Sidebar Background'
                description='The background color of sidebars and drawers'
                value={colorTheme.sidebarBackground}
                onChange={(color) => updateColor('sidebarBackground', color)}
            />
            <ColorInput
                label='Secondary Background'
                description='Used for highlighted UI elements, cards, and emphasized sections'
                value={colorTheme.secondaryBackground}
                onChange={(color) => updateColor('secondaryBackground', color)}
            />

            {/* Accent Colors */}
            <Typography variant='subtitle1' sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                Accent Colors
            </Typography>
            <ColorInput
                label='Primary Accent'
                description='Main accent color used for buttons, links, and highlights'
                value={colorTheme.primaryAccent}
                onChange={(color) => updateColor('primaryAccent', color)}
            />
            <ColorInput
                label='Success Color'
                description='Color used for success messages and indicators'
                value={colorTheme.successColor}
                onChange={(color) => updateColor('successColor', color)}
            />
            <ColorInput
                label='Warning Color'
                description='Color used for warning messages and indicators'
                value={colorTheme.warningColor}
                onChange={(color) => updateColor('warningColor', color)}
            />
            <ColorInput
                label='Error Color'
                description='Color used for error messages and indicators'
                value={colorTheme.errorColor}
                onChange={(color) => updateColor('errorColor', color)}
            />

            {/* Text Colors */}
            <Typography variant='subtitle1' sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                Text Colors
            </Typography>
            <ColorInput
                label='Primary Text'
                description='Main text color used throughout the interface'
                value={colorTheme.primaryText}
                onChange={(color) => updateColor('primaryText', color)}
            />
            <ColorInput
                label='Secondary Text'
                description='Secondary text color for less prominent text'
                value={colorTheme.secondaryText}
                onChange={(color) => updateColor('secondaryText', color)}
            />
            <ColorInput
                label='Muted Text'
                description='Muted/disabled text color'
                value={colorTheme.mutedText}
                onChange={(color) => updateColor('mutedText', color)}
            />

            {/* Border Colors */}
            <Typography variant='subtitle1' sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                Border Colors
            </Typography>
            <ColorInput
                label='Default Border'
                description='Default border color for elements'
                value={colorTheme.borderColor}
                onChange={(color) => updateColor('borderColor', color)}
            />
            <ColorInput
                label='Hover Border'
                description='Border color when hovering over elements'
                value={colorTheme.hoverBorderColor}
                onChange={(color) => updateColor('hoverBorderColor', color)}
            />

            {/* Transparency & Effects */}
            <Typography variant='subtitle1' sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                Transparency & Effects
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Widget Background Opacity: {Math.round(colorTheme.widgetBackgroundOpacity * 100)}%
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    Controls transparency of widget backgrounds
                </Typography>
                <Slider
                    value={colorTheme.widgetBackgroundOpacity}
                    onChange={(_, value) => updateColor('widgetBackgroundOpacity', value as number)}
                    min={0}
                    max={1}
                    step={0.05}
                    marks={[
                        { value: 0, label: '0%' },
                        { value: 0.5, label: '50%' },
                        { value: 1, label: '100%' }
                    ]}
                    valueLabelDisplay='auto'
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Header Opacity: {Math.round(colorTheme.headerOpacity * 100)}%
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    Controls transparency of the top navigation bar
                </Typography>
                <Slider
                    value={colorTheme.headerOpacity}
                    onChange={(_, value) => updateColor('headerOpacity', value as number)}
                    min={0}
                    max={1}
                    step={0.05}
                    marks={[
                        { value: 0, label: '0%' },
                        { value: 0.5, label: '50%' },
                        { value: 1, label: '100%' }
                    ]}
                    valueLabelDisplay='auto'
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    UI Elements Opacity: {Math.round(colorTheme.uiElementsOpacity * 100)}%
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    Controls transparency of sidebars, modals, and dropdowns
                </Typography>
                <Slider
                    value={colorTheme.uiElementsOpacity}
                    onChange={(_, value) => updateColor('uiElementsOpacity', value as number)}
                    min={0}
                    max={1}
                    step={0.05}
                    marks={[
                        { value: 0, label: '0%' },
                        { value: 0.5, label: '50%' },
                        { value: 1, label: '100%' }
                    ]}
                    valueLabelDisplay='auto'
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Backdrop Blur: {colorTheme.backdropBlur}px
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    Controls the blur effect behind translucent elements
                </Typography>
                <Slider
                    value={colorTheme.backdropBlur}
                    onChange={(_, value) => updateColor('backdropBlur', value as number)}
                    min={0}
                    max={20}
                    step={1}
                    marks={[
                        { value: 0, label: '0px' },
                        { value: 10, label: '10px' },
                        { value: 20, label: '20px' }
                    ]}
                    valueLabelDisplay='auto'
                />
            </Box>

            {/* Background Mode */}
            <Typography variant='subtitle1' sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                Background Mode
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Background Type
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 2, opacity: 0.7 }}>
                    Choose between a solid color background or a custom background image
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant={colorTheme.backgroundMode === 'color' ? 'contained' : 'outlined'}
                        onClick={() => updateColor('backgroundMode', 'color')}
                        sx={{ flex: 1 }}
                    >
                        Solid Color
                    </Button>
                    <Button
                        variant={colorTheme.backgroundMode === 'image' ? 'contained' : 'outlined'}
                        onClick={() => updateColor('backgroundMode', 'image')}
                        sx={{ flex: 1 }}
                    >
                        Background Image
                    </Button>
                </Box>

                {colorTheme.backgroundMode === 'image' && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                            Note: Use the "Background Image" option in the Appearance Settings tab above to upload your background image.
                        </Typography>
                        {colorTheme.backgroundImage && (
                            <Button
                                variant='outlined'
                                size='small'
                                color='error'
                                onClick={() => updateColor('backgroundImage', '')}
                                sx={{ mt: 1 }}
                            >
                                Remove Background Image
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};
