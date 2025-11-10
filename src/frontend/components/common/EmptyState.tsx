import { Box, Button, Typography } from '@mui/material';
import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center',
                minHeight: '200px'
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    fontSize: '48px',
                    color: 'var(--color-secondary-text)',
                    mb: 2,
                    opacity: 0.5
                }}
            >
                {icon}
            </Box>

            {/* Title */}
            <Typography
                variant='h6'
                sx={{
                    fontWeight: 600,
                    color: 'var(--color-primary-text)',
                    mb: 1
                }}
            >
                {title}
            </Typography>

            {/* Description */}
            <Typography
                variant='body2'
                sx={{
                    color: 'var(--color-secondary-text)',
                    opacity: 0.8,
                    mb: action ? 3 : 0,
                    maxWidth: '400px'
                }}
            >
                {description}
            </Typography>

            {/* Optional Action Button */}
            {action && (
                <Button
                    variant='contained'
                    onClick={action.onClick}
                    sx={{
                        backgroundColor: 'var(--color-primary-accent)',
                        color: 'var(--color-primary-text)',
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: 'var(--color-secondary-accent)',
                        }
                    }}
                >
                    {action.label}
                </Button>
            )}
        </Box>
    );
};
