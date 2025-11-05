import { Add } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Badge, Button, IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { DashApi } from '../../api/dash-api';
import { useAppContext } from '../../context/useAppContext';
import { useSettingsSidebar } from '../../context/SettingsSidebarContext';
import { useInternetStatus } from '../../hooks/useInternetStatus';
import { COLORS, styles } from '../../theme/styles';
import { theme } from '../../theme/theme';
import { DashboardItem, ITEM_TYPE } from '../../types';
import { getAppVersion } from '../../utils/version';
import { AddEditForm } from '../forms/AddEditForm/AddEditForm';
import { Logo } from '../Logo';
import { CenteredModal } from '../modals/CenteredModal';
import { UpdateModal } from '../modals/UpdateModal';
import { VersionModal } from '../modals/VersionModal';
import { GlobalSearch } from '../search/GlobalSearch';
import { ToastManager } from '../toast/ToastManager';
import { UserDropdownMenu } from '../header/UserDropdownMenu';

type Props = {
    children: React.ReactNode;
}

export const ResponsiveAppBar = ({ children }: Props) => {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditPageModal, setOpenEditPageModal] = useState(false);
    const [selectedPageForEdit, setSelectedPageForEdit] = useState<any>(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openVersionModal, setOpenVersionModal] = useState(false);
    const [originalLayoutSnapshot, setOriginalLayoutSnapshot] = useState<DashboardItem[] | null>(null);
    const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);

    const { internetStatus } = useInternetStatus();
    const { openSidebar } = useSettingsSidebar();

    const {
        dashboardLayout,
        saveLayout,
        refreshDashboard,
        editMode,
        setEditMode,
        config,
        updateConfig,
        isLoggedIn,
        username,
        setIsLoggedIn,
        setUsername,
        isAdmin,
        setIsAdmin,
        updateAvailable,
        latestVersion,
        recentlyUpdated,
        handleVersionViewed,
        pages,
        currentPageId,
        switchToPage,
        deletePage
    } = useAppContext();

    const showInternetIndicator = config?.showInternetIndicator !== false;

    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const handleClose = () => setOpenAddModal(false);
    const handleCloseEditPage = () => {
        setOpenEditPageModal(false);
        setSelectedPageForEdit(null);
    };
    const handleOpenEditPage = (page: any) => {
        setSelectedPageForEdit(page);
        setOpenEditPageModal(true);
    };
    const handleCloseUpdateModal = () => setOpenUpdateModal(false);
    const handleCloseVersionModal = async () => {
        setOpenVersionModal(false);
        if (isAdmin && recentlyUpdated) {
            await handleVersionViewed();
        }
    };

    const handleSave = async () => {
        setEditMode(false);
        setOpenAddModal(false);

        // Only save if there were actual changes made
        if (originalLayoutSnapshot) {
            const hasChanges = JSON.stringify(originalLayoutSnapshot) !== JSON.stringify(dashboardLayout);

            if (hasChanges) {
                console.log('Layout changes detected, saving...');
                saveLayout(dashboardLayout);
            } else {
                console.log('No layout changes detected, skipping save');
            }

            // Clear the snapshot
            setOriginalLayoutSnapshot(null);
        } else {
            // Fallback - save if we don't have a snapshot (shouldn't happen)
            console.log('No original layout snapshot found, saving as fallback');
            saveLayout(dashboardLayout);
        }
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setUserMenuAnchor(null);
    };

    const handleMenuClose = () => {
        // Menu close logic if needed
    };

    const handleLogin = () => {
        handleMenuClose();
        navigate('/login', { state: { from: location.pathname } });
    };

    const handleLogout = async () => {
        try {
            // Turn off edit mode if it's active
            if (editMode) {
                setEditMode(false);
            }

            await DashApi.logout();

            // Reset all auth-related state variables in the correct order
            setIsAdmin(false);
            setUsername(null);
            setIsLoggedIn(false);

            localStorage.removeItem('username');
            handleMenuClose();

            // Force refresh dashboard
            refreshDashboard();

            // Navigate to login page
            navigate('/login');
            ToastManager.success('Logged out');
        } catch (error) {
            console.error('Logout error:', error);
            ToastManager.error('Logout error');
        }
    };

    const handleProfile = () => {
        handleMenuClose();
        // Navigate to user profile page if you have one
        // navigate('/profile');
    };

    const handleOpenUpdateModal = () => {
        setOpenUpdateModal(true);
    };

    const handleOpenVersionModal = () => {
        setOpenVersionModal(true);
    };

    const handleSetEditMode = (value: boolean) => {
        setEditMode(value);

        if (window.location.pathname.includes('/settings')) {
            navigate('/');
        }

        // When entering edit mode, capture the current layout as a snapshot
        if (value) {
            setOriginalLayoutSnapshot(JSON.parse(JSON.stringify(dashboardLayout)));
        } else {
            // When exiting edit mode, clear the snapshot
            setOriginalLayoutSnapshot(null);
        }
    };

    const handlePageUpdate = async (updatedItem: any) => {
        if (!selectedPageForEdit || !config) return;

        try {
            // Get the new page name and adminOnly from the form data
            const newPageName = updatedItem.label;
            const newAdminOnly = updatedItem.adminOnly;

            // Update the page in the config
            const updatedPages = pages.map(page =>
                page.id === selectedPageForEdit.id
                    ? { ...page, name: newPageName, adminOnly: newAdminOnly }
                    : page
            );

            // Update the config with the new pages array
            await updateConfig({ pages: updatedPages });

            // Refresh the dashboard to reflect changes
            await refreshDashboard();

            handleCloseEditPage();
            ToastManager.success('Page updated successfully');
        } catch (error) {
            console.error('Error updating page:', error);
            ToastManager.error('Failed to update page');
        }
    };

    // Helper function to convert page name to URL slug
    const pageNameToSlug = (pageName: string): string => {
        return pageName.toLowerCase().replace(/\s+/g, '-');
    };

    return (
        <>
            <AppBar position='fixed' sx={{
                backgroundColor: 'var(--color-header-background-transparent)',
                backdropFilter: 'blur(var(--backdrop-blur))',
                width: '100vw', // Use full viewport width to cover scrollbar area
                maxWidth: 'none', // Override any max-width constraints
                left: 0, // Ensure it starts from the left edge
                right: 0, // Ensure it extends to the right edge
                overflowX: 'hidden',
                // Always use fixed positioning to ensure AppBar stays visible
                position: 'fixed',
                top: 0,
                zIndex: theme.zIndex.appBar
            }}>
                <Container maxWidth={false} sx={{
                    margin: 0,
                    padding: { xs: '0 16px', sm: '0 16px' }, // Added padding on mobile
                    width: '100%',
                    minWidth: '100%',
                    maxWidth: 'none' // Override any max-width constraints
                }}>
                    <Toolbar disableGutters sx={{
                        justifyContent: 'space-between',
                        width: '100%',
                        minHeight: { xs: 56, sm: 64 }, // Standard AppBar heights
                        px: 0, // Remove default padding since Container handles it
                        // Ensure proper spacing on mobile
                        alignItems: 'center'
                    }}>
                        <Link to='/'>
                            {/* Desktop */}
                            <Box sx={{
                                width: { xs: 'auto', md: '300px', lg: '350px' },
                                flex: { xs: '1', md: 'none' }, // On mobile, allow to grow and push right content to edge
                                ...styles.center,
                                overflow: 'hidden',
                                minWidth: 0,
                                justifyContent: { xs: 'flex-start', md: 'center' } // Left align on mobile, center on desktop
                            }}>
                                <Logo sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}/>
                                <Typography
                                    variant='h5'
                                    noWrap
                                    sx={{
                                        flexGrow: 1,
                                        display: { xs: 'none', md: 'block' },
                                        fontFamily: 'Earth Orbiter',
                                        letterSpacing: '.1rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        minWidth: '120px',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                    key={`app-title-${config?.title}-${nanoid()}`}
                                >
                                    {config?.title || 'QuantomOS'}
                                </Typography>
                                {/* Mobile */}
                                <Logo sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                                <Typography
                                    variant='h5'
                                    sx={{
                                        mr: 0, // Remove right margin to allow more space
                                        flexGrow: 0,
                                        flexShrink: 1,
                                        display: { xs: 'block', md: 'none' },
                                        fontFamily: 'Earth Orbiter',
                                        letterSpacing: '.1rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: 'calc(100vw - 180px)', // Reduced further to prevent icon shifting
                                        minWidth: 0
                                    }}
                                    key={`app-title-mobile-${config?.title}-${nanoid()}`}
                                >
                                    {config?.title || 'QuantomOS'}
                                </Typography>
                            </Box>
                        </Link>
                        { !currentPath.includes('/settings') && !currentPath.includes('/login') && !currentPath.includes('/signup') && config?.search &&
                            <Box sx={{ width: '100%', display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', flexGrow: 1 }}>
                                <GlobalSearch />
                            </Box>
                        }

                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{
                                display: 'flex',
                                width: { xs: 'auto', md: '300px', lg: '350px' },
                                flexGrow: { xs: 0, md: 1 },
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                // On mobile, remove any width constraints to allow icons to go to the edge
                                minWidth: { xs: 'auto', md: 'auto' }
                            }}>
                                {editMode && (
                                    <>
                                        {/* Done button for sm screens and higher */}
                                        <Button
                                            variant='contained'
                                            onClick={handleSave}
                                            sx={{
                                                display: { xs: 'none', sm: 'flex' },
                                                backgroundColor: COLORS.LIGHT_GRAY_TRANSPARENT,
                                                color: 'black',
                                                borderRadius: '999px',
                                                height: '2rem',
                                                minWidth: '4.5rem',
                                                mr: 1,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                                                }
                                            }}
                                        >
                                            Done
                                        </Button>
                                        {/* Add Item button */}
                                        <Tooltip title='Add Item' placement='bottom' arrow>
                                            <IconButton onClick={() => setOpenAddModal(true)}>
                                                <Add sx={{ color: 'white', fontSize: '2rem' }}/>
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                                {!editMode && isLoggedIn && isAdmin && !currentPath.includes('/settings') && (
                                    <>
                                        {/* Edit Dashboard Button */}
                                        <Tooltip title='Edit Dashboard' placement='bottom' arrow>
                                            <IconButton onClick={() => handleSetEditMode(true)}>
                                                <FaEdit style={{ color: 'white', fontSize: '1.5rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {/* Settings Button */}
                                        <Tooltip title='Settings' placement='bottom' arrow>
                                            <IconButton onClick={openSidebar}>
                                                <FaGear style={{ color: 'white', fontSize: '1.5rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}

                                {/* Hamburger Menu Button */}
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{
                                        ml: { xs: 0, sm: 1 }, // Consistent left margin
                                        mr: { xs: 0, sm: 2 }, // No right margin on mobile, normal on desktop
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '50%'
                                    }}
                                >
                                    {updateAvailable ? (
                                        // Only update available badge (red) - given priority
                                        <Badge
                                            color='error'
                                            variant='dot'
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    top: 0,
                                                    right: -5
                                                }
                                            }}
                                        >
                                            <MenuIcon sx={{ color: 'white', fontSize: '2rem' }}/>
                                        </Badge>
                                    ) : recentlyUpdated ? (
                                        // Only recently updated badge (blue)
                                        <Badge
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    backgroundColor: '#2196f3', // Blue color
                                                    top: 0,
                                                    right: -5
                                                }
                                            }}
                                            variant='dot'
                                        >
                                            <MenuIcon sx={{ color: 'white', fontSize: '2rem' }}/>
                                        </Badge>
                                    ) : (
                                        // No badges
                                        <MenuIcon sx={{ color: 'white', fontSize: '2rem' }}/>
                                    )}
                                </IconButton>
                            </Box>

                            {/* User Dropdown Menu */}
                            <UserDropdownMenu
                                anchorEl={userMenuAnchor}
                                isOpen={Boolean(userMenuAnchor)}
                                onClose={handleCloseUserMenu}
                                internetStatus={internetStatus}
                                username={username}
                                isAdmin={isAdmin}
                                onEditDashboard={() => handleSetEditMode(true)}
                                onOpenSettings={openSidebar}
                                onLogout={handleLogout}
                            />
                        </Box>
                    </Toolbar>
                </Container>
                <CenteredModal open={openAddModal} handleClose={handleClose} title='Add Item'>
                    <AddEditForm handleClose={handleClose}/>
                </CenteredModal>
                <CenteredModal open={openEditPageModal} handleClose={handleCloseEditPage} title='Edit Page'>
                    <AddEditForm
                        handleClose={handleCloseEditPage}
                        existingItem={selectedPageForEdit ? {
                            id: selectedPageForEdit.id,
                            type: ITEM_TYPE.PAGE,
                            label: selectedPageForEdit.name,
                            url: '',
                            icon: undefined,
                            config: {},
                            adminOnly: selectedPageForEdit.adminOnly || false
                        } : null}
                        onSubmit={handlePageUpdate}
                    />
                </CenteredModal>
                {/* Update Modal - Replaced with component */}
                <UpdateModal
                    open={openUpdateModal}
                    handleClose={handleCloseUpdateModal}
                    latestVersion={latestVersion}
                    isAdmin={isAdmin}
                />
                {/* Version Modal */}
                <VersionModal
                    open={openVersionModal}
                    handleClose={handleCloseVersionModal}
                />
            </AppBar>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '64px'
            }}
            >
                <Box component='main' sx={{
                    flexGrow: 1,
                    mt: { xs:-1, sm: 0 },
                    paddingTop: { xs: '3.5rem', sm: '1rem' },
                }}>
                </Box>
                {
                    editMode
                        ? <Box position='absolute' sx={{
                            // For mobile: position relative to navbar since it's always fixed now
                            top: '66px', // Just below the fixed navbar
                            zIndex: 99,
                            display: { xs: 'flex', sm: 'none' },
                            justifyContent: 'flex-end',
                            width: '100%',
                            px: 3,
                            gap: 2
                        }}>
                            <Button variant='contained' onClick={handleSave}  sx={{ backgroundColor: COLORS.LIGHT_GRAY_TRANSPARENT, color: 'black', borderRadius: '999px', height: '1.7rem', width: '4.5rem' }}>Done</Button>
                        </Box>
                        : null
                }
                {!currentPath.includes('/settings') && !currentPath.includes('/login') && !currentPath.includes('/signup') && config?.search && !editMode && (
                    <Box position='absolute' sx={{
                        top: '49px',
                        zIndex: 99,
                        display: { xs: 'flex', sm: 'none' },
                        justifyContent: 'center',
                        width: '100%',
                    }} mt={.5}>
                        <GlobalSearch />
                    </Box>
                )}

                {children}
            </Box>
        </>
    );
};
