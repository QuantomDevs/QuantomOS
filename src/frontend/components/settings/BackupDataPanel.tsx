import { Box, Button, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { FaDownload, FaUpload, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { DashApi } from '../../api/dash-api';
import { useAppContext } from '../../context/useAppContext';
import { Config } from '../../types';
import { PopupManager } from '../modals/PopupManager';
import { ToastManager } from '../toast/ToastManager';

export const BackupDataPanel: React.FC = () => {
    const { config, updateConfig, refreshDashboard } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleExportConfig = async () => {
        try {
            await DashApi.exportConfig();
            ToastManager.success('Configuration exported successfully!');
        } catch (error) {
            ToastManager.error('Failed to export configuration');
            console.error('Error exporting configuration:', error);
        }
    };

    const handleImportConfig = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const fileReader = new FileReader();

            fileReader.onload = async (e) => {
                try {
                    const fileContent = e.target?.result;
                    if (typeof fileContent === 'string') {
                        const importedConfig = JSON.parse(fileContent) as Config;

                        // Validate imported config has required structure
                        if (importedConfig && typeof importedConfig === 'object') {
                            // Use the import endpoint
                            await DashApi.importConfig(importedConfig);
                            await refreshDashboard();

                            // Show success message
                            PopupManager.success('Configuration restored successfully!', () => navigate('/'));
                        }
                    }
                } catch (error) {
                    ToastManager.error('Failed to restore configuration. The file format may be invalid.');
                    console.error('Error restoring configuration:', error);
                }
            };

            fileReader.readAsText(file);
        } catch (error) {
            ToastManager.error('Failed to restore configuration. The file format may be invalid.');
            console.error('Error restoring configuration:', error);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSyncLayout = () => {
        PopupManager.deleteConfirmation({
            title: 'Copy Desktop Layout to Mobile',
            text: 'This will overwrite your current mobile layout with your desktop layout. Continue?',
            confirmText: 'Yes, Copy',
            confirmAction: async () => {
                try {
                    if (!config?.layout?.desktop) {
                        ToastManager.error('No desktop layout found to copy');
                        return;
                    }

                    const updatedLayout = {
                        layout: {
                            desktop: config.layout.desktop,
                            mobile: [...config.layout.desktop]
                        }
                    };

                    await updateConfig(updatedLayout);
                    await refreshDashboard();

                    ToastManager.success('Desktop layout successfully copied to mobile');
                } catch (error) {
                    ToastManager.error('Failed to copy desktop layout to mobile');
                    console.error('Error copying layout:', error);
                }
            }
        });
    };

    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                Backup & Data
            </Typography>

            <Typography variant='body2' sx={{ mb: 4, opacity: 0.8 }}>
                Export and restore dashboard configuration, sync layouts between devices.
            </Typography>

            {/* Export Configuration */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Export Configuration
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1.5, opacity: 0.7 }}>
                    Download your current dashboard configuration as a JSON file
                </Typography>
                <Button
                    variant='contained'
                    startIcon={<FaDownload />}
                    onClick={handleExportConfig}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Export Configuration
                </Button>
            </Box>

            {/* Import Configuration */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Restore Configuration
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1.5, opacity: 0.7 }}>
                    Upload a previously exported configuration file to restore your settings
                </Typography>
                <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='.json'
                    style={{ display: 'none' }}
                />
                <Button
                    variant='contained'
                    startIcon={<FaUpload />}
                    onClick={handleImportConfig}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Import Configuration
                </Button>
            </Box>

            {/* Layout Sync */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Layout Sync
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1.5, opacity: 0.7 }}>
                    Copy your desktop layout to mobile view for consistency across devices
                </Typography>
                <Button
                    variant='contained'
                    startIcon={<FaSync />}
                    onClick={handleSyncLayout}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Copy Desktop Layout to Mobile
                </Button>
            </Box>
        </Box>
    );
};
