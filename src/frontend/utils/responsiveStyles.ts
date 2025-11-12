/**
 * Responsive Styles Utility
 *
 * This utility provides consistent responsive sizing using CSS Container Query units.
 * Container queries allow elements to scale based on their container's size rather than
 * the viewport size, making widgets truly responsive to their grid size.
 *
 * Usage:
 * import { responsiveTypography, responsiveSpacing, responsiveIcons } from '@/utils/responsiveStyles';
 *
 * <Typography sx={{ fontSize: responsiveTypography.body1, padding: responsiveSpacing.sm }}>
 *   Content
 * </Typography>
 */

/**
 * Responsive Typography Sizes
 * Uses clamp() with container query width (cqw) units for fluid scaling
 * Format: clamp(min, preferred, max)
 */
export const responsiveTypography = {
    // Heading sizes - scale more dramatically
    h1: 'clamp(1.5rem, 5cqw, 3rem)',
    h2: 'clamp(1.25rem, 4cqw, 2.5rem)',
    h3: 'clamp(1.1rem, 3.5cqw, 2rem)',
    h4: 'clamp(1rem, 3cqw, 1.75rem)',
    h5: 'clamp(0.9rem, 2.5cqw, 1.5rem)',
    h6: 'clamp(0.85rem, 2.25cqw, 1.25rem)',

    // Body text - moderate scaling
    body1: 'clamp(0.75rem, 2.5cqw, 1.1rem)',
    body2: 'clamp(0.7rem, 2cqw, 0.95rem)',

    // Smaller text - minimal scaling
    caption: 'clamp(0.65rem, 1.75cqw, 0.85rem)',
    small: 'clamp(0.6rem, 1.5cqw, 0.75rem)',

    // Button text - should remain readable
    button: 'clamp(0.75rem, 2.25cqw, 1rem)',

    // Subtitle/label text
    subtitle1: 'clamp(0.8rem, 2.5cqw, 1.2rem)',
    subtitle2: 'clamp(0.75rem, 2cqw, 1rem)',
};

/**
 * Responsive Spacing Values
 * Uses clamp() with container query width (cqw) units for consistent spacing
 */
export const responsiveSpacing = {
    xs: 'clamp(0.25rem, 0.5cqw, 0.5rem)',
    sm: 'clamp(0.5rem, 1cqw, 1rem)',
    md: 'clamp(0.75rem, 1.5cqw, 1.5rem)',
    lg: 'clamp(1rem, 2cqw, 2rem)',
    xl: 'clamp(1.5rem, 3cqw, 3rem)',
    xxl: 'clamp(2rem, 4cqw, 4rem)',
};

/**
 * Responsive Icon Sizes
 * Uses clamp() with container query width (cqw) units for scalable icons
 */
export const responsiveIcons = {
    small: 'clamp(16px, 3cqw, 24px)',
    medium: 'clamp(24px, 5cqw, 36px)',
    large: 'clamp(32px, 7cqw, 48px)',
    xlarge: 'clamp(48px, 10cqw, 72px)',
    xxlarge: 'clamp(64px, 12cqw, 96px)',
};

/**
 * Responsive Border Radius
 * Scales border radius based on container size
 */
export const responsiveBorderRadius = {
    small: 'clamp(2px, 0.5cqw, 4px)',
    medium: 'clamp(4px, 1cqw, 8px)',
    large: 'clamp(8px, 1.5cqw, 12px)',
    xlarge: 'clamp(12px, 2cqw, 16px)',
};

/**
 * Responsive Gap/Gutter Sizes
 * For use in flexbox and grid layouts
 */
export const responsiveGap = {
    xs: 'clamp(2px, 0.25cqw, 4px)',
    sm: 'clamp(4px, 0.5cqw, 8px)',
    md: 'clamp(8px, 1cqw, 12px)',
    lg: 'clamp(12px, 1.5cqw, 16px)',
    xl: 'clamp(16px, 2cqw, 24px)',
};

/**
 * Container Query Style Object
 * Apply this to widget containers to enable container query units
 */
export const containerQueryStyles = {
    containerType: 'size' as const,
    containerName: 'widget',
};

/**
 * Helper function to create custom responsive values
 * @param min - Minimum size (e.g., '0.5rem')
 * @param preferred - Preferred size using cqw (e.g., '2cqw')
 * @param max - Maximum size (e.g., '1.5rem')
 * @returns A clamp() CSS value
 */
export const createResponsiveValue = (min: string, preferred: string, max: string): string => {
    return `clamp(${min}, ${preferred}, ${max})`;
};

/**
 * Responsive dimension utility for width/height
 * Useful for images, icons, and other sized elements
 */
export const responsiveDimensions = {
    xs: 'clamp(20px, 4cqw, 32px)',
    sm: 'clamp(32px, 6cqw, 48px)',
    md: 'clamp(48px, 8cqw, 64px)',
    lg: 'clamp(64px, 10cqw, 96px)',
    xl: 'clamp(96px, 14cqw, 128px)',
};
