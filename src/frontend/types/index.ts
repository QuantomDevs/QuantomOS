import { Layout } from 'react-grid-layout';

export enum ITEM_TYPE {
    WEATHER_WIDGET = 'weather-widget',
    DATE_TIME_WIDGET = 'date-time-widget',
    SYSTEM_MONITOR_WIDGET = 'system-monitor-widget',
    DISK_MONITOR_WIDGET = 'disk-monitor-widget',
    DOWNLOAD_CLIENT = 'download-client',
    TORRENT_CLIENT = 'torrent-client', // Legacy support - maps to DOWNLOAD_CLIENT
    PIHOLE_WIDGET = 'pihole-widget',
    ADGUARD_WIDGET = 'adguard-widget',
    MEDIA_SERVER_WIDGET = 'media-server-widget',
    MEDIA_REQUEST_MANAGER_WIDGET = 'media-request-manager-widget',
    NOTES_WIDGET = 'notes-widget',
    SONARR_WIDGET = 'sonarr-widget',
    RADARR_WIDGET = 'radarr-widget',
    DUAL_WIDGET = 'dual-widget',
    GROUP_WIDGET = 'group-widget',
    CUSTOM_EXTENSION = 'custom-extension',
    APP_SHORTCUT = 'app-shortcut',
    PLACEHOLDER = 'placeholder',
    // New widgets - Phase 1.15
    IFRAME_WIDGET = 'iframe-widget',
    VIDEO_STREAM_WIDGET = 'video-stream-widget',
    CALENDAR_WIDGET = 'calendar-widget',
    BOOKMARKS_WIDGET = 'bookmarks-widget',
    // Legacy placeholder types - keeping for backward compatibility
    BLANK_APP = 'blank-app',
    BLANK_WIDGET = 'blank-widget',
    BLANK_ROW = 'blank-row',
    PAGE = 'page'
}

export type GridLayoutItem = Layout & {
    i: string; // Item ID (maps to DashboardItem.id)
};

export enum DOWNLOAD_CLIENT_TYPE {
    QBITTORRENT = 'qbittorrent',
    DELUGE = 'deluge',
    TRANSMISSION = 'transmission',
    SABNZBD = 'sabnzbd',
    NZBGET = 'nzbget'
}

// Legacy support
export enum TORRENT_CLIENT_TYPE {
    QBITTORRENT = 'qbittorrent',
    DELUGE = 'deluge',
    TRANSMISSION = 'transmission',
}

export type NewItem = {
    name?: string;
    icon?: { path: string; name: string; source?: string };
    url?: string;
    label: string;
    type: string;
    showLabel?: boolean;
    adminOnly?: boolean;
    config?: {
        temperatureUnit?: string;
        healthUrl?: string;
        healthCheckType?: string;
        // Security flags for sensitive data
        _hasApiToken?: boolean;
        _hasPassword?: boolean;
        [key: string]: any;
    };
    // New grid layout properties
    gridPosition?: {
        x: number;        // Grid column position (0-based)
        y: number;        // Grid row position (0-based)
        w: number;        // Width in grid columns
        h: number;        // Height in grid rows
        minW?: number;    // Minimum width constraint
        maxW?: number;    // Maximum width constraint
        minH?: number;    // Minimum height constraint
        maxH?: number;    // Maximum height constraint
        static?: boolean; // Whether widget is locked in place
    };
}

export type Icon = {
    path: string;
    name: string;
    source?: string;
    guidelines?: string;
}

export type SearchProvider = {
    name: string;
    url: string;
}

export type Page = {
    id: string;
    name: string;
    adminOnly?: boolean;
    layout: {
        desktop: DashboardItem[];
        mobile: DashboardItem[];
    };
}

export type Config = {
    layout: {
        desktop: DashboardItem[];
        mobile: DashboardItem[];
    },
    pages?: Page[];
    title?: string;
    backgroundImage?: string;
    background?: {
        type: 'image' | 'color';
        value: string;
    };
    search?: boolean;
    searchProvider?: SearchProvider;
    showInternetIndicator?: boolean;
    isSetupComplete?: boolean;
    lastSeenVersion?: string;
    defaultNoteFontSize?: string;
}

export type UploadImageResponse = {
    message: string;
    filePath: string;
}

export type DashboardLayout = {
    layout: {
        desktop: DashboardItem[];
        mobile: DashboardItem[];
    }
}

export type DashboardItem = {
    id: string;
    label: string;
    type: string;
    url?: string;
    icon?: { path: string; name: string; source?: string; };
    showLabel?: boolean;
    adminOnly?: boolean;
    config?: {
        temperatureUnit?: string;
        healthUrl?: string;
        healthCheckType?: string;
        enableStatusCheck?: boolean; // Toggle to enable/disable status check
        openInNewTab?: boolean; // Toggle to open link in new tab (default: true)
        // Security flags for sensitive data
        _hasApiToken?: boolean;
        _hasPassword?: boolean;
        [key: string]: any;
    };
    // New grid layout properties
    gridPosition?: {
        x: number;        // Grid column position (0-based)
        y: number;        // Grid row position (0-based)
        w: number;        // Width in grid columns
        h: number;        // Height in grid rows
        minW?: number;    // Minimum width constraint
        maxW?: number;    // Maximum width constraint
        minH?: number;    // Minimum height constraint
        maxH?: number;    // Maximum height constraint
        static?: boolean; // Whether widget is locked in place
    };
};

