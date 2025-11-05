import { Box, Grid2 as Grid, Typography, useMediaQuery } from '@mui/material';
import { useCallback, useMemo } from 'react';

import { DashApi } from '../../../../api/dash-api';
import { styles } from '../../../../theme/styles';
import { theme } from '../../../../theme/theme';
import { getIconPath } from '../../../../utils/utils';
import { PopupManager } from '../../../modals/PopupManager';

type Props = {
    url?: string;
    name: string;
    iconName: string;
    showLabel?: boolean;
    editMode?: boolean;
    config?: any;
    isPreview?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export const AppShortcut = ({ url, name, iconName, showLabel, editMode, config, isPreview, size = 'medium' }: Props) => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isWolShortcut = config?.isWol === true;

    // Calculate font size based on name length - uses clamp for responsive sizing
    const fontSize = useMemo(() => {
        if (!name) return 'clamp(0.7rem, 2vw, 1.2rem)';

        // Adjust font size based on text length - reduced all sizes to prevent overlap with status indicator
        if (name.length > 20) return 'clamp(0.55rem, 1.5vw, 0.9rem)';
        if (name.length > 15) return 'clamp(0.65rem, 1.8vw, 1rem)';
        if (name.length > 10) return 'clamp(0.7rem, 1.9vw, 1.1rem)';

        return 'clamp(0.7rem, 2vw, 1.2rem)';
    }, [name]);

    // Calculate text width based on size prop to prevent overlap with status icons
    const textWidth = useMemo(() => {
        if (size === 'small') {
            return '70%'; // Narrower for 4x2 layout to prevent overlap
        }
        return '80%'; // Default width for other layouts
    }, [size]);

    const handleWakeOnLan = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isWolShortcut || !config?.macAddress) {
            PopupManager.failure('Invalid Wake-on-LAN configuration');
            return;
        }

        try {
            // Prepare payload
            const payload: any = { mac: config.macAddress };
            if (config.broadcastAddress) payload.ip = config.broadcastAddress;
            if (config.port) payload.port = parseInt(config.port, 10);

            // Send WOL request
            await DashApi.sendWakeOnLan(payload);

            // Show success message
            PopupManager.success(`Wake-on-LAN packet sent to ${config.macAddress}`);
        } catch (error) {
            console.error('Error sending Wake-on-LAN packet:', error);
            PopupManager.failure('Failed to send Wake-on-LAN packet');
        }
    }, [config, isWolShortcut]);

    const shortcutContent = (
        <Box sx={{
            width: '100%',
            ...styles.vcenter,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Dynamic height based on container - takes most of the space
                flex: showLabel ? '1' : '1',
                width: '100%',
                padding: '10px',
                marginTop: showLabel ? '5px' : '0',
                position: 'relative',
                mt: isMobile ? -1.5 : 0,
                // Ensure icon container fills available space
                minHeight: 0

            }}>
                <Box
                    sx={{
                        // Icon size scales with container - uses percentage of container height
                        width: showLabel ? '70%' : '80%',
                        height: showLabel ? '70%' : '80%',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}
                >
                    <img
                        src={getIconPath(iconName)}
                        alt={name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            position: 'absolute'
                        }}
                        crossOrigin='anonymous'
                        draggable='false'
                    />
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                visibility: showLabel ? 'visible' : 'hidden',
                px: 1
            }}>
                {showLabel && (
                    <Typography
                        align='center'
                        fontSize={fontSize}
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word',
                            width: textWidth,
                            lineHeight: 1.2,
                            mt: 1
                        }}
                    >
                        {name}
                    </Typography>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            {editMode ? (
                <Box sx={{ ...styles.center, width: '100%', height: '100%' }} className='scale'>
                    {shortcutContent}
                </Box>
            ) : isPreview ? (
                <Box sx={{ ...styles.center, width: '100%', height: '100%' }} className='scale'>
                    {shortcutContent}
                </Box>
            ) : isWolShortcut ? (
                <a href='#' onClick={handleWakeOnLan} style={{ width: '100%', height: '100%' }}>
                    <Box sx={{ ...styles.center, width: '100%', height: '100%' }} className='scale'>
                        {shortcutContent}
                    </Box>
                </a>
            ) : !url && config?.healthUrl ? (
                <Box sx={{ ...styles.center, width: '100%', height: '100%' }} className='scale'>
                    {shortcutContent}
                </Box>
            ) : (
                <a href={url} rel='noopener noreferrer' target='_blank' style={{ width: '100%', height: '100%' }}>
                    <Box sx={{ ...styles.center, width: '100%', height: '100%' }} className='scale'>
                        {shortcutContent}
                    </Box>
                </a>
            )}
        </>
    );
};
