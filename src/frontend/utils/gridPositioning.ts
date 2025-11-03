import { DashboardItem, ITEM_TYPE } from '../types';
import { GRID_CONFIG } from '../config/gridConfig';

// Temporary default sizes - will be replaced with comprehensive sizing in Subphase 1.4.9
export const getDefaultWidth = (type: string): number => {
    // Simple mapping for now
    switch (type) {
    case ITEM_TYPE.APP_SHORTCUT:
    case ITEM_TYPE.BLANK_APP:
        return 2;
    case ITEM_TYPE.WEATHER_WIDGET:
    case ITEM_TYPE.DATE_TIME_WIDGET:
        return 4;
    case ITEM_TYPE.SYSTEM_MONITOR_WIDGET:
    case ITEM_TYPE.DISK_MONITOR_WIDGET:
    case ITEM_TYPE.PIHOLE_WIDGET:
    case ITEM_TYPE.ADGUARD_WIDGET:
    case ITEM_TYPE.DOWNLOAD_CLIENT:
    case ITEM_TYPE.TORRENT_CLIENT:
    case ITEM_TYPE.MEDIA_SERVER_WIDGET:
    case ITEM_TYPE.MEDIA_REQUEST_MANAGER_WIDGET:
    case ITEM_TYPE.NOTES_WIDGET:
    case ITEM_TYPE.SONARR_WIDGET:
    case ITEM_TYPE.RADARR_WIDGET:
    case ITEM_TYPE.CUSTOM_EXTENSION:
    case ITEM_TYPE.DUAL_WIDGET:
        return 6;
    case ITEM_TYPE.GROUP_WIDGET:
    case ITEM_TYPE.BLANK_ROW:
        return 12;
    default:
        return 4;
    }
};

export const getDefaultHeight = (type: string): number => {
    // Simple mapping for now
    switch (type) {
    case ITEM_TYPE.APP_SHORTCUT:
    case ITEM_TYPE.BLANK_APP:
    case ITEM_TYPE.WEATHER_WIDGET:
    case ITEM_TYPE.DATE_TIME_WIDGET:
        return 2;
    case ITEM_TYPE.SYSTEM_MONITOR_WIDGET:
    case ITEM_TYPE.DISK_MONITOR_WIDGET:
    case ITEM_TYPE.PIHOLE_WIDGET:
    case ITEM_TYPE.ADGUARD_WIDGET:
    case ITEM_TYPE.DOWNLOAD_CLIENT:
    case ITEM_TYPE.TORRENT_CLIENT:
    case ITEM_TYPE.GROUP_WIDGET:
    case ITEM_TYPE.SONARR_WIDGET:
    case ITEM_TYPE.RADARR_WIDGET:
    case ITEM_TYPE.CUSTOM_EXTENSION:
        return 3;
    case ITEM_TYPE.MEDIA_SERVER_WIDGET:
    case ITEM_TYPE.MEDIA_REQUEST_MANAGER_WIDGET:
    case ITEM_TYPE.NOTES_WIDGET:
    case ITEM_TYPE.DUAL_WIDGET:
        return 4;
    case ITEM_TYPE.BLANK_ROW:
        return 1;
    default:
        return 2;
    }
};

export const calculateNextAvailablePosition = (
    items: DashboardItem[]
): { x: number; y: number } => {
    if (items.length === 0) {
        return { x: 0, y: 0 };
    }

    // Find the maximum Y position plus height to start searching from there
    const maxY = Math.max(...items.map(item =>
        (item.gridPosition?.y || 0) + (item.gridPosition?.h || 1)
    ), 0);

    // Start from row 0 and find first available space
    for (let y = 0; y <= maxY + 1; y++) {
        for (let x = 0; x < GRID_CONFIG.cols.lg; x++) {
            const isOccupied = items.some(item => {
                const pos = item.gridPosition;
                if (!pos) return false;

                return x >= pos.x &&
                       x < pos.x + pos.w &&
                       y >= pos.y &&
                       y < pos.y + pos.h;
            });

            if (!isOccupied) {
                return { x, y };
            }
        }
    }

    // If no space found, place at bottom
    return { x: 0, y: maxY + 1 };
};
