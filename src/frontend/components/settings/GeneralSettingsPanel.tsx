import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, MenuItem, Select, TextField, Typography, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useAppContext } from '../../context/useAppContext';
import { useTheme } from '../../context/ThemeContext';
import { SearchProvider } from '../../types';
import { ToastManager } from '../toast/ToastManager';
import { useDebounce } from '../../hooks/useDebounce';

// Predefined search providers
const SEARCH_PROVIDERS = [
    { id: 'google', label: 'Google', name: 'Google', url: 'https://www.google.com/search?q={query}' },
    { id: 'bing', label: 'Bing', name: 'Bing', url: 'https://www.bing.com/search?q={query}' },
    { id: 'duckduckgo', label: 'DuckDuckGo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q={query}' },
    { id: 'searx', label: 'Searx', name: 'Searx', url: 'https://searx.org/search?q={query}' },
    { id: 'custom', label: 'Custom', name: 'Custom', url: '' }
];

export const GeneralSettingsPanel: React.FC = () => {
    const { config, updateConfig } = useAppContext();
    const { colorTheme } = useTheme();

    // Local state for form fields
    const [title, setTitle] = useState(config?.title || 'QuantomOS');
    const [search, setSearch] = useState(config?.search || false);
    const [showInternetIndicator, setShowInternetIndicator] = useState(config?.showInternetIndicator !== false);
    const [publicAccess, setPublicAccess] = useState(config?.publicAccess || false);
    const [showPublicAccessDialog, setShowPublicAccessDialog] = useState(false);
    const [pendingPublicAccessValue, setPendingPublicAccessValue] = useState(false);
    const [searchProviderId, setSearchProviderId] = useState('google');
    const [customProviderName, setCustomProviderName] = useState('');
    const [customProviderUrl, setCustomProviderUrl] = useState('');

    // Debounced values for title and custom provider fields
    const debouncedTitle = useDebounce(title, 500);
    const debouncedCustomProviderName = useDebounce(customProviderName, 500);
    const debouncedCustomProviderUrl = useDebounce(customProviderUrl, 500);

    // Initialize search provider ID and custom fields
    useEffect(() => {
        if (config?.searchProvider) {
            const { name, url } = config.searchProvider;

            // Check if it matches any predefined provider
            const matchedProvider = SEARCH_PROVIDERS.find(
                p => p.id !== 'custom' && p.url === url
            );

            if (matchedProvider) {
                setSearchProviderId(matchedProvider.id);
            } else {
                // It's a custom provider
                setSearchProviderId('custom');
                setCustomProviderName(name || '');
                setCustomProviderUrl(url || '');
            }
        }

        // Initialize public access from config
        if (config?.publicAccess !== undefined) {
            setPublicAccess(config.publicAccess);
        }
    }, [config]);

    // Save title when debounced value changes
    useEffect(() => {
        if (debouncedTitle && debouncedTitle !== config?.title) {
            updateConfig({ title: debouncedTitle })
                .then(() => ToastManager.success('Title updated'))
                .catch(() => ToastManager.error('Failed to update title'));
        }
    }, [debouncedTitle]);

    // Save search enabled state
    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setSearch(newValue);

        try {
            await updateConfig({ search: newValue });
            ToastManager.success(newValue ? 'Search enabled' : 'Search disabled');
        } catch (error) {
            ToastManager.error('Failed to update search setting');
            setSearch(!newValue); // Revert on error
        }
    };

    // Save internet indicator state
    const handleInternetIndicatorChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setShowInternetIndicator(newValue);

        try {
            await updateConfig({ showInternetIndicator: newValue });
            ToastManager.success(newValue ? 'Internet indicator enabled' : 'Internet indicator disabled');
        } catch (error) {
            ToastManager.error('Failed to update internet indicator setting');
            setShowInternetIndicator(!newValue); // Revert on error
        }
    };

    // Handle public access toggle with confirmation
    const handlePublicAccessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setPendingPublicAccessValue(newValue);
        setShowPublicAccessDialog(true);
    };

    // Confirm public access change
    const confirmPublicAccessChange = async () => {
        setShowPublicAccessDialog(false);

        try {
            const response = await fetch('/api/config/public-access', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ enabled: pendingPublicAccessValue })
            });

            const data = await response.json();

            if (response.ok) {
                setPublicAccess(pendingPublicAccessValue);
                ToastManager.success(data.message || `Public access ${pendingPublicAccessValue ? 'enabled' : 'disabled'}`);
            } else {
                ToastManager.error(data.message || 'Failed to update public access setting');
            }
        } catch (error) {
            console.error('Error updating public access:', error);
            ToastManager.error('Failed to update public access setting');
        }
    };

    // Cancel public access change
    const cancelPublicAccessChange = () => {
        setShowPublicAccessDialog(false);
        setPendingPublicAccessValue(publicAccess);
    };

    // Save search provider when changed
    const handleSearchProviderChange = async (event: SelectChangeEvent<string>) => {
        const newProviderId = event.target.value;
        setSearchProviderId(newProviderId);

        if (newProviderId !== 'custom') {
            const selectedProvider = SEARCH_PROVIDERS.find(p => p.id === newProviderId);
            if (selectedProvider) {
                try {
                    await updateConfig({
                        searchProvider: {
                            name: selectedProvider.name,
                            url: selectedProvider.url
                        }
                    });
                    ToastManager.success('Search provider updated');
                } catch (error) {
                    ToastManager.error('Failed to update search provider');
                }
            }
        }
    };

    // Save custom provider when debounced values change
    useEffect(() => {
        if (searchProviderId === 'custom' && debouncedCustomProviderName && debouncedCustomProviderUrl) {
            // Validate URL format
            if (!debouncedCustomProviderUrl.includes('{query}')) {
                return;
            }

            updateConfig({
                searchProvider: {
                    name: debouncedCustomProviderName,
                    url: debouncedCustomProviderUrl
                }
            })
                .then(() => ToastManager.success('Custom search provider updated'))
                .catch(() => ToastManager.error('Failed to update custom search provider'));
        }
    }, [debouncedCustomProviderName, debouncedCustomProviderUrl, searchProviderId]);

    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                General Settings
            </Typography>

            <Typography variant='body2' sx={{ mb: 4, opacity: 0.8 }}>
                Configure basic dashboard settings like title, search, and internet indicator. All changes are saved automatically.
            </Typography>

            {/* Custom Title */}
            <Box sx={{ mb: 3 }}>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Custom Title
                </Typography>
                <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                    Set a custom title for your dashboard
                </Typography>
                <TextField
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='QuantomOS'
                    variant='outlined'
                    size='small'
                />
            </Box>

            {/* Enable Search */}
            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={search}
                            onChange={handleSearchChange}
                            sx={{
                                color: 'var(--color-primary-text)',
                                '&.Mui-checked': {
                                    color: 'var(--color-primary-accent)'
                                }
                            }}
                        />
                    }
                    label={
                        <Box>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                Enable Search
                            </Typography>
                            <Typography variant='caption' sx={{ opacity: 0.7 }}>
                                Display a search bar in the header
                            </Typography>
                        </Box>
                    }
                />
            </Box>

            {/* Search Provider (only if search is enabled) */}
            {search && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                        Search Provider
                    </Typography>
                    <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                        Choose which search engine to use
                    </Typography>
                    <Select
                        fullWidth
                        value={searchProviderId}
                        onChange={handleSearchProviderChange}
                        size='small'
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colorTheme.primaryText },
                                '&:hover fieldset': { borderColor: colorTheme.primaryAccent },
                                '&.Mui-focused fieldset': { borderColor: colorTheme.primaryAccent },
                            },
                            '.MuiSvgIcon-root': { fill: colorTheme.primaryText },
                        }}
                    >
                        {SEARCH_PROVIDERS.map((provider) => (
                            <MenuItem key={provider.id} value={provider.id}>
                                {provider.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            )}

            {/* Custom Provider Fields (only if custom is selected) */}
            {search && searchProviderId === 'custom' && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                            Provider Name
                        </Typography>
                        <TextField
                            fullWidth
                            value={customProviderName}
                            onChange={(e) => setCustomProviderName(e.target.value)}
                            placeholder='My Search Engine'
                            variant='outlined'
                            size='small'
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                            Search URL
                        </Typography>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1, opacity: 0.7 }}>
                            Use {'{query}'} as placeholder for the search term
                        </Typography>
                        <TextField
                            fullWidth
                            value={customProviderUrl}
                            onChange={(e) => setCustomProviderUrl(e.target.value)}
                            placeholder='https://www.google.com/search?q={query}'
                            variant='outlined'
                            size='small'
                        />
                    </Box>
                </>
            )}

            {/* Show Internet Indicator */}
            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showInternetIndicator}
                            onChange={handleInternetIndicatorChange}
                            sx={{
                                color: 'var(--color-primary-text)',
                                '&.Mui-checked': {
                                    color: 'var(--color-primary-accent)'
                                }
                            }}
                        />
                    }
                    label={
                        <Box>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                Show Internet Indicator
                            </Typography>
                            <Typography variant='caption' sx={{ opacity: 0.7 }}>
                                Display connection status in the menu
                            </Typography>
                        </Box>
                    }
                />
            </Box>

            {/* Public Access */}
            <Box sx={{ mb: 3 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={publicAccess}
                            onChange={handlePublicAccessChange}
                            sx={{
                                color: 'var(--color-primary-text)',
                                '&.Mui-checked': {
                                    color: 'var(--color-primary-accent)'
                                }
                            }}
                        />
                    }
                    label={
                        <Box>
                            <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                Public Access
                            </Typography>
                            <Typography variant='caption' sx={{ opacity: 0.7 }}>
                                Allow viewing dashboard without login (read-only mode)
                            </Typography>
                        </Box>
                    }
                />
            </Box>

            {/* Public Access Confirmation Dialog */}
            <Dialog
                open={showPublicAccessDialog}
                onClose={cancelPublicAccessChange}
                aria-labelledby='public-access-dialog-title'
                aria-describedby='public-access-dialog-description'
            >
                <DialogTitle id='public-access-dialog-title'>
                    {pendingPublicAccessValue ? 'Enable Public Access?' : 'Disable Public Access?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='public-access-dialog-description'>
                        {pendingPublicAccessValue
                            ? 'Enable public access? Anyone with the link can view your dashboard (read-only).'
                            : 'Disable public access? Login will be required to view the dashboard.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelPublicAccessChange}>
                        Cancel
                    </Button>
                    <Button onClick={confirmPublicAccessChange} variant='contained' autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
