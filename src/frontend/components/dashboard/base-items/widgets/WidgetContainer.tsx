import { Card } from '@mui/material';
import React from 'react';

import { EditMenu } from './EditMenu';
import { StatusIndicator } from './StatusIndicator';

type Props = {
    children: React.ReactNode;
    editMode: boolean;
    id?: string;
    onEdit?: () => void
    onDelete?: () => void;
    onDuplicate?: () => void;
    appShortcut?: boolean;
    placeholder?: boolean;
    url?: string;
    healthCheckType?: 'http' | 'ping';
    rowPlaceholder?: boolean;
    groupItem?: boolean;
    isHighlighted?: boolean;
    isPreview?: boolean;
    customHeight?: any; // Allow customizing widget height
};

export const WidgetContainer: React.FC<Props> = ({
    children,
    editMode,
    id,
    onEdit,
    onDelete,
    onDuplicate,
    appShortcut=false,
    placeholder=false,
    url,
    healthCheckType='http',
    rowPlaceholder,
    groupItem,
    isHighlighted = false,
    isPreview = false,
    customHeight
}) => {
    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                height: '100%', // Fill the grid item height
                // Enable container queries for responsive widget content
                containerType: 'size',
                containerName: 'widget',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isHighlighted ? 'rgba(255, 255, 255, 0.13)' :
                    isPreview ? 'rgba(76, 175, 80, 0.05)' :
                        placeholder || groupItem ? 'transparent' : 'var(--color-widget-background-transparent)',
                borderRadius: 'var(--widget-border-radius)',
                border: isPreview ? `2px dashed var(--color-hover-border)` :
                    placeholder && editMode ? 'none' : !placeholder ? `1px solid var(--color-border)` : 'none',
                padding: 0,
                cursor: editMode ? 'grab' : !placeholder ? 'auto' : 'auto',
                boxShadow: placeholder ? 0 : 2,
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                backdropFilter: placeholder || groupItem ? 'none' : 'blur(var(--backdrop-blur))',
                transition: 'background-color 0.3s ease, outline 0.3s ease',
                ...(isPreview && {
                    animation: 'pulse 2s infinite ease-in-out',
                    '@keyframes pulse': {
                        '0%': { opacity: 0.7 },
                        '50%': { opacity: 9 },
                        '100%': { opacity: 0.7 }
                    }
                })
            }}
            data-preview={isPreview ? 'true' : 'false'}
        >
            {!isPreview && <EditMenu editMode={editMode} itemId={id} onEdit={onEdit} onDelete={onDelete} onDuplicate={onDuplicate} />}
            {children}
            {!isPreview && <StatusIndicator url={url} healthCheckType={healthCheckType} />}
        </Card>
    );
};
