import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                width: '100%'
            }}
        >
            <CircularProgress
                sx={{
                    color: 'var(--color-primary-accent)'
                }}
            />
        </Box>
    );
};
