import { Box, Button, Slider, Typography } from '@mui/material';
import React from 'react';
import { FaUndo } from 'react-icons/fa';

import { DEFAULT_THEME, useTheme } from '../../context/ThemeContext';

export const GridSettings: React.FC = () => {
    const { colorTheme, updateColor } = useTheme();

    const handleResetGrid = () => {
        updateColor('widgetBorderRadius', DEFAULT_THEME.widgetBorderRadius);
        updateColor('gridRowHeight', DEFAULT_THEME.gridRowHeight);
        updateColor('gridMargin', DEFAULT_THEME.gridMargin);
    };

    return (
        <Box>
            <Typography variant='body2' sx={{ mb: 3, opacity: 0.8 }}>
                Customize the size, spacing, and appearance of your dashboard widgets.
            </Typography>

            {/* Border Radius */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Widget Border Radius: {colorTheme.widgetBorderRadius}px
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    Controls the roundness of widget corners
                </Typography>
                <Slider
                    value={colorTheme.widgetBorderRadius}
                    onChange={(_, value) => updateColor('widgetBorderRadius', value as number)}
                    min={0}
                    max={48}
                    step={2}
                    marks={[
                        { value: 0, label: '0px' },
                        { value: 24, label: '24px' },
                        { value: 48, label: '48px' }
                    ]}
                    valueLabelDisplay='auto'
                />
            </Box>

            {/* Row Height */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Widget Size (Row Height): {colorTheme.gridRowHeight}px
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    Controls the base height of widgets. Larger values make widgets bigger and more readable.
                </Typography>
                <Slider
                    value={colorTheme.gridRowHeight}
                    onChange={(_, value) => updateColor('gridRowHeight', value as number)}
                    min={60}
                    max={200}
                    step={10}
                    marks={[
                        { value: 60, label: '60px' },
                        { value: 130, label: '130px' },
                        { value: 200, label: '200px' }
                    ]}
                    valueLabelDisplay='auto'
                />
            </Box>

            {/* Grid Margin */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Widget Spacing: {colorTheme.gridMargin}px
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    Controls the gap between widgets. Smaller values create a more compact layout.
                </Typography>
                <Slider
                    value={colorTheme.gridMargin}
                    onChange={(_, value) => updateColor('gridMargin', value as number)}
                    min={0}
                    max={32}
                    step={2}
                    marks={[
                        { value: 0, label: '0px' },
                        { value: 16, label: '16px' },
                        { value: 32, label: '32px' }
                    ]}
                    valueLabelDisplay='auto'
                />
            </Box>

            {/* Reset Button */}
            <Button
                variant='outlined'
                size='small'
                startIcon={<FaUndo />}
                onClick={handleResetGrid}
                sx={{ mt: 2 }}
            >
                Reset Grid Settings
            </Button>
        </Box>
    );
};
