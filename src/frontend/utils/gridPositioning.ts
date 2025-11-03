import { DashboardItem } from '../types';
import { GRID_CONFIG } from '../config/gridConfig';
import { getWidgetSize } from '../config/widgetSizes';

export const getDefaultWidth = (type: string): number => {
    return getWidgetSize(type).w;
};

export const getDefaultHeight = (type: string): number => {
    return getWidgetSize(type).h;
};

export const getWidgetConstraints = (type: string) => {
    const size = getWidgetSize(type);
    return {
        minW: size.minW,
        maxW: size.maxW,
        minH: size.minH,
        maxH: size.maxH
    };
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
