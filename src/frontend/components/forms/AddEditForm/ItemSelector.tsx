import { Box, Grid2 as Grid, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { ITEM_TYPE_OPTIONS } from './constants';
import { FormValues } from './types';

type Props = {
    formContext: UseFormReturn<FormValues>
    setCurrentStep: Dispatch<SetStateAction<'select' | 'widget-select' | 'configure'>>;
}

export const ItemTypeSelector = ({ formContext, setCurrentStep }: Props) => {
    const handleItemTypeSelect = (itemTypeId: string) => {
        formContext.setValue('itemType', itemTypeId);
        if (itemTypeId === 'widget') {
            setCurrentStep('widget-select');
        } else {
            setCurrentStep('configure');
        }
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Grid container spacing={2.5} sx={{ justifyContent: 'center' }}>
                {ITEM_TYPE_OPTIONS.map((option) => {
                    const IconComponent = option.icon;

                    return (
                        <Grid
                            key={option.id}
                            size={{ xs: 6, sm: 6, md: 3 }}
                        >
                            <Box
                                onClick={() => handleItemTypeSelect(option.id)}
                                sx={{
                                    p: 3,
                                    height: { xs: '220px', sm: '200px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 2,
                                    cursor: 'pointer',
                                    backgroundColor: 'var(--color-background)',
                                    borderRadius: '16px',
                                    border: '2px solid var(--color-border)',
                                    transition: 'all 0.2s ease',
                                    // Hover effects for mouse users
                                    '@media (pointer: fine)': {
                                        '&:hover': {
                                            borderColor: 'var(--color-primary-accent)',
                                            backgroundColor: 'var(--color-background)',
                                            transform: 'scale(1.02)',
                                        },
                                    },
                                }}
                            >
                                <IconComponent
                                    sx={{
                                        fontSize: 56,
                                        color: 'var(--color-primary-accent)',
                                    }}
                                />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: 'var(--color-primary-text)',
                                            fontWeight: 700,
                                            mb: 1,
                                            lineHeight: 1.2,
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        {option.label}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            fontSize: '0.85rem',
                                            lineHeight: 1.3,
                                            color: 'var(--color-secondary-text)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: { xs: 3, sm: 2 },
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
        </Box>
    );
};
