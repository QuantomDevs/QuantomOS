import { ITEM_TYPE } from '../types';

export type WidgetSize = {
    w: number;      // Default width in grid columns
    h: number;      // Default height in grid rows
    minW?: number;  // Minimum width
    maxW?: number;  // Maximum width
    minH?: number;  // Minimum height
    maxH?: number;  // Maximum height
};

export const WIDGET_SIZES: Record<string, WidgetSize> = {
    // Simple info widgets - smaller
    [ITEM_TYPE.WEATHER_WIDGET]: {
        w: 4,
        h: 2,
        minW: 2,
        maxW: 6,
        minH: 1,
        maxH: 4
    },
    [ITEM_TYPE.DATE_TIME_WIDGET]: {
        w: 4,
        h: 2,
        minW: 2,
        maxW: 6,
        minH: 1,
        maxH: 3
    },

    // Monitor widgets - medium
    [ITEM_TYPE.SYSTEM_MONITOR_WIDGET]: {
        w: 6,
        h: 3,
        minW: 2,
        maxW: 12,
        minH: 1,
        maxH: 6
    },
    [ITEM_TYPE.DISK_MONITOR_WIDGET]: {
        w: 6,
        h: 3,
        minW: 2,
        maxW: 12,
        minH: 1,
        maxH: 6
    },

    // Network widgets - medium
    [ITEM_TYPE.PIHOLE_WIDGET]: {
        w: 6,
        h: 3,
        minW: 2,
        maxW: 8,
        minH: 1,
        maxH: 5
    },
    [ITEM_TYPE.ADGUARD_WIDGET]: {
        w: 6,
        h: 3,
        minW: 2,
        maxW: 8,
        minH: 1,
        maxH: 5
    },

    // Download clients - medium
    [ITEM_TYPE.DOWNLOAD_CLIENT]: {
        w: 6,
        h: 3,
        minW: 2,
        maxW: 8,
        minH: 1,
        maxH: 5
    },
    [ITEM_TYPE.TORRENT_CLIENT]: {
        w: 6,
        h: 3,
        minW: 2,
        maxW: 8,
        minH: 1,
        maxH: 5
    },

    // Media widgets - medium to large
    [ITEM_TYPE.MEDIA_SERVER_WIDGET]: {
        w: 6,
        h: 4,
        minW: 4,
        maxW: 12,
        minH: 3,
        maxH: 6
    },
    [ITEM_TYPE.MEDIA_REQUEST_MANAGER_WIDGET]: {
        w: 6,
        h: 4,
        minW: 4,
        maxW: 12,
        minH: 3,
        maxH: 6
    },
    [ITEM_TYPE.SONARR_WIDGET]: {
        w: 6,
        h: 3,
        minW: 4,
        maxW: 8,
        minH: 2,
        maxH: 5
    },
    [ITEM_TYPE.RADARR_WIDGET]: {
        w: 6,
        h: 3,
        minW: 4,
        maxW: 8,
        minH: 2,
        maxH: 5
    },

    // Notes widget - flexible
    [ITEM_TYPE.NOTES_WIDGET]: {
        w: 6,
        h: 4,
        minW: 2,
        maxW: 12,
        minH: 1,
        maxH: 10
    },

    // Special widgets
    [ITEM_TYPE.DUAL_WIDGET]: {
        w: 6,
        h: 4,
        minW: 4,
        maxW: 12,
        minH: 4,
        maxH: 8
    },
    [ITEM_TYPE.GROUP_WIDGET]: {
        w: 12, // Full width by default
        h: 3,
        minW: 6,
        maxW: 12,
        minH: 2,
        maxH: 8
    },
    [ITEM_TYPE.CUSTOM_EXTENSION]: {
        w: 6,
        h: 3,
        minW: 3,
        maxW: 12,
        minH: 2,
        maxH: 10
    },

    // App shortcuts - small and resizable
    [ITEM_TYPE.APP_SHORTCUT]: {
        w: 1,
        h: 1,
        minW: 1,
        maxW: 6,
        minH: 1,
        maxH: 6
    },

    // Placeholders
    [ITEM_TYPE.BLANK_APP]: {
        w: 2,
        h: 2,
        minW: 1,
        maxW: 4,
        minH: 1,
        maxH: 3
    },
    [ITEM_TYPE.BLANK_WIDGET]: {
        w: 4,
        h: 2,
        minW: 2,
        maxW: 12,
        minH: 1,
        maxH: 6
    },
    [ITEM_TYPE.BLANK_ROW]: {
        w: 12,
        h: 1,
        minW: 12,
        maxW: 12,
        minH: 1,
        maxH: 1
    }
};

export const getWidgetSize = (type: string): WidgetSize => {
    return WIDGET_SIZES[type] || {
        w: 4,
        h: 2,
        minW: 2,
        maxW: 12,
        minH: 1,
        maxH: 6
    };
};
