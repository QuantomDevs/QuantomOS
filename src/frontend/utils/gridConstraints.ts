import { Layout } from 'react-grid-layout';
import { GRID_CONFIG } from '../config/gridConfig';

export const validateBoundaries = (item: Layout, cols: number): Layout => {
    // Ensure item doesn't exceed grid width
    if (item.x + item.w > cols) {
        item.x = Math.max(0, cols - item.w);
    }

    // Ensure item has valid dimensions
    if (item.w < 1) item.w = 1;
    if (item.h < 1) item.h = 1;

    // Ensure item is not placed at negative coordinates
    if (item.x < 0) item.x = 0;
    if (item.y < 0) item.y = 0;

    return item;
};

export const checkCollision = (
    item: Layout,
    layout: Layout[]
): boolean => {
    for (const other of layout) {
        if (other.i === item.i) continue;

        const horizontalOverlap =
            item.x < other.x + other.w &&
            item.x + item.w > other.x;

        const verticalOverlap =
            item.y < other.y + other.h &&
            item.y + item.h > other.y;

        if (horizontalOverlap && verticalOverlap) {
            return true;
        }
    }
    return false;
};
