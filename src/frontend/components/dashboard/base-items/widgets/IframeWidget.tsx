import { Box, Typography, CircularProgress } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import React, { useState } from 'react';
import { responsiveTypography, responsiveSpacing, responsiveIcons } from '../../../../utils/responsiveStyles';

interface IframeWidgetProps {
    config?: {
        url?: string;
        interactive?: boolean;
        showLabel?: boolean;
        displayName?: string;
    };
    previewMode?: boolean;
    editMode?: boolean;
}

export const IframeWidget: React.FC<IframeWidgetProps> = ({ config, previewMode = false, editMode = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const url = config?.url || '';
    const interactive = config?.interactive !== false;
    const showLabel = config?.showLabel !== false;
    const displayName = config?.displayName || 'Iframe';

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    // Show configuration message if no URL is set
    if (!url && !previewMode) {
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
                <ErrorOutline sx={{ fontSize: responsiveIcons.xlarge, color: 'var(--color-secondary-text)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'var(--color-primary-text)', mb: 1 }}>
                    No URL Configured
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-secondary-text)' }}>
                    Please configure a URL in the widget settings
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
                <Typography variant="body2" sx={{ color: 'var(--color-secondary-text)' }}>
                    Iframe Preview
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--color-muted-text)', mt: 1 }}>
                    Embed external content
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
                    height: showLabel ? 'calc(100% - 48px)' : '100%'
                }}
            >
                {isLoading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--color-widget-background)',
                            zIndex: 1
                        }}
                    >
                        <CircularProgress size={40} sx={{ color: 'var(--color-primary-accent)' }} />
                    </Box>
                )}

                {hasError && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 2,
                            textAlign: 'center',
                            backgroundColor: 'var(--color-widget-background)'
                        }}
                    >
                        <ErrorOutline sx={{ fontSize: responsiveIcons.xlarge, color: 'var(--color-error)', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: 'var(--color-primary-text)', mb: 1 }}>
                            Failed to load content
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--color-secondary-text)' }}>
                            The URL may be invalid or the site blocks embedding
                        </Typography>
                    </Box>
                )}

                <iframe
                    src={url}
                    title={displayName}
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        pointerEvents: (interactive && !editMode) ? 'auto' : 'none',
                        display: hasError ? 'none' : 'block'
                    }}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
            </Box>
        </Box>
    );
};
