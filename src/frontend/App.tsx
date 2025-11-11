import './theme/App.css';
import { GlobalStyles } from '@mui/material';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { GlobalCustomScrollbar } from './components/GlobalCustomScrollbar';
import { WithNav } from './components/navbar/WithNav';
import { ScrollToTop } from './components/ScrollToTop';
import { BACKEND_URL } from './constants/constants';
import { useAppContext } from './context/useAppContext';
import { useMobilePointer } from './hooks/useMobilePointer';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SetupPage } from './pages/SetupPage';
import { SettingsPage } from './pages/SettingsPage';

export const App = () => {
    const {
        config,
        isFirstTimeSetup,
        setupComplete,
        setSetupComplete,
        pages,
        isLoggedIn
    } = useAppContext();

    const navigate = useNavigate();
    const isMobilePointer = useMobilePointer();
    const location = useLocation();

    // Check if setup is complete based on the config
    useEffect(() => {
        // If configuration has been loaded and isSetupComplete is true
        if (config && config.isSetupComplete) {
            setSetupComplete(true);
        }
    }, [config, setSetupComplete]);

    // Set the document title based on the custom title in config
    useEffect(() => {
        if (config?.title) {
            document.title = config.title;
        } else {
            document.title = 'Quantomos';
        }
    }, [config?.title]);

    // Authentication guard - redirect to login if not authenticated and public access disabled
    useEffect(() => {
        // Skip authentication check if we're still checking first time setup status
        if (isFirstTimeSetup === null) {
            return;
        }

        // Wait for config to load before making authentication decisions
        if (!config) {
            return;
        }

        // Allow access to login and setup pages without authentication
        const publicRoutes = ['/login', '/signup', '/setup'];
        const isPublicRoute = publicRoutes.includes(location.pathname);

        // If first time setup is needed, redirect to setup page
        if (isFirstTimeSetup && !setupComplete) {
            if (location.pathname !== '/setup') {
                navigate('/setup', { replace: true });
            }
            return;
        }

        // Check if public access is enabled
        const publicAccessEnabled = config.publicAccess === true;

        // If setup is complete but user is not logged in
        if (!isLoggedIn && !isPublicRoute) {
            // If public access is enabled, allow viewing dashboard in read-only mode
            if (publicAccessEnabled) {
                console.debug('Public access enabled, allowing read-only access');
                return;
            }

            // If public access is disabled, redirect to login
            console.debug('User not authenticated and public access disabled, redirecting to login page');
            navigate('/login', { replace: true });
        }

        // If user is logged in and on login/signup page, redirect to home
        if (isLoggedIn && isPublicRoute) {
            console.debug('User already authenticated, redirecting to home');
            navigate('/', { replace: true });
        }
    }, [isLoggedIn, isFirstTimeSetup, setupComplete, location.pathname, navigate, config]);

    // Global hotkey listener for Ctrl+1-9 / Cmd+1-9 to switch pages
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+Number (Windows/Linux) or Cmd+Number (Mac)
            // Skip 0 to allow default browser behavior (zoom reset)
            if ((event.ctrlKey || event.metaKey) && (event.key >= '1' && event.key <= '9')) {
                event.preventDefault();
                event.stopPropagation(); // Prevent other listeners from interfering

                const keyNumber = parseInt(event.key, 10);

                if (keyNumber === 9) {
                    // Cmd+9 goes to Settings page
                    navigate('/settings');
                } else if (keyNumber === 1) {
                    // Cmd+1 always goes to Home page
                    navigate('/');
                } else {
                    // Cmd+2-8 goes to custom pages (pages[0], pages[1], etc.)
                    const pageIndex = keyNumber - 2;

                    if (pages && pages.length > pageIndex) {
                        const targetPage = pages[pageIndex];
                        // Convert page name to URL-friendly format: lowercase, spaces to hyphens
                        const pageSlug = targetPage.name.toLowerCase().replace(/\s+/g, '-');
                        navigate(`/${pageSlug}`);
                    }
                }
            }
        };

        // Add event listener to document with capture to handle it early
        document.addEventListener('keydown', handleKeyDown, true);

        // Cleanup
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [pages, navigate]);

    const backgroundImage = config?.backgroundImage
        ? `url('${BACKEND_URL}/uploads/${config?.backgroundImage}')`
        : 'url(\'/space4k-min.webp\')';

    const globalStyles = (
        <GlobalStyles
            styles={{
                'html': {
                    minHeight: '100vh',
                    width: '100vw',
                    position: 'relative',
                },
                'body': {
                    background: 'transparent',
                    margin: 0,
                    padding: 0,
                    minHeight: '100vh',
                    '@media (max-width: 768px)': {
                        overflowX: 'hidden',
                        maxWidth: '100vw',
                    },
                    '&.MuiModal-open': {
                        paddingRight: '0px !important',
                        overflow: 'hidden'
                    }
                },
                // Fixed background element that won't resize
                '#background-container': {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#0a0a0f',
                    backgroundImage: backgroundImage,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'optimizeQuality',
                    zIndex: -1,
                    // Smooth transition when background changes
                    transition: 'background-image 0.3s ease-in-out',
                    // Ensure no resizing on mobile
                    '@media (max-width: 768px)': {
                        backgroundSize: 'cover !important',
                        backgroundPosition: 'center center !important',
                        // Force hardware acceleration for smoother performance
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                        // Ensure crisp rendering on mobile
                        imageRendering: 'optimizeQuality',
                    }
                },
            }}
        />
    );

    return (
        <>
            {globalStyles}
            <div id='background-container' />
            <ScrollToTop />
            {!isMobilePointer && <GlobalCustomScrollbar />}
            <Routes>
                <Route element={<WithNav />}>
                    <Route path='/' element={<DashboardPage />} />
                    <Route path='/setup' element={<SetupPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/settings' element={<SettingsPage />} />
                    <Route path='/:pageName' element={<DashboardPage />} />
                </Route>
            </Routes>
        </>
    );
};
