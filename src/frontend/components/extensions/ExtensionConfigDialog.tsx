import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { MuiFileInput } from 'mui-file-input';

import { Extension, ExtensionSetting } from '../../types/extension.types';
import { uploadExtensionFile } from '../../api/extensions-api';

interface ExtensionConfigDialogProps {
    open: boolean;
    extension: Extension;
    onClose: () => void;
    onSave: (settings: Record<string, any>) => void;
    initialSettings?: Record<string, any>;
}

export const ExtensionConfigDialog: React.FC<ExtensionConfigDialogProps> = ({
    open,
    extension,
    onClose,
    onSave,
    initialSettings = {}
}) => {
    const [settings, setSettings] = useState<Record<string, any>>(() => {
        // Initialize with default values from extension schema
        const defaults: Record<string, any> = {};
        extension.settings?.forEach(setting => {
            defaults[setting.id] = initialSettings[setting.id] ?? setting.defaultValue;
        });
        return defaults;
    });

    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSettingChange = (settingId: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [settingId]: value
        }));

        // Clear error for this field
        if (errors[settingId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[settingId];
                return newErrors;
            });
        }
    };

    const handleFileUpload = async (settingId: string, file: File | null) => {
        if (!file) {
            handleSettingChange(settingId, '');
            return;
        }

        setUploadingFiles(prev => new Set(prev).add(settingId));

        try {
            const result = await uploadExtensionFile(file);
            handleSettingChange(settingId, result.path);
        } catch (error) {
            console.error('Error uploading file:', error);
            setErrors(prev => ({
                ...prev,
                [settingId]: 'Failed to upload file'
            }));
        } finally {
            setUploadingFiles(prev => {
                const newSet = new Set(prev);
                newSet.delete(settingId);
                return newSet;
            });
        }
    };

    const validateSettings = (): boolean => {
        const newErrors: Record<string, string> = {};

        extension.settings?.forEach(setting => {
            const value = settings[setting.id];

            // Check required fields
            if (setting.type === 'url' && value) {
                try {
                    new URL(value);
                } catch {
                    newErrors[setting.id] = 'Invalid URL';
                }
            }

            if (setting.type === 'number' && value !== null && value !== undefined) {
                if (isNaN(Number(value))) {
                    newErrors[setting.id] = 'Must be a valid number';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateSettings()) {
            onSave(settings);
        }
    };

    const renderSettingInput = (setting: ExtensionSetting) => {
        const value = settings[setting.id];
        const isUploading = uploadingFiles.has(setting.id);
        const error = errors[setting.id];

        switch (setting.type) {
            case 'text':
                return (
                    <TextField
                        fullWidth
                        label={setting.name}
                        value={value || ''}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        helperText={error || setting.description}
                        error={Boolean(error)}
                        margin="normal"
                    />
                );

            case 'url':
                return (
                    <TextField
                        fullWidth
                        type="url"
                        label={setting.name}
                        value={value || ''}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        helperText={error || setting.description}
                        error={Boolean(error)}
                        margin="normal"
                    />
                );

            case 'number':
                return (
                    <TextField
                        fullWidth
                        type="number"
                        label={setting.name}
                        value={value ?? ''}
                        onChange={(e) => handleSettingChange(setting.id, Number(e.target.value))}
                        helperText={error || setting.description}
                        error={Boolean(error)}
                        margin="normal"
                    />
                );

            case 'boolean':
                return (
                    <Box sx={{ my: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={Boolean(value)}
                                    onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                                />
                            }
                            label={setting.name}
                        />
                        {setting.description && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
                                {setting.description}
                            </Typography>
                        )}
                    </Box>
                );

            case 'file':
                return (
                    <Box sx={{ my: 2 }}>
                        <MuiFileInput
                            label={setting.name}
                            value={value ? new File([], value.split('/').pop() || 'file') : null}
                            onChange={(file) => handleFileUpload(setting.id, file)}
                            helperText={error || setting.description}
                            error={Boolean(error)}
                            disabled={isUploading}
                            InputProps={{
                                endAdornment: isUploading ? <CircularProgress size={20} /> : null
                            }}
                        />
                        {value && !isUploading && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                Current file: {value.split('/').pop()}
                            </Typography>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Configure {extension.name}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {extension.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Version {extension.version} by {extension.author}
                    </Typography>
                </Box>

                {(!extension.settings || extension.settings.length === 0) ? (
                    <Alert severity="info">
                        This extension has no configurable settings.
                    </Alert>
                ) : (
                    <Box>
                        {extension.settings.map(setting => (
                            <Box key={setting.id}>
                                {renderSettingInput(setting)}
                            </Box>
                        ))}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={uploadingFiles.size > 0}
                >
                    Add to Dashboard
                </Button>
            </DialogActions>
        </Dialog>
    );
};
