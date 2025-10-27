import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { Extension, ExtensionMetadata, ConfiguredExtension } from '../../../types/extension.types';
import { fetchExtension } from '../../../api/extensions-api';
import { processExtensionTemplates } from '../../../utils/templateProcessor';
import { ExtensionsGallery } from '../../extensions/ExtensionsGallery';
import { ExtensionConfigDialog } from '../../extensions/ExtensionConfigDialog';

interface CustomExtensionConfigProps {
    onExtensionConfigured: (extensionData: ConfiguredExtension, extensionName: string) => void;
    onBack: () => void;
}

export const CustomExtensionConfig: React.FC<CustomExtensionConfigProps> = ({
    onExtensionConfigured,
    onBack
}) => {
    const [selectedExtension, setSelectedExtension] = useState<ExtensionMetadata | null>(null);
    const [fullExtension, setFullExtension] = useState<Extension | null>(null);
    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleExtensionSelect = async (extension: ExtensionMetadata) => {
        setLoading(true);
        try {
            // Fetch the full extension data including HTML, CSS, JS
            const fullData = await fetchExtension(extension.id);
            setSelectedExtension(extension);
            setFullExtension(fullData);
            setConfigDialogOpen(true);
        } catch (error) {
            console.error('Error loading extension:', error);
            alert('Failed to load extension. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfigSave = (settings: Record<string, any>) => {
        if (!fullExtension) return;

        // Process templates with user-configured settings
        const { processedHtml, processedCss, processedJavascript } = processExtensionTemplates(
            fullExtension.html,
            fullExtension.css || '',
            fullExtension.javascript || '',
            settings
        );

        const configuredExtension: ConfiguredExtension = {
            extensionId: fullExtension.id,
            extensionName: fullExtension.name,
            version: fullExtension.version,
            settings,
            processedHtml,
            processedCss,
            processedJavascript
        };

        // Pass the configured extension back to parent
        onExtensionConfigured(configuredExtension, fullExtension.title);

        // Close dialog
        setConfigDialogOpen(false);
    };

    const handleConfigClose = () => {
        setConfigDialogOpen(false);
        setSelectedExtension(null);
        setFullExtension(null);
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h6">
                    Select Custom Extension
                </Typography>
            </Box>

            <ExtensionsGallery
                onSelectExtension={handleExtensionSelect}
            />

            {fullExtension && (
                <ExtensionConfigDialog
                    open={configDialogOpen}
                    extension={fullExtension}
                    onClose={handleConfigClose}
                    onSave={handleConfigSave}
                />
            )}
        </Box>
    );
};
