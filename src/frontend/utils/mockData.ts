import { ITEM_TYPE } from '../types';

/**
 * Mock data utility for widget previews
 * Provides static data to render widget previews without making API calls
 */

export const getMockDataForWidget = (widgetType: string): any => {
    switch (widgetType) {
    case ITEM_TYPE.WEATHER_WIDGET:
        return {
            location: 'San Francisco',
            timezone: 'America/Los_Angeles',
            temperature: 72,
            conditions: 'Partly Cloudy',
            humidity: 65,
            windSpeed: 12,
            icon: '02d'
        };

    case ITEM_TYPE.DATE_TIME_WIDGET:
        return {
            location: 'San Francisco',
            timezone: 'America/Los_Angeles',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

    case ITEM_TYPE.SYSTEM_MONITOR_WIDGET:
        return {
            cpu: 45,
            memory: 62,
            temperature: 58,
            uptime: '5d 12h',
            networkUp: 125,
            networkDown: 450
        };

    case ITEM_TYPE.DISK_MONITOR_WIDGET:
        return {
            disks: [
                { name: 'System', used: 450, total: 1000, usedPercent: 45 },
                { name: 'Data', used: 750, total: 2000, usedPercent: 37.5 }
            ]
        };

    case ITEM_TYPE.DOWNLOAD_CLIENT:
        return {
            clientType: 'qbittorrent',
            activeDownloads: 3,
            downloadSpeed: '5.2 MB/s',
            uploadSpeed: '1.8 MB/s',
            totalSize: '25.6 GB',
            completedPercent: 68
        };

    case ITEM_TYPE.PIHOLE_WIDGET:
        return {
            status: 'enabled',
            queriesBlocked: 12543,
            percentBlocked: 32.5,
            domainsOnBlocklist: 156723,
            queriesForwarded: 25341
        };

    case ITEM_TYPE.ADGUARD_WIDGET:
        return {
            status: 'running',
            queriesBlocked: 8932,
            percentBlocked: 28.3,
            avgProcessingTime: '12ms',
            uptime: '15d 8h'
        };

    case ITEM_TYPE.MEDIA_SERVER_WIDGET:
        return {
            serverType: 'plex',
            activeStreams: 2,
            totalMovies: 1245,
            totalShows: 348,
            totalEpisodes: 8932,
            storageUsed: '8.5 TB'
        };

    case ITEM_TYPE.MEDIA_REQUEST_MANAGER_WIDGET:
        return {
            managerType: 'overseerr',
            pendingRequests: 12,
            approvedRequests: 5,
            totalRequests: 234,
            recentRequests: [
                { title: 'The Matrix Resurrections', type: 'movie', status: 'approved' },
                { title: 'Stranger Things S5', type: 'tv', status: 'pending' }
            ]
        };

    case ITEM_TYPE.NOTES_WIDGET:
        return {
            content: '# Quick Notes\n\nThis is a preview of the notes widget with **markdown** support.\n\n- Item 1\n- Item 2\n- Item 3',
            fontSize: '14px'
        };

    case ITEM_TYPE.SONARR_WIDGET:
        return {
            wanted: 15,
            queued: 8,
            series: 45,
            episodes: 1523,
            diskSpace: '2.3 TB',
            unmonitoredEpisodes: 23
        };

    case ITEM_TYPE.RADARR_WIDGET:
        return {
            wanted: 8,
            queued: 3,
            movies: 567,
            diskSpace: '5.6 TB',
            unmonitoredMovies: 12
        };

    case ITEM_TYPE.DUAL_WIDGET:
        return {
            topWidget: getMockDataForWidget(ITEM_TYPE.WEATHER_WIDGET),
            bottomWidget: getMockDataForWidget(ITEM_TYPE.DATE_TIME_WIDGET)
        };

    case ITEM_TYPE.GROUP_WIDGET:
        return {
            name: 'My Apps',
            items: [
                { id: '1', name: 'App 1', icon: 'launch', url: '#' },
                { id: '2', name: 'App 2', icon: 'launch', url: '#' },
                { id: '3', name: 'App 3', icon: 'launch', url: '#' }
            ],
            maxItems: 3,
            showLabel: true
        };

    case ITEM_TYPE.IFRAME_WIDGET:
        return {
            url: 'https://example.com',
            interactive: true,
            displayName: 'Iframe Preview',
            showLabel: true
        };

    case ITEM_TYPE.VIDEO_STREAM_WIDGET:
        return {
            feedUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            autoplay: true,
            muted: true,
            showControls: false,
            displayName: 'Video Stream Preview',
            showLabel: true
        };

    case ITEM_TYPE.CALENDAR_WIDGET:
        return {
            enableIcal: true,
            icalUrl: 'https://calendar.google.com/calendar/ical/...',
            displayName: 'Calendar Preview',
            showLabel: true,
            events: [
                {
                    id: '1',
                    title: 'Team Meeting',
                    start: new Date(),
                    end: new Date(Date.now() + 3600000),
                    description: 'Weekly team sync',
                    allDay: false
                },
                {
                    id: '2',
                    title: 'Project Deadline',
                    start: new Date(Date.now() + 86400000),
                    end: new Date(Date.now() + 86400000),
                    description: 'Submit final deliverables',
                    allDay: true
                }
            ]
        };

    case ITEM_TYPE.BOOKMARKS_WIDGET:
        return {
            title: 'My Bookmarks',
            layout: 'vertical',
            hideTitle: false,
            hideIcons: false,
            hideHostnames: false,
            openInNewTab: true,
            displayName: 'Bookmarks Preview',
            showLabel: true,
            bookmarks: [
                { id: '1', name: 'Google', url: 'https://google.com' },
                { id: '2', name: 'GitHub', url: 'https://github.com' },
                { id: '3', name: 'Stack Overflow', url: 'https://stackoverflow.com' }
            ]
        };

    default:
        return null;
    }
};

/**
 * Check if a widget type has available mock data
 */
export const hasMockData = (widgetType: string): boolean => {
    return getMockDataForWidget(widgetType) !== null;
};
