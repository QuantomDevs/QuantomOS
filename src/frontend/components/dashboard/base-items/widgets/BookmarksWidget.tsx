import { Box, Typography, Link, Grid2 as Grid } from '@mui/material';
import { Bookmarks as BookmarksIcon, Launch, ErrorOutline } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { responsiveTypography, responsiveSpacing, responsiveIcons, responsiveDimensions } from '../../../../utils/responsiveStyles';

interface Bookmark {
    id: string;
    name: string;
    url: string;
    icon?: string;
}

interface BookmarksWidgetProps {
    config?: {
        title?: string;
        layout?: 'vertical' | 'horizontal' | 'grid' | 'grid-horizontal';
        hideTitle?: boolean;
        hideIcons?: boolean;
        hideHostnames?: boolean;
        openInNewTab?: boolean;
        bookmarks?: Bookmark[];
        showLabel?: boolean;
        displayName?: string;
    };
    previewMode?: boolean;
    editMode?: boolean;
}

const getFavicon = (url: string): string => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        // Use Google's favicon service
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
        return '';
    }
};

const getHostname = (url: string): string => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return url;
    }
};

export const BookmarksWidget: React.FC<BookmarksWidgetProps> = ({ config, previewMode = false }) => {
    const [faviconErrors, setFaviconErrors] = useState<Set<string>>(new Set());

    const title = config?.title || 'Bookmarks';
    const layout = config?.layout || 'vertical';
    const hideTitle = config?.hideTitle === true;
    const hideIcons = config?.hideIcons === true;
    const hideHostnames = config?.hideHostnames === true;
    const openInNewTab = config?.openInNewTab !== false;
    const bookmarks = config?.bookmarks || [];
    const showLabel = config?.showLabel !== false;
    const displayName = config?.displayName || 'Bookmarks';

    const handleFaviconError = (bookmarkId: string) => {
        setFaviconErrors(prev => new Set(prev).add(bookmarkId));
    };

    // Show empty state if no bookmarks
    if (bookmarks.length === 0 && !previewMode) {
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
                <BookmarksIcon sx={{ fontSize: responsiveIcons.xlarge, color: 'var(--color-secondary-text)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'var(--color-primary-text)', mb: 1 }}>
                    No Bookmarks Configured
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-secondary-text)' }}>
                    Please add bookmarks in the widget settings
                </Typography>
            </Box>
        );
    }

    // Preview mode with sample bookmarks
    const displayBookmarks = previewMode ? [
        { id: '1', name: 'Example 1', url: 'https://example.com' },
        { id: '2', name: 'Example 2', url: 'https://google.com' },
        { id: '3', name: 'Example 3', url: 'https://github.com' }
    ] : bookmarks;

    const renderBookmark = (bookmark: Bookmark) => {
        const favicon = bookmark.icon || getFavicon(bookmark.url);
        const hostname = getHostname(bookmark.url);
        const hasFaviconError = faviconErrors.has(bookmark.id);

        return (
            <Link
                key={bookmark.id}
                href={bookmark.url}
                target={openInNewTab ? '_blank' : '_self'}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
                underline="none"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: layout === 'grid' || layout === 'grid-horizontal' ? responsiveSpacing.md : responsiveSpacing.sm,
                    backgroundColor: 'var(--color-secondary-background)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    gap: responsiveSpacing.sm,
                    '&:hover': {
                        backgroundColor: 'var(--color-hover-background)',
                        borderColor: 'var(--color-primary-accent)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }
                }}
            >
                {!hideIcons && (
                    <Box
                        sx={{
                            width: responsiveDimensions.sm,
                            height: responsiveDimensions.sm,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {hasFaviconError || !favicon ? (
                            <Launch sx={{ fontSize: responsiveIcons.medium, color: 'var(--color-primary-accent)' }} />
                        ) : (
                            <img
                                src={favicon}
                                alt=""
                                onError={() => handleFaviconError(bookmark.id)}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        )}
                    </Box>
                )}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {!hideTitle && (
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'var(--color-primary-text)',
                                fontWeight: 600,
                                fontSize: responsiveTypography.body1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {bookmark.name}
                        </Typography>
                    )}
                    {!hideHostnames && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'var(--color-secondary-text)',
                                fontSize: responsiveTypography.caption,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block'
                            }}
                        >
                            {hostname}
                        </Typography>
                    )}
                </Box>

                {openInNewTab && (
                    <Launch sx={{ fontSize: responsiveIcons.small, color: 'var(--color-secondary-text)' }} />
                )}
            </Link>
        );
    };

    const renderLayout = () => {
        switch (layout) {
        case 'horizontal':
            return (
                <Box
                    sx={{
                        display: 'flex',
                        gap: responsiveSpacing.md,
                        overflowX: 'auto',
                        padding: responsiveSpacing.sm,
                        '&::-webkit-scrollbar': {
                            height: 6
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--color-border)',
                            borderRadius: 3
                        }
                    }}
                >
                    {displayBookmarks.map(renderBookmark)}
                </Box>
            );

        case 'grid':
        case 'grid-horizontal':
            return (
                <Grid container spacing={2} sx={{ padding: responsiveSpacing.sm }}>
                    {displayBookmarks.map((bookmark) => (
                        <Grid key={bookmark.id} size={{ xs: 12, sm: 6, md: layout === 'grid-horizontal' ? 4 : 6 }}>
                            {renderBookmark(bookmark)}
                        </Grid>
                    ))}
                </Grid>
            );

        case 'vertical':
        default:
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: responsiveSpacing.sm, padding: responsiveSpacing.sm }}>
                    {displayBookmarks.map(renderBookmark)}
                </Box>
            );
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--color-widget-background-transparent)',
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
                    overflowY: 'auto',
                    overflowX: layout === 'horizontal' ? 'auto' : 'hidden',
                    '&::-webkit-scrollbar': {
                        width: 6,
                        height: 6
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--color-border)',
                        borderRadius: 3
                    }
                }}
            >
                {renderLayout()}
            </Box>
        </Box>
    );
};
