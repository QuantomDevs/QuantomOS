import { Box, Grid2 as Grid, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { ITEM_TYPE_OPTIONS } from './constants';
import { FormValues } from './types';
import { COLORS } from '../../../theme/styles';

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
                                    py: 3,
                                    px: .5,
                                    height: { xs: '200px', sm: '180px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    backgroundColor: COLORS.GRAY,
                                    borderRadius: '12px',
                                    border: `1px solid ${COLORS.LIGHT_GRAY_TRANSPARENT}`,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease',
                                    // Hover effects for mouse users
                                    '@media (pointer: fine)': {
                                        '&:hover': {
                                            backgroundColor: COLORS.LIGHT_GRAY_HOVER,
                                            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                                            transform: 'translateY(-2px)',
                                        },
                                    },
                                }}
                            >
                                <IconComponent
                                    sx={{
                                        fontSize: 44,
                                        color: 'text.primary',
                                        mb: 1.5
                                    }}
                                />
                                <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: 'text.primary',
                                            fontWeight: 700,
                                            mb: 1,
                                            lineHeight: 1.2,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {option.label}
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{
                                            fontSize: '0.75rem',
                                            lineHeight: 1.2,
                                            px: 0.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: { xs: 4, sm: 3 },
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
