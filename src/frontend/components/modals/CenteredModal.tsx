import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';

import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { styles } from '../../theme/styles';
import { theme } from '../../theme/theme';

type Props = {
    open: boolean;
    handleClose: () => void;
    title?: string;
    children: ReactNode;
    width?: string
    height?: string
    fullWidthContent?: boolean
}

export const CenteredModal = ({ open, handleClose, children, width, height, title, fullWidthContent = false }: Props) => {
    const windowDimensions = useWindowDimensions();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const setWidth = () => {
        if (width) {
            return width;
        }

        if (windowDimensions.width <= 1200) {
            return '92vw';
        }

        return '60vw'; // Increased from 50vw for better readability
    };

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: setWidth(),
        height: height || 'auto',
        bgcolor: 'background.paper',
        borderRadius: '12px', // Increased border radius
        boxShadow: 24,
        maxHeight: height ? height : '90vh',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none', // Remove focus outline
        border: 'none'   // Ensure no border
    };

    return (
        <Modal
            open={open}
            onClose={(event, reason) => {
                if (reason === 'escapeKeyDown') {
                    handleClose();
                }
            }}
            aria-labelledby='modal-title'
            aria-describedby='modal-description'
            disableScrollLock={false}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }
            }}
        >
            <Box sx={style}>
                {/* Clean Header with Title and Close Button */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 3,
                    pt: 3,
                    pb: 2,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    flexShrink: 0
                }}>
                    <Typography
                        id='modal-title'
                        sx={{
                            fontSize: '1.75rem', // Larger font size
                            fontWeight: 600, // Bolder weight
                            flexGrow: 1
                        }}
                    >
                        {title}
                    </Typography>
                    <Box
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        sx={styles.vcenter}
                    >
                        <Tooltip title='Close' placement='top'>
                            <IconButton
                                onClick={handleClose}
                                aria-label='Close modal'
                                sx={{
                                    color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                    }
                                }}
                            >
                                <CloseIcon sx={{ fontSize: 28 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Modal Content (Fix for Scroll Issues) */}
                <Box
                    id='modal-description'
                    sx={{
                        flex: 1, // Take remaining space
                        overflowY: 'auto', // Enable scrolling
                        overflowX: 'hidden', // Prevent horizontal scrolling
                        py: 3,
                        px: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: fullWidthContent ? 'stretch' : 'center',
                        width: '100%',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        }
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Modal>
    );
};
