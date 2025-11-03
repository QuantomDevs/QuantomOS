export const GRID_CONFIG = {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    margin: [16, 16] as [number, number],
    containerPadding: [16, 16] as [number, number],
    compactType: 'vertical' as const,
    preventCollision: true, // Enable collision detection
    isDraggable: true,
    isResizable: true,
    useCSSTransforms: true
};
