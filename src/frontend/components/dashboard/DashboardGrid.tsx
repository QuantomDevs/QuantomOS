import { Box, useMediaQuery } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Responsive as ResponsiveGridLayout, Layout, Layouts } from 'react-grid-layout';
import shortid from 'shortid';

import { SortableSabnzbd } from './sortable-items/widgets/SortableSabnzbd';
import { SortableNzbget } from './sortable-items/widgets/SortableNzbget';
import { useAppContext } from '../../context/useAppContext';
import { DashboardItem, DOWNLOAD_CLIENT_TYPE, GridLayoutItem, ITEM_TYPE, TORRENT_CLIENT_TYPE } from '../../types';
import { AddEditForm } from '../forms/AddEditForm/AddEditForm';
import { CenteredModal } from '../modals/CenteredModal';
import { ConfirmationOptions, PopupManager } from '../modals/PopupManager';
import { ToastManager } from '../toast/ToastManager';
import { BlankAppShortcut } from './base-items/apps/BlankAppShortcut';
import { BlankWidget } from './base-items/widgets/BlankWidget';
import { SortableAppShortcut } from './sortable-items/apps/SortableAppShortcut';
import { SortableAdGuard } from './sortable-items/widgets/SortableAdGuard';
import { SortableDateTimeWidget } from './sortable-items/widgets/SortableDateTime';
import { SortableDeluge } from './sortable-items/widgets/SortableDeluge';
import { SortableDiskMonitor } from './sortable-items/widgets/SortableDiskMonitor';
import { SortableDualWidget } from './sortable-items/widgets/SortableDualWidget';
import { SortableGroupWidget } from './sortable-items/widgets/SortableGroupWidget';
import { SortableMediaRequestManager } from './sortable-items/widgets/SortableMediaRequestManager';
import { SortableMediaServer } from './sortable-items/widgets/SortableMediaServer';
import { SortableNotes } from './sortable-items/widgets/SortableNotes';
import { SortablePihole } from './sortable-items/widgets/SortablePihole';
import { SortableQBittorrent } from './sortable-items/widgets/SortableQBittorrent';
import { SortableRadarr } from './sortable-items/widgets/SortableRadarr';
import { SortableSonarr } from './sortable-items/widgets/SortableSonarr';
import { SortableSystemMonitorWidget } from './sortable-items/widgets/SortableSystemMonitor';
import { SortableTransmission } from './sortable-items/widgets/SortableTransmission';
import { SortableWeatherWidget } from './sortable-items/widgets/SortableWeather';
import { SortableCustomExtension } from './sortable-items/widgets/SortableCustomExtension';
import { SortableIframeWidget } from './sortable-items/widgets/SortableIframe';
import { SortableVideoStreamWidget } from './sortable-items/widgets/SortableVideoStream';
import { SortableCalendarWidget } from './sortable-items/widgets/SortableCalendar';
import { SortableBookmarksWidget } from './sortable-items/widgets/SortableBookmarks';
import { theme } from '../../theme/theme';
import { GRID_CONFIG } from '../../config/gridConfig';
import { getDefaultHeight, getDefaultWidth, getWidgetConstraints } from '../../utils/gridPositioning';
import { useTheme as useColorTheme } from '../../context/ThemeContext';
import { GridGuidelines } from './GridGuidelines';
import { LazyLoadWidget } from './LazyLoadWidget';

