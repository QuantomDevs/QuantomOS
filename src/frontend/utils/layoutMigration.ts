import { DashboardItem } from '../types';
import { getDefaultWidth, getDefaultHeight } from './gridPositioning';
import { GRID_CONFIG } from '../config/gridConfig';

export const migrateToGridLayout = (items: DashboardItem[]): DashboardItem[] => {
    let currentX = 0;
    let currentY = 0;
    const gridCols = GRID_CONFIG.cols.lg;

    return items.map((item, index) => {
        // If item already has gridPosition, skip migration
        if (item.gridPosition) {
            return item;
        }

        // Calculate default size based on widget type
        const width = getDefaultWidth(item.type);
        const height = getDefaultHeight(item.type);

        // Check if widget fits in current row
        if (currentX + width > gridCols) {
            currentX = 0;
            currentY += height; // Move to next row
        }

        const gridPosition = {
            x: currentX,
            y: currentY,
            w: width,
            h: height
        };

        // Update position for next widget
        currentX += width;

        return {
            ...item,
            gridPosition
        };
    });
};

export const needsMigration = (items: DashboardItem[]): boolean => {
    return items.some(item => !item.gridPosition);
};
