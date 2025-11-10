import { Box, Button, Paper, TextField, Typography, Avatar } from '@mui/material';
import { useState } from 'react';
import { FaUpload, FaUser } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { ToastManager } from '../components/toast/ToastManager';
import { useAppContext } from '../context/useAppContext';
import { useTheme } from '../context/ThemeContext';
import { styles } from '../theme/styles';

export const SetupPage = () => {
    const { colorTheme } = useTheme();
    const navigate = useNavigate();
    const { setIsLoggedIn, setUsername: setContextUsername, setIsAdmin, setSetupComplete, refreshDashboard } = useAppContext();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors({ ...errors, profilePicture: 'Please select an image file' });
                return;
            }

            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ ...errors, profilePicture: 'Image must be smaller than 2MB' });
                return;
            }

            setProfilePicture(file);
            setErrors({ ...errors, profilePicture: '' });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!username || username.length < 2) {
            newErrors.username = 'Username must be at least 2 characters';
        }

        if (!password || password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            const response = await fetch('/api/auth/setup', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update context
                setContextUsername(username);
                setIsAdmin(true);
                setIsLoggedIn(true);
                setSetupComplete(true);

                // Refresh dashboard
                await refreshDashboard();

                // Show success and navigate
                ToastManager.success('Setup completed successfully!');
                navigate('/', { replace: true });
            } else {
                ToastManager.error(data.message || 'Setup failed');
            }
        } catch (err: any) {
            console.error('Setup error:', err);
            ToastManager.error(err.message || 'Setup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box width='100%' sx={styles.center}>
            <Box
                sx={{
                    ...styles.vcenter,
                    width: { xs: '90%', sm: '80%', md: '500px' },
                    borderRadius: 2
                }}
                component={Paper}
            >
                <Box sx={{ width: '100%', padding: 4 }}>
                    {/* Title */}
                    <Typography variant='h4' sx={{ fontWeight: 600, textAlign: 'center', mb: 2 }}>
                        Welcome to QuantomOS
                    </Typography>
                    <Typography variant='body2' sx={{ textAlign: 'center', mb: 4, opacity: 0.8 }}>
                        Create your admin account to get started
                    </Typography>

                    {/* Profile Picture Upload */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: 120,
                                height: 120,
                                mb: 2
                            }}
                        >
                            {profilePicturePreview ? (
                                <Avatar
                                    src={profilePicturePreview}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        border: `2px solid ${colorTheme.borderColor}`
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        backgroundColor: colorTheme.secondaryBackground,
                                        border: `2px solid ${colorTheme.borderColor}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <FaUser size={60} color={colorTheme.primaryText} />
                                </Box>
                            )}
                        </Box>
                        <Button
                            component='label'
                            variant='outlined'
                            startIcon={<FaUpload />}
                            size='small'
                        >
                            Upload Profile Picture (Optional)
                            <input
                                type='file'
                                accept='image/*'
                                hidden
                                onChange={handleProfilePictureChange}
                            />
                        </Button>
                        {errors.profilePicture && (
                            <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                                {errors.profilePicture}
                            </Typography>
                        )}
                    </Box>

                    {/* Setup Form */}
                    <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Username */}
                            <TextField
                                fullWidth
                                label='Username'
                                placeholder='Enter your username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={!!errors.username}
                                helperText={errors.username || ''}
                                autoFocus
                            />

                            {/* Password */}
                            <TextField
                                fullWidth
                                type='password'
                                label='Password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                helperText={errors.password || 'Minimum 8 characters'}
                            />

                            {/* Confirm Password */}
                            <TextField
                                fullWidth
                                type='password'
                                label='Confirm Password'
                                placeholder='Confirm your password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword || ''}
                            />

                            {/* Submit Button */}
                            <Button
                                type='submit'
                                variant='contained'
                                fullWidth
                                disabled={isLoading}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                }}
                            >
                                {isLoading ? 'Creating Account...' : 'Complete Setup'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
