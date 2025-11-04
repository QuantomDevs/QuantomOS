import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import React, { ReactNode, useState } from 'react';

interface CollapsibleSectionProps {
    title: string;
    description: string;
    icon?: ReactNode;
    defaultExpanded?: boolean;
    children: ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    description,
    icon,
    defaultExpanded = false,
    children
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <Accordion
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            sx={{
                backgroundColor: 'var(--color-secondary-background)',
                borderRadius: '8px !important',
                marginBottom: 2,
                '&:before': {
                    display: 'none'
                },
                '&.Mui-expanded': {
                    margin: '0 0 16px 0 !important'
                }
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'var(--color-primary-text)' }} />}
                sx={{
                    minHeight: '64px',
                    padding: '0 20px',
                    '&.Mui-expanded': {
                        minHeight: '64px'
                    },
                    '& .MuiAccordionSummary-content': {
                        margin: '16px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        '&.Mui-expanded': {
                            margin: '16px 0'
                        }
                    }
                }}
            >
                {icon && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--color-primary-accent)',
                        fontSize: '1.5rem'
                    }}>
                        {icon}
                    </Box>
                )}
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant='h6' sx={{ fontWeight: 600, color: 'var(--color-primary-text)' }}>
                        {title}
                    </Typography>
                    <Typography variant='caption' sx={{
                        display: 'block',
                        color: 'var(--color-secondary-text)',
                        opacity: 0.8,
                        fontSize: '0.8rem'
                    }}>
                        {description}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '0 20px 20px 20px' }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};
