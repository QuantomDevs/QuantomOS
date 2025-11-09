import { Box, Modal, useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';

import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { theme } from '../../theme/theme';
import { ModalHeader } from './ModalHeader';

type Props = {
    open: boolean;
    handleClose: () => void;
    title?: string;
    children: ReactNode;
    width?: string
    height?: string
    fullWidthContent?: boolean
    onBack?: () => void;
}

export const CenteredModal = ({ open, handleClose, children, width, height, title, fullWidthContent = false, onBack }: Props) => {
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
        bgcolor: 'var(--color-background)',
        borderRadius: '16px', // Increased border radius
        border: '2px solid var(--color-border)',
        boxShadow: 24,
        maxHeight: height ? height : '90vh',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none', // Remove focus outline
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
                {/* Modal Header with optional back button */}
                {title && (
                    <ModalHeader
                        title={title}
                        onClose={handleClose}
                        onBack={onBack}
                    />
                )}

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
