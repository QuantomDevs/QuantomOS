import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaUpload, FaUser } from 'react-icons/fa6';

import { ToastManager } from '../toast/ToastManager';
import { useAppContext } from '../../context/useAppContext';
import { useTheme } from '../../context/ThemeContext';
import { PasswordChange } from './PasswordChange';

export const SecurityPanel: React.FC = () => {
    const { colorTheme } = useTheme();
    const { username: contextUsername, setUsername: setContextUsername } = useAppContext();

    const [username, setUsername] = useState(contextUsername || '');
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);

    // Fetch current user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/auth/user');
                const data = await response.json();
                setProfilePicture(data.profilePicture);
                if (data.username) {
                    setUsername(data.username);
                }
            } catch (err) {
                console.error('Error fetching user info:', err);
            }
        };
        fetchUserInfo();
    }, []);

    const handleUsernameUpdate = async () => {
        if (!username || username.length < 2) {
            ToastManager.error('Username must be at least 2 characters');
            return;
        }

        if (username === contextUsername) {
            ToastManager.info('Username unchanged');
            return;
        }

        setIsUpdatingUsername(true);

        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setContextUsername(username);
                ToastManager.success('Username updated successfully');
            } else {
                ToastManager.error(data.message || 'Failed to update username');
                setUsername(contextUsername || '');
            }
        } catch (error) {
            console.error('Error updating username:', error);
            ToastManager.error('Failed to update username');
            setUsername(contextUsername || '');
        } finally {
            setIsUpdatingUsername(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                ToastManager.error('Please select an image file');
                return;
            }

            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                ToastManager.error('Image must be smaller than 2MB');
                return;
            }

            setSelectedFile(file);
            handleProfilePictureUpload(file);
        }
    };

    const handleProfilePictureUpload = async (file: File) => {
        setIsUploadingPicture(true);

        try {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await fetch('/api/auth/profile-picture', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setProfilePicture(data.profilePicture);
                ToastManager.success('Profile picture uploaded successfully');
            } else {
                ToastManager.error(data.message || 'Failed to upload profile picture');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            ToastManager.error('Failed to upload profile picture');
        } finally {
            setIsUploadingPicture(false);
            setSelectedFile(null);
        }
    };

    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                Security & Profile
            </Typography>

            <Typography variant='body2' sx={{ mb: 4, opacity: 0.8 }}>
                Manage your account security and profile settings. All changes are saved immediately.
            </Typography>

            {/* Profile Section */}
            <Box sx={{ mb: 5 }}>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>
                    Profile
                </Typography>

                {/* Profile Picture */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant='body2' sx={{ mb: 2, fontWeight: 500 }}>
                        Profile Picture
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        {profilePicture ? (
                            <Avatar
                                src={profilePicture}
                                sx={{
                                    width: 96,
                                    height: 96,
                                    border: `2px solid ${colorTheme.borderColor}`
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: 96,
                                    height: 96,
                                    borderRadius: '50%',
                                    backgroundColor: colorTheme.secondaryBackground,
                                    border: `2px solid ${colorTheme.borderColor}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FaUser size={48} color={colorTheme.primaryText} />
                            </Box>
                        )}
                        <Button
                            component='label'
                            variant='outlined'
                            startIcon={<FaUpload />}
                            disabled={isUploadingPicture}
                        >
                            {isUploadingPicture ? 'Uploading...' : 'Upload New Picture'}
                            <input
                                type='file'
                                accept='image/*'
                                hidden
                                onChange={handleFileSelect}
                            />
                        </Button>
                    </Box>
                    <Typography variant='caption' sx={{ mt: 1, display: 'block', opacity: 0.7 }}>
                        Maximum file size: 2MB. Supported formats: JPG, PNG, WebP, GIF
                    </Typography>
                </Box>

                {/* Username */}
                <Box>
                    <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                        Username
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, maxWidth: '400px' }}>
                        <TextField
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            size='small'
                            helperText='Minimum 2 characters'
                        />
                        <Button
                            variant='contained'
                            onClick={handleUsernameUpdate}
                            disabled={isUpdatingUsername || username === contextUsername || username.length < 2}
                            sx={{ minWidth: '100px' }}
                        >
                            {isUpdatingUsername ? 'Updating...' : 'Update'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Password Section */}
            <Box>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 600 }}>
                    Password
                </Typography>
                <PasswordChange />
            </Box>
        </Box>
    );
};
