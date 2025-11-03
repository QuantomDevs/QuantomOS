import { DashboardItem } from '../types';

export const hasGridPosition = (item: DashboardItem): boolean => {
    return !!(item.gridPosition &&
              typeof item.gridPosition.x === 'number' &&
              typeof item.gridPosition.y === 'number' &&
              typeof item.gridPosition.w === 'number' &&
              typeof item.gridPosition.h === 'number');
};

export const validateGridPosition = (position: any): boolean => {
    if (!position) return false;

    return position.x >= 0 &&
           position.y >= 0 &&
           position.w > 0 &&
           position.h > 0;
};
