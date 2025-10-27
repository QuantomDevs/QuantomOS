import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the color theme interface
export interface ColorTheme {
    // Background Colors
    backgroundColor: string;
    widgetBackground: string;
    headerBackground: string;
    sidebarBackground: string;

    // Accent Colors
    primaryAccent: string;
    secondaryAccent: string;
    successColor: string;
    warningColor: string;
    errorColor: string;

    // Text Colors
    primaryText: string;
    secondaryText: string;
    mutedText: string;

    // Border Colors
    borderColor: string;
    hoverBorderColor: string;

    // Transparency & Effects
    widgetBackgroundOpacity: number; // 0-1
    backdropBlur: number; // px value
}

// Default theme matching current implementation
export const DEFAULT_THEME: ColorTheme = {
    // Background Colors
    backgroundColor: '#0a0a0f',
    widgetBackground: '#2e2e2e',
    headerBackground: '#2e2e2e',
    sidebarBackground: '#242424',

    // Accent Colors
    primaryAccent: '#734CDE',
    secondaryAccent: '#242424',
    successColor: '#4caf50',
    warningColor: '#ff9800',
    errorColor: '#C6112E',

    // Text Colors
    primaryText: '#C9C9C9',
    secondaryText: '#000000',
    mutedText: 'rgba(255, 255, 255, 0.5)',

    // Border Colors
    borderColor: '#424242',
    hoverBorderColor: '#767676',

    // Transparency & Effects
    widgetBackgroundOpacity: 0.7,
    backdropBlur: 6,
};

interface ThemeContextType {
    colorTheme: ColorTheme;
    updateColor: (key: keyof ColorTheme, value: string | number) => void;
    updateTheme: (theme: Partial<ColorTheme>) => void;
    resetTheme: () => void;
    exportTheme: () => void;
    importTheme: (themeJson: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'quantomos-color-theme';

// Helper function to apply CSS custom properties
const applyCSSVariables = (theme: ColorTheme) => {
    const root = document.documentElement;

    // Background Colors
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-widget-background', theme.widgetBackground);
    root.style.setProperty('--color-header-background', theme.headerBackground);
    root.style.setProperty('--color-sidebar-background', theme.sidebarBackground);

    // Accent Colors
    root.style.setProperty('--color-primary-accent', theme.primaryAccent);
    root.style.setProperty('--color-secondary-accent', theme.secondaryAccent);
    root.style.setProperty('--color-success', theme.successColor);
    root.style.setProperty('--color-warning', theme.warningColor);
    root.style.setProperty('--color-error', theme.errorColor);

    // Text Colors
    root.style.setProperty('--color-primary-text', theme.primaryText);
    root.style.setProperty('--color-secondary-text', theme.secondaryText);
    root.style.setProperty('--color-muted-text', theme.mutedText);

    // Border Colors
    root.style.setProperty('--color-border', theme.borderColor);
    root.style.setProperty('--color-hover-border', theme.hoverBorderColor);

    // Transparency & Effects
    root.style.setProperty('--widget-background-opacity', theme.widgetBackgroundOpacity.toString());
    root.style.setProperty('--backdrop-blur', `${theme.backdropBlur}px`);

    // Computed transparent colors
    const widgetRgb = hexToRgb(theme.widgetBackground);
    const headerRgb = hexToRgb(theme.headerBackground);
    if (widgetRgb) {
        root.style.setProperty('--color-widget-background-transparent',
            `rgba(${widgetRgb.r}, ${widgetRgb.g}, ${widgetRgb.b}, ${theme.widgetBackgroundOpacity})`);
    }
    if (headerRgb) {
        root.style.setProperty('--color-header-background-transparent',
            `rgba(${headerRgb.r}, ${headerRgb.g}, ${headerRgb.b}, 0.7)`);
    }
};

// Helper to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
        // Load theme from localStorage on initialization
        try {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme) {
                const parsed = JSON.parse(savedTheme);
                return { ...DEFAULT_THEME, ...parsed };
            }
        } catch (error) {
            console.error('Error loading saved theme:', error);
        }
        return DEFAULT_THEME;
    });

    // Apply CSS variables whenever theme changes
    useEffect(() => {
        applyCSSVariables(colorTheme);
    }, [colorTheme]);

    // Save theme to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(colorTheme));
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }, [colorTheme]);

    const updateColor = (key: keyof ColorTheme, value: string | number) => {
        setColorTheme(prev => ({ ...prev, [key]: value }));
    };

    const updateTheme = (theme: Partial<ColorTheme>) => {
        setColorTheme(prev => ({ ...prev, ...theme }));
    };

    const resetTheme = () => {
        setColorTheme(DEFAULT_THEME);
    };

    const exportTheme = () => {
        const themeJson = JSON.stringify(colorTheme, null, 2);
        const blob = new Blob([themeJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quantomos-theme-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const importTheme = (themeJson: string): boolean => {
        try {
            const imported = JSON.parse(themeJson);
            // Validate that it's a valid theme object
            if (typeof imported === 'object' && imported !== null) {
                const validatedTheme = { ...DEFAULT_THEME, ...imported };
                setColorTheme(validatedTheme);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing theme:', error);
            return false;
        }
    };

    return (
        <ThemeContext.Provider value={{
            colorTheme,
            updateColor,
            updateTheme,
            resetTheme,
            exportTheme,
            importTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
