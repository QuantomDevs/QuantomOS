import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';

import { ConfiguredExtension } from '../../../../types/extension.types';

interface CustomExtensionWidgetProps {
    config?: {
        showLabel?: boolean;
        displayName?: string;
        extensionData?: ConfiguredExtension;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

/**
 * CustomExtensionWidget
 * Renders custom extensions with Shadow DOM isolation
 */
export const CustomExtensionWidget: React.FC<CustomExtensionWidgetProps> = ({ config }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current || !config?.extensionData) {
            return;
        }

        try {
            const { processedHtml, processedCss, processedJavascript } = config.extensionData;

            // Clear any existing content
            containerRef.current.innerHTML = '';

            // Create Shadow DOM
            let shadowRoot: ShadowRoot;
            try {
                shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
            } catch (error) {
                // Shadow root already exists, use it
                shadowRoot = containerRef.current.shadowRoot!;
            }

            // Create a container div for the content
            const contentContainer = document.createElement('div');
            contentContainer.className = 'extension-content';

            // Inject CSS
            if (processedCss) {
                const styleElement = document.createElement('style');
                styleElement.textContent = processedCss;
                shadowRoot.appendChild(styleElement);
            }

            // Inject HTML
            contentContainer.innerHTML = processedHtml;
            shadowRoot.appendChild(contentContainer);

            // Execute JavaScript if present
            if (processedJavascript && processedJavascript.trim()) {
                try {
                    // Create a function with shadowRoot in scope
                    const scriptFunction = new Function('shadowRoot', processedJavascript);
                    scriptFunction(shadowRoot);
                } catch (jsError) {
                    console.error('Error executing extension JavaScript:', jsError);
                    setError(`JavaScript Error: ${jsError instanceof Error ? jsError.message : 'Unknown error'}`);
                }
            }

            setError(null);
        } catch (error) {
            console.error('Error rendering extension:', error);
            setError(error instanceof Error ? error.message : 'Unknown error occurred');
        }

        // Cleanup function
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [config?.extensionData]);

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">
                    <Typography variant="body2">
                        Failed to render extension: {error}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    if (!config?.extensionData) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="warning">
                    <Typography variant="body2">
                        No extension data available
                    </Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box
            ref={containerRef}
            sx={{
                width: '100%',
                height: '100%',
                overflow: 'auto'
            }}
        />
    );
};
