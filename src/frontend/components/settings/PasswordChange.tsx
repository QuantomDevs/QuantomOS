import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import { DashApi } from '../../api/dash-api';
import { ToastManager } from '../toast/ToastManager';

export const PasswordChange: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            ToastManager.error('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            ToastManager.error('New password and confirmation do not match');
            return;
        }

        if (newPassword.length < 8) {
            ToastManager.error('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                ToastManager.success('Password changed successfully');
                // Clear form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                ToastManager.error(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            ToastManager.error('Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant='body2' sx={{ mb: 3, opacity: 0.8 }}>
                Change your account password. Your password must be at least 8 characters long.
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: '400px'
            }}>
                <TextField
                    label='Current Password'
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    size='small'
                />
                <TextField
                    label='New Password'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    size='small'
                    helperText='Minimum 8 characters'
                />
                <TextField
                    label='Confirm New Password'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    size='small'
                />
                <Button
                    variant='contained'
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    sx={{ mt: 1 }}
                >
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                </Button>
            </Box>
        </Box>
    );
};
