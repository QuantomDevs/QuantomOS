import { Box } from '@mui/material';
import React, { useMemo } from 'react';

import { GRID_CONFIG } from '../../config/gridConfig';
import { useTheme } from '../../context/ThemeContext';

interface GridGuidelinesProps {
    containerWidth: number;
    rowHeight: number;
    currentBreakpoint: string;
    numRows?: number; // Number of rows to display (auto-calculated if not provided)
}

/**
 * Visual grid overlay component that displays column and row guidelines
 * in edit mode to help users align and size widgets precisely
 */
export const GridGuidelines: React.FC<GridGuidelinesProps> = ({
    containerWidth,
    rowHeight,
    currentBreakpoint,
    numRows = 20 // Default to 20 rows
}) => {
    const { colorTheme } = useTheme();

    // Get number of columns for current breakpoint
    const cols = useMemo(() => {
        return GRID_CONFIG.cols[currentBreakpoint as keyof typeof GRID_CONFIG.cols] || GRID_CONFIG.cols.lg;
    }, [currentBreakpoint]);

    // Calculate column width
    const columnWidth = useMemo(() => {
        const margin = colorTheme.gridMargin;
        const containerPadding = GRID_CONFIG.containerPadding[0];
        const innerWidth = containerWidth - (containerPadding * 2);
        return (innerWidth - (margin * (cols - 1))) / cols;
    }, [containerWidth, cols, colorTheme.gridMargin]);

    // Generate column positions
    const columnPositions = useMemo(() => {
        const positions: number[] = [];
        const margin = colorTheme.gridMargin;
        const containerPadding = GRID_CONFIG.containerPadding[0];

        for (let i = 0; i <= cols; i++) {
            const position = containerPadding + (i * (columnWidth + margin));
            positions.push(position);
        }
        return positions;
    }, [cols, columnWidth, colorTheme.gridMargin]);

    // Generate row positions
    const rowPositions = useMemo(() => {
        const positions: number[] = [];
        const margin = colorTheme.gridMargin;
        const containerPadding = GRID_CONFIG.containerPadding[1];

        for (let i = 0; i <= numRows; i++) {
            const position = containerPadding + (i * (rowHeight + margin));
            positions.push(position);
        }
        return positions;
    }, [numRows, rowHeight, colorTheme.gridMargin]);

    return (
        <Box
            className="grid-guidelines"
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none', // Allow clicks to pass through
                zIndex: 0, // Behind grid items
                overflow: 'hidden'
            }}
        >
            {/* Vertical column lines */}
            {columnPositions.map((position, index) => (
                <Box
                    key={`col-${index}`}
                    sx={{
                        position: 'absolute',
                        left: `${position}px`,
                        top: 0,
                        width: '1px',
                        height: '100%',
                        backgroundColor: 'rgba(139, 92, 246, 0.15)', // Primary accent with low opacity
                        borderLeft: '1px dashed rgba(139, 92, 246, 0.3)'
                    }}
                />
            ))}

            {/* Horizontal row lines */}
            {rowPositions.map((position, index) => (
                <Box
                    key={`row-${index}`}
                    sx={{
                        position: 'absolute',
                        top: `${position}px`,
                        left: 0,
                        width: '100%',
                        height: '1px',
                        backgroundColor: 'rgba(139, 92, 246, 0.15)', // Primary accent with low opacity
                        borderTop: '1px dashed rgba(139, 92, 246, 0.3)'
                    }}
                />
            ))}
        </Box>
    );
};
