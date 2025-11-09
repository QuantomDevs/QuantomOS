import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ResponsiveAppBar } from './ResponsiveAppBar';
import { useAppContext } from '../../context/useAppContext';
import { useSettingsModal } from '../../context/SettingsModalContext';

export const WithNav = () => {
    const { isLoggedIn, isAdmin } = useAppContext();
    const { openModal } = useSettingsModal();
    const location = useLocation();
    const navigate = useNavigate();

    // Protect settings route and redirect to dashboard with modal open
    useEffect(() => {
        if (location.pathname === '/settings') {
            if (!isLoggedIn || !isAdmin) {
                navigate('/');
            } else {
                // Redirect to dashboard and open settings modal
                navigate('/');
                // Small delay to ensure navigation completes before opening modal
                setTimeout(() => {
                    openModal();
                }, 100);
            }
        }
    }, [location.pathname, isLoggedIn, isAdmin, navigate, openModal]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <ResponsiveAppBar>
                <Outlet />
            </ResponsiveAppBar>
        </Box>
    );
};
