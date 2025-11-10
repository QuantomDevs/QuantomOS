import { Grid2 as Grid, Typography, Box } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { CheckboxElement, TextFieldElement } from 'react-hook-form-mui';

import { FormValues } from '../AddEditForm/types';

interface IframeWidgetConfigProps {
    formContext: UseFormReturn<FormValues>;
}

export const IframeWidgetConfig = ({ formContext }: IframeWidgetConfigProps) => {
    return (
        <Grid container spacing={2} direction='column'>
            <Grid>
                <TextFieldElement
                    name='displayName'
                    label='Display Name'
                    placeholder='Iframe'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
            </Grid>

            <Grid>
                <TextFieldElement
                    name='url'
                    label='URL'
                    placeholder='https://example.com'
                    fullWidth
                    required
                    rules={{
                        required: 'URL is required',
                        pattern: {
                            value: /^https?:\/\/.+/,
                            message: 'Please enter a valid URL starting with http:// or https://'
                        }
                    }}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
            </Grid>

            <Grid>
                <CheckboxElement
                    label='Interactive Mode'
                    name='interactive'
                    sx={{
                        ml: 1,
                        color: 'white',
                        '& .MuiSvgIcon-root': { fontSize: 30 },
                        '& .MuiFormHelperText-root': {
                            marginLeft: 1,
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }}
                />
                <Box sx={{ ml: 5, mt: -1 }}>
                    <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Allow user interaction with the iframe content
                    </Typography>
                </Box>
            </Grid>

            <Grid>
                <CheckboxElement
                    label='Show Label'
                    name='showLabel'
                    sx={{
                        ml: 1,
                        color: 'white',
                        '& .MuiSvgIcon-root': { fontSize: 30 },
                        '& .MuiFormHelperText-root': {
                            marginLeft: 1,
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }}
                />
            </Grid>
        </Grid>
    );
};
