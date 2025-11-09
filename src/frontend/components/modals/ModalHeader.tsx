import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

type Props = {
    title: string;
    onClose: () => void;
    onBack?: () => void;
}

export const ModalHeader = ({ title, onClose, onBack }: Props) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            pt: 3,
            pb: 2,
            borderBottom: '1px solid var(--color-border)',
            flexShrink: 0
        }}>
            {/* Back Button (Left) */}
            <Box sx={{ minWidth: '48px', display: 'flex', justifyContent: 'flex-start' }}>
                {onBack && (
                    <Tooltip title='Back' placement='top'>
                        <IconButton
                            onClick={onBack}
                            aria-label='Go back'
                            sx={{
                                color: 'var(--color-primary-text)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--color-primary-accent)'
                                }
                            }}
                        >
                            <ArrowBackIcon sx={{ fontSize: 24 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Title (Center) */}
            <Typography
                sx={{
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    flexGrow: 1,
                    textAlign: 'center',
                    color: 'var(--color-primary-text)'
                }}
            >
                {title}
            </Typography>

            {/* Close Button (Right) */}
            <Box sx={{ minWidth: '48px', display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title='Close' placement='top'>
                    <IconButton
                        onClick={onClose}
                        aria-label='Close modal'
                        sx={{
                            color: 'var(--color-primary-text)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--color-error)'
                            }
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};
