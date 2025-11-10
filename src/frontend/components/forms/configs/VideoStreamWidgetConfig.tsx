import { Grid2 as Grid, Typography, Box, Alert } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { CheckboxElement, TextFieldElement } from 'react-hook-form-mui';

import { FormValues } from '../AddEditForm/types';

interface VideoStreamWidgetConfigProps {
    formContext: UseFormReturn<FormValues>;
}

export const VideoStreamWidgetConfig = ({ formContext }: VideoStreamWidgetConfigProps) => {
    return (
        <Grid container spacing={2} direction='column'>
            <Grid>
                <TextFieldElement
                    name='displayName'
                    label='Display Name'
                    placeholder='Video Stream'
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
                    name='feedUrl'
                    label='Feed URL'
                    placeholder='https://example.com/video.mp4'
                    fullWidth
                    required
                    rules={{
                        required: 'Feed URL is required',
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
                <Box sx={{ mt: 1 }}>
                    <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Supported formats: MP4, WebM, Ogg, HLS streams, MJPEG streams
                    </Typography>
                </Box>
            </Grid>

            <Grid>
                <CheckboxElement
                    label='Autoplay'
                    name='autoplay'
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
                        Automatically play the video when loaded
                    </Typography>
                </Box>
            </Grid>

            <Grid>
                <CheckboxElement
                    label='Muted'
                    name='muted'
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
                        Mute the video stream (required for autoplay in most browsers)
                    </Typography>
                </Box>
            </Grid>

            <Grid>
                <CheckboxElement
                    label='Show Controls'
                    name='showControls'
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
                        Display video controls (play, pause, volume, fullscreen, etc.)
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

            <Grid>
                <Alert severity="info" sx={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: 'white' }}>
                    <Typography variant='caption'>
                        <strong>Note:</strong> Autoplay only works when the video is muted due to browser restrictions.
                        Some video formats or streaming protocols may not be supported by all browsers.
                    </Typography>
                </Alert>
            </Grid>
        </Grid>
    );
};
