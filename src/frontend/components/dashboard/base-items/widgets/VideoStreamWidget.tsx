import { Box, Typography } from '@mui/material';
import { ErrorOutline, VideoLibrary } from '@mui/icons-material';
import React, { useRef, useState } from 'react';
import { responsiveTypography, responsiveSpacing, responsiveIcons } from '../../../../utils/responsiveStyles';

interface VideoStreamWidgetProps {
    config?: {
        feedUrl?: string;
        autoplay?: boolean;
        muted?: boolean;
        showControls?: boolean;
        showLabel?: boolean;
        displayName?: string;
    };
    previewMode?: boolean;
    editMode?: boolean;
}

export const VideoStreamWidget: React.FC<VideoStreamWidgetProps> = ({ config, previewMode = false, editMode = false }) => {
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const feedUrl = config?.feedUrl || '';
    const autoplay = config?.autoplay !== false;
    const muted = config?.muted !== false;
    const showControls = config?.showControls === true;
    const showLabel = config?.showLabel !== false;
    const displayName = config?.displayName || 'Video Stream';

    const handleError = () => {
        setHasError(true);
    };

    // Show configuration message if no URL is set
    if (!feedUrl && !previewMode) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    textAlign: 'center',
                    backgroundColor: 'var(--color-widget-background)',
                    borderRadius: '8px'
                }}
            >
                <VideoLibrary sx={{ fontSize: responsiveIcons.xlarge, color: 'var(--color-secondary-text)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'var(--color-primary-text)', mb: 1 }}>
                    No Video URL Configured
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-secondary-text)' }}>
                    Please configure a video feed URL in the widget settings
                </Typography>
            </Box>
        );
    }

    // Preview mode - show placeholder
    if (previewMode) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    textAlign: 'center',
                    backgroundColor: 'var(--color-widget-background)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)'
                }}
            >
                <VideoLibrary sx={{ fontSize: responsiveIcons.xlarge, color: 'var(--color-primary-accent)', mb: 1 }} />
                <Typography variant="body2" sx={{ color: 'var(--color-secondary-text)' }}>
                    Video Stream Preview
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--color-muted-text)', mt: 1 }}>
                    Display video feeds and camera streams
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--color-widget-background)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        >
            {showLabel && (
                <Box
                    sx={{
                        padding: `${responsiveSpacing.sm} ${responsiveSpacing.md}`,
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-secondary-background)'
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: 'var(--color-primary-text)',
                            fontWeight: 600,
                            fontSize: responsiveTypography.subtitle2
                        }}
                    >
                        {displayName}
                    </Typography>
                </Box>
            )}

            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    width: '100%',
                    height: showLabel ? 'calc(100% - 48px)' : '100%',
                    backgroundColor: 'var(--color-secondary-background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {hasError ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 2,
                            textAlign: 'center',
                            color: 'white'
                        }}
                    >
                        <ErrorOutline sx={{ fontSize: responsiveIcons.xlarge, color: 'var(--color-error)', mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Failed to load video stream
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            The video URL may be invalid or the format is not supported
                        </Typography>
                    </Box>
                ) : (
                    <video
                        ref={videoRef}
                        src={feedUrl}
                        autoPlay={autoplay && !editMode}
                        muted={muted}
                        controls={showControls}
                        loop
                        playsInline
                        onError={handleError}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};
