import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ResponsiveAppBar } from './ResponsiveAppBar';
import { SettingsSidebar } from '../sidebar/SettingsSidebar';
import { useAppContext } from '../../context/useAppContext';
import { useSettingsSidebar } from '../../context/SettingsSidebarContext';

export const WithNav = () => {
    const { isLoggedIn, isAdmin } = useAppContext();
    const { openSidebar } = useSettingsSidebar();
    const location = useLocation();
    const navigate = useNavigate();

    // Protect settings route and redirect to dashboard with sidebar open
    useEffect(() => {
        if (location.pathname === '/settings') {
            if (!isLoggedIn || !isAdmin) {
                navigate('/');
            } else {
                // Redirect to dashboard and open settings sidebar
                navigate('/');
                // Small delay to ensure navigation completes before opening sidebar
                setTimeout(() => {
                    openSidebar();
                }, 100);
            }
        }
    }, [location.pathname, isLoggedIn, isAdmin, navigate, openSidebar]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <ResponsiveAppBar>
                <Outlet />
            </ResponsiveAppBar>
            <SettingsSidebar />
        </Box>
    );
};
