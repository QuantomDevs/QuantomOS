import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';

import { DashApi } from '../../api/dash-api';
import { ToastManager } from '../../components/toast/ToastManager';
import { useAppContext } from '../../context/useAppContext';
import { useTheme } from '../../context/ThemeContext';

export const LoginForm = () => {
    const { colorTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsLoggedIn, setUsername, setIsAdmin, refreshDashboard } = useAppContext();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<{ username: string; profilePicture: string | null } | null>(null);

    // Fetch user info to display username and profile picture
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/auth/user');
                const data = await response.json();
                setUserInfo(data);
            } catch (err) {
                console.error('Error fetching user info:', err);
            }
        };
        fetchUserInfo();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!password) {
            setError('Password is required');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update auth state in context
                setUsername(data.user.username);
                setIsAdmin(true); // Single user is always admin
                setIsLoggedIn(true);

                // Refresh dashboard to load all data
                await refreshDashboard();

                // Show success toast and navigate
                ToastManager.success('Login successful!');

                const from = (location.state as any)?.from || '/';
                navigate(from, { replace: true });
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            padding: 4
        }}>
            {/* Title */}
            <Typography variant='h4' sx={{ fontWeight: 600, textAlign: 'center' }}>
                Log In
            </Typography>

            {/* Profile Picture */}
            {userInfo?.profilePicture ? (
                <Box
                    component='img'
                    src={userInfo.profilePicture}
                    alt='Profile'
                    sx={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        objectFit: 'cover',
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

            {/* Username Display */}
            <Typography variant='body1' sx={{ fontWeight: 500, textAlign: 'center' }}>
                User: <strong>{userInfo?.username || 'User'}</strong>
            </Typography>

            {/* Login Form */}
            <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Password Input */}
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label='Password'
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(null); // Clear error when user starts typing
                        }}
                        error={!!error}
                        helperText={error || ''}
                        autoFocus
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge='end'
                                        aria-label='toggle password visibility'
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Login Button */}
                    <Button
                        type='submit'
                        variant='contained'
                        fullWidth
                        disabled={isLoading}
                        sx={{
                            mt: 1,
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: '1rem'
                        }}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
