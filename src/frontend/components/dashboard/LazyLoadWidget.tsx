import { Box, CircularProgress, Skeleton } from '@mui/material';
import React, { useRef, ReactNode } from 'react';

import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazyLoadWidgetProps {
    children: ReactNode;
    // Grid position dimensions to maintain proper placeholder size
    width?: string | number;
    height?: string | number;
    // Placeholder type
    placeholderType?: 'skeleton' | 'spinner' | 'blank';
    // Whether to only trigger once (default: true for performance)
    triggerOnce?: boolean;
}

/**
 * Wrapper component that lazy loads widgets when they enter the viewport
 * This improves initial page load performance by deferring rendering of off-screen widgets
 */
export const LazyLoadWidget: React.FC<LazyLoadWidgetProps> = ({
    children,
    width = '100%',
    height = '100%',
    placeholderType = 'skeleton',
    triggerOnce = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(containerRef, {
        rootMargin: '200px', // Start loading 200px before widget enters viewport
        threshold: 0,
        triggerOnce
    });

    // Render placeholder while widget is not visible
    const renderPlaceholder = () => {
        const placeholderStyle = {
            width,
            height,
            minHeight: height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };

        switch (placeholderType) {
        case 'spinner':
            return (
                <Box sx={placeholderStyle}>
                    <CircularProgress size={24} />
                </Box>
            );
        case 'blank':
            return (
                <Box sx={placeholderStyle} />
            );
        case 'skeleton':
        default:
            return (
                <Skeleton
                    variant="rectangular"
                    width={width}
                    height={height}
                    sx={{
                        borderRadius: '8px',
                        bgcolor: 'rgba(255, 255, 255, 0.05)'
                    }}
                    animation="wave"
                />
            );
        }
    };

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {isVisible ? children : renderPlaceholder()}
        </div>
    );
};
