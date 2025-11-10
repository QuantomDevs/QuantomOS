import { Grid2 as Grid, Typography, Box } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { CheckboxElement, TextFieldElement } from 'react-hook-form-mui';

import { FormValues } from '../AddEditForm/types';

interface CalendarWidgetConfigProps {
    formContext: UseFormReturn<FormValues>;
}

export const CalendarWidgetConfig = ({ formContext }: CalendarWidgetConfigProps) => {
    const enableIcal = formContext.watch('enableIcal') as boolean | undefined;

    return (
        <Grid container spacing={2} direction='column'>
            <Grid>
                <TextFieldElement
                    name='displayName'
                    label='Display Name'
                    placeholder='Calendar'
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
                <CheckboxElement
                    label='Enable iCal Integration'
                    name='enableIcal'
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
                <Box sx={{ ml: 5, mt: -1, mb: 2 }}>
                    <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Import events from an iCal/ICS URL (e.g., Google Calendar, Outlook, etc.)
                    </Typography>
                </Box>
            </Grid>

            {enableIcal && (
                <Grid>
                    <TextFieldElement
                        name='icalUrl'
                        label='iCal URL'
                        placeholder='https://calendar.google.com/calendar/ical/...'
                        fullWidth
                        required={enableIcal}
                        rules={
                            enableIcal
                                ? {
                                    required: 'iCal URL is required when iCal is enabled',
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: 'Please enter a valid URL starting with http:// or https://'
                                    }
                                }
                                : undefined
                        }
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
                    <Box sx={{ mt: 1 }}>
                        <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            <strong>How to get your iCal URL:</strong><br />
                            • <strong>Google Calendar:</strong> Settings → Settings for my calendars → [Your Calendar] → Integrate calendar → Secret address in iCal format<br />
                            • <strong>Outlook:</strong> Calendar Settings → Shared calendars → Publish a calendar → ICS link<br />
                            • <strong>Apple Calendar:</strong> Right-click calendar → Share Calendar → Public Calendar URL
                        </Typography>
                    </Box>
                </Grid>
            )}

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