export const DashboardGrid: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const { dashboardLayout, setDashboardLayout, refreshDashboard, editMode, isAdmin, isLoggedIn, saveLayout } = useAppContext();
    const { colorTheme } = useColorTheme();
    const isMed = useMediaQuery(theme.breakpoints.down('md'));
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(1200);
    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');

    // Filter out admin-only items if user is not an admin
    const items = useMemo(() => {
        if (isAdmin) {
            return dashboardLayout;
        } else {
            return dashboardLayout.filter(item => item.adminOnly !== true);
        }
    }, [dashboardLayout, isAdmin, isLoggedIn]);

    const prevAuthStatus = useRef({ isLoggedIn, isAdmin });

    useEffect(() => {
        if (prevAuthStatus.current.isLoggedIn !== isLoggedIn ||
            prevAuthStatus.current.isAdmin !== isAdmin) {
            refreshDashboard();
            prevAuthStatus.current = { isLoggedIn, isAdmin };
        }
    }, [isLoggedIn, isAdmin, refreshDashboard]);

    // Container width management for responsive grid
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Calculate square row height based on column width
    const calculateSquareRowHeight = useMemo(() => {
        const cols = GRID_CONFIG.cols[currentBreakpoint as keyof typeof GRID_CONFIG.cols] || GRID_CONFIG.cols.lg;
        const margin = colorTheme.gridMargin;
        const containerPadding = GRID_CONFIG.containerPadding[0];

        // Calculate inner width (container width minus padding)
        const innerWidth = containerWidth - (containerPadding * 2);

        // Calculate column width: (innerWidth - margin * (cols - 1)) / cols
        const columnWidth = (innerWidth - (margin * (cols - 1))) / cols;

        // Return the column width as the row height to create square tiles
        return Math.floor(columnWidth);
    }, [containerWidth, currentBreakpoint, colorTheme.gridMargin]);

    // Convert DashboardItems to GridLayout format
    const convertToGridLayout = useCallback((dashboardItems: DashboardItem[]): GridLayoutItem[] => {
        return dashboardItems.map(item => {
            const constraints = getWidgetConstraints(item.type);

            return {
                i: item.id,
                x: item.gridPosition?.x ?? 0,
                y: item.gridPosition?.y ?? 0,
                w: item.gridPosition?.w ?? getDefaultWidth(item.type),
                h: item.gridPosition?.h ?? getDefaultHeight(item.type),
                minW: item.gridPosition?.minW ?? constraints.minW,
                maxW: item.gridPosition?.maxW ?? constraints.maxW,
                minH: item.gridPosition?.minH ?? constraints.minH,
                maxH: item.gridPosition?.maxH ?? constraints.maxH,
                static: item.gridPosition?.static ?? false
            };
        });
    }, []);

    // Handle breakpoint changes
    const handleBreakpointChange = useCallback((breakpoint: string) => {
        setCurrentBreakpoint(breakpoint);
    }, []);

    // Handle layout changes for responsive grid
    const handleLayoutChange = useCallback((currentLayout: Layout[], allLayouts: Layouts) => {
        if (!editMode) return;

        const updatedItems = dashboardLayout.map(item => {
            const layoutItem = currentLayout.find(l => l.i === item.id);
            if (layoutItem) {
                return {
                    ...item,
                    gridPosition: {
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h,
                        static: layoutItem.static
                    }
                };
            }
            return item;
        });

        setDashboardLayout(updatedItems);
    }, [editMode, dashboardLayout, setDashboardLayout]);

    // Handle drag stop to save layout
    const handleDragStop = useCallback((layout: Layout[]) => {
        const updatedItems = dashboardLayout.map(item => {
            const layoutItem = layout.find(l => l.i === item.id);
            if (layoutItem) {
                return {
                    ...item,
                    gridPosition: {
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h,
                        static: layoutItem.static
                    }
                };
            }
            return item;
        });

        setDashboardLayout(updatedItems);
        saveLayout(updatedItems);
    }, [dashboardLayout, setDashboardLayout, saveLayout]);

    // Handle resize stop to save layout
    const handleResizeStop = useCallback((layout: Layout[]) => {
        const updatedItems = dashboardLayout.map(item => {
            const layoutItem = layout.find(l => l.i === item.id);
            if (layoutItem) {
                return {
                    ...item,
                    gridPosition: {
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h,
                        static: layoutItem.static
                    }
                };
            }
            return item;
        });

        setDashboardLayout(updatedItems);
        saveLayout(updatedItems);
    }, [dashboardLayout, setDashboardLayout, saveLayout]);

    const handleDelete = (id: string) => {
        const itemToDelete = dashboardLayout.find(item => item.id === id);
        const itemName = itemToDelete?.label || itemToDelete?.config?.displayName || 'Item';

        const options: ConfirmationOptions = {
            title: 'Delete Item?',
            confirmAction: async () => {
                const updatedLayout = dashboardLayout.filter((item) => item.id !== id);
                setDashboardLayout(updatedLayout);
                saveLayout(updatedLayout);
                ToastManager.success(`${itemName} deleted successfully`);
            }
        };

        PopupManager.deleteConfirmation(options);
    };

    const handleEdit = (item: DashboardItem) => {
        setSelectedItem(item);
        setOpenEditModal(true);
    };

    const handleDuplicate = async (item: DashboardItem) => {
        const duplicatedItem: DashboardItem = JSON.parse(JSON.stringify(item));
        const newItemId = shortid.generate();
        duplicatedItem.id = newItemId;

        const preserveSensitiveDataFlags = (config: any) => {
            if (!config) return config;
            const preservedConfig = { ...config };
            if (config._hasApiToken) preservedConfig._hasApiToken = true;
            if (config._hasPassword) preservedConfig._hasPassword = true;
            if (config._hasUsername) preservedConfig._hasUsername = true;
            return preservedConfig;
        };

        if (duplicatedItem.config) {
            duplicatedItem.config._duplicatedFrom = item.id;
            duplicatedItem.config = preserveSensitiveDataFlags(duplicatedItem.config);

            if (item.type === ITEM_TYPE.DUAL_WIDGET && duplicatedItem.config) {
                if (duplicatedItem.config.topWidget?.config) {
                    duplicatedItem.config.topWidget.config = preserveSensitiveDataFlags(duplicatedItem.config.topWidget.config);
                }
                if (duplicatedItem.config.bottomWidget?.config) {
                    duplicatedItem.config.bottomWidget.config = preserveSensitiveDataFlags(duplicatedItem.config.bottomWidget.config);
                }
            }

            if (item.type === ITEM_TYPE.GROUP_WIDGET && duplicatedItem.config?.items && item.config?.items) {
                duplicatedItem.config.items = item.config.items.map((groupItem: any) => ({
                    ...groupItem,
                    id: shortid.generate()
                }));
            }
        }

        // Position the duplicated item next to the original
        if (item.gridPosition) {
            duplicatedItem.gridPosition = {
                x: item.gridPosition.x + item.gridPosition.w,
                y: item.gridPosition.y,
                w: item.gridPosition.w,
                h: item.gridPosition.h
            };

            // If it would go off the grid, place it below instead
            if (duplicatedItem.gridPosition.x + duplicatedItem.gridPosition.w > GRID_CONFIG.cols.lg) {
                duplicatedItem.gridPosition.x = 0;
                duplicatedItem.gridPosition.y = item.gridPosition.y + item.gridPosition.h;
            }
        }

        const updatedLayout = [...dashboardLayout, duplicatedItem];
        setDashboardLayout(updatedLayout);
        await saveLayout(updatedLayout);
        await refreshDashboard();
        await new Promise(resolve => setTimeout(resolve, 500));
    };

    const createDateTimeConfig = (config: any) => {
        return {
            location: config?.location || null,
            timezone: config?.timezone || undefined
        };
    };

    const renderDownloadClient = (item: any, isOverlay = false) => {
        const clientType = item.config?.clientType;
        const key = item.id;
        const commonProps = {
            id: item.id,
            editMode,
            config: item.config,
            onDelete: () => handleDelete(item.id),
            onEdit: () => handleEdit(item),
            onDuplicate: () => handleDuplicate(item),
            ...(isOverlay && { isOverlay })
        };

        if (item.type === ITEM_TYPE.DOWNLOAD_CLIENT) {
            if (clientType === DOWNLOAD_CLIENT_TYPE.DELUGE) {
                return <SortableDeluge key={key} {...commonProps} />;
            }
            if (clientType === DOWNLOAD_CLIENT_TYPE.TRANSMISSION) {
                return <SortableTransmission key={key} {...commonProps} />;
            }
            if (clientType === DOWNLOAD_CLIENT_TYPE.SABNZBD) {
                return <SortableSabnzbd key={key} {...commonProps} />;
            }
            if (clientType === DOWNLOAD_CLIENT_TYPE.NZBGET) {
                return <SortableNzbget key={key} {...commonProps} />;
            }
            return <SortableQBittorrent key={key} {...commonProps} />;
        }

        if (item.type === ITEM_TYPE.TORRENT_CLIENT) {
            if (clientType === TORRENT_CLIENT_TYPE.DELUGE) {
                return <SortableDeluge key={key} {...commonProps} />;
            }
            if (clientType === TORRENT_CLIENT_TYPE.TRANSMISSION) {
                return <SortableTransmission key={key} {...commonProps} />;
            }
            if (clientType === TORRENT_CLIENT_TYPE.QBITTORRENT) {
                return <SortableQBittorrent key={key} {...commonProps} />;
            }
            return <SortableQBittorrent key={key} {...commonProps} />;
        }

        return <SortableQBittorrent key={key} {...commonProps} />;
    };

    const renderItem = (item: any) => {
        switch (item.type) {
        case ITEM_TYPE.WEATHER_WIDGET:
            return <SortableWeatherWidget key={item.id} id={item.id} editMode={editMode} config={item.config} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)}/>;
        case ITEM_TYPE.DATE_TIME_WIDGET:
            return <SortableDateTimeWidget key={item.id} id={item.id} editMode={editMode} config={createDateTimeConfig(item.config)} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)}/>;
        case ITEM_TYPE.SYSTEM_MONITOR_WIDGET:
            return <SortableSystemMonitorWidget key={item.id} id={item.id} editMode={editMode} config={item.config} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)}/>;
        case ITEM_TYPE.DISK_MONITOR_WIDGET:
            return <SortableDiskMonitor key={item.id} id={item.id} editMode={editMode} config={item.config} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)} />;
        case ITEM_TYPE.PIHOLE_WIDGET:
            return <SortablePihole key={item.id} id={item.id} editMode={editMode} config={item.config} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)}/>;
        case ITEM_TYPE.ADGUARD_WIDGET:
            return <SortableAdGuard key={item.id} id={item.id} editMode={editMode} config={item.config} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)}/>;
        case ITEM_TYPE.DOWNLOAD_CLIENT:
            return renderDownloadClient(item);
        case ITEM_TYPE.TORRENT_CLIENT:
            return renderDownloadClient(item);
        case ITEM_TYPE.DUAL_WIDGET: {
            const dualWidgetConfig = {
                topWidget: item.config?.topWidget || undefined,
                bottomWidget: item.config?.bottomWidget || undefined
            };
            return <SortableDualWidget
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={dualWidgetConfig}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        }
        case ITEM_TYPE.GROUP_WIDGET:
            return <SortableGroupWidget
                key={item.id}
                id={item.id}
                editMode={editMode}
                label={item.label}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.MEDIA_SERVER_WIDGET:
            return <SortableMediaServer
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.MEDIA_REQUEST_MANAGER_WIDGET:
            return <SortableMediaRequestManager
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.NOTES_WIDGET:
            return <SortableNotes
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.CUSTOM_EXTENSION:
            return <SortableCustomExtension
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.SONARR_WIDGET:
            return <SortableSonarr
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.RADARR_WIDGET:
            return <SortableRadarr
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.APP_SHORTCUT:
            return (
                <SortableAppShortcut
                    key={item.id}
                    id={item.id}
                    url={item.url}
                    name={item.label}
                    iconName={item.icon?.path || ''}
                    editMode={editMode}
                    onDelete={() => handleDelete(item.id)}
                    onEdit={() => handleEdit(item)}
                    onDuplicate={() => handleDuplicate(item)}
                    showLabel={item.showLabel}
                    config={item.config}
                />
            );
        case ITEM_TYPE.BLANK_APP:
            return <BlankAppShortcut key={item.id} id={item.id} editMode={editMode} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)} />;
        case ITEM_TYPE.BLANK_ROW:
            return <BlankWidget key={item.id} id={item.id} label={item.label} editMode={editMode} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)} row/>;
        case ITEM_TYPE.IFRAME_WIDGET:
            return <SortableIframeWidget
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.VIDEO_STREAM_WIDGET:
            return <SortableVideoStreamWidget
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.CALENDAR_WIDGET:
            return <SortableCalendarWidget
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        case ITEM_TYPE.BOOKMARKS_WIDGET:
            return <SortableBookmarksWidget
                key={item.id}
                id={item.id}
                editMode={editMode}
                config={item.config}
                onDelete={() => handleDelete(item.id)}
                onEdit={() => handleEdit(item)}
                onDuplicate={() => handleDuplicate(item)}
            />;
        default:
            return <BlankWidget key={item.id} id={item.id} label={item.label} editMode={editMode} onDelete={() => handleDelete(item.id)} onEdit={() => handleEdit(item)} onDuplicate={() => handleDuplicate(item)} />;
        }
    };

    const layout = convertToGridLayout(items);

    // Create layouts object for responsive grid
    const layouts: Layouts = {
        lg: layout,
        md: layout,
        sm: layout,
        xs: layout,
        xxs: layout
    };

    return (
        <>
            <Box
                ref={containerRef}
                sx={{ width: '100%', maxWidth: '100vw', boxSizing: 'border-box', px: 2, paddingBottom: 4, position: 'relative' }}
            >
                {/* Grid Guidelines - Only visible in edit mode */}
                {editMode && (
                    <GridGuidelines
                        containerWidth={containerWidth}
                        rowHeight={calculateSquareRowHeight}
                        currentBreakpoint={currentBreakpoint}
                        numRows={30}
                    />
                )}

                <ResponsiveGridLayout
                    className={`dashboard-grid ${editMode ? 'edit-mode' : ''}`}
                    layouts={layouts}
                    breakpoints={GRID_CONFIG.breakpoints}
                    cols={GRID_CONFIG.cols}
                    rowHeight={calculateSquareRowHeight}
                    width={containerWidth}
                    margin={[colorTheme.gridMargin, colorTheme.gridMargin]}
                    containerPadding={GRID_CONFIG.containerPadding}
                    compactType={GRID_CONFIG.compactType}
                    preventCollision={GRID_CONFIG.preventCollision}
                    isDraggable={editMode}
                    isResizable={editMode}
                    useCSSTransforms={GRID_CONFIG.useCSSTransforms}
                    onLayoutChange={handleLayoutChange}
                    onBreakpointChange={handleBreakpointChange}
                    onDragStop={handleDragStop}
                    onResizeStop={handleResizeStop}
                >
                    {items.map((item, index) => {
                        // Disable lazy loading for:
                        // 1. Edit mode (users need to see all items)
                        // 2. App shortcuts (lightweight, load quickly)
                        // 3. First 6 items (likely in viewport on load)
                        const shouldLazyLoad = !editMode &&
                                               item.type !== ITEM_TYPE.APP_SHORTCUT &&
                                               item.type !== ITEM_TYPE.BLANK_APP &&
                                               index >= 6;

                        return (
                            <div key={item.id}>
                                {shouldLazyLoad ? (
                                    <LazyLoadWidget
                                        placeholderType="skeleton"
                                        triggerOnce={true}
                                    >
                                        {renderItem(item)}
                                    </LazyLoadWidget>
                                ) : (
                                    renderItem(item)
                                )}
                            </div>
                        );
                    })}
                </ResponsiveGridLayout>
            </Box>

            <CenteredModal open={openEditModal} handleClose={() => setOpenEditModal(false)} title='Edit Item'>
                <AddEditForm handleClose={() => setOpenEditModal(false)} existingItem={selectedItem}/>
            </CenteredModal>
        </>
    );
};
