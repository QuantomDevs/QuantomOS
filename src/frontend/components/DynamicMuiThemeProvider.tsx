import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ReactNode, useMemo } from 'react';

import { useTheme } from '../context/ThemeContext';
import { createDynamicTheme } from '../theme/theme';

interface DynamicMuiThemeProviderProps {
    children: ReactNode;
}

/**
 * Dynamic MUI Theme Provider that synchronizes MUI's theme with our ColorTheme system.
 * This ensures that MUI components like <Button color="primary"> use colors from ColorTheme.
 */
export const DynamicMuiThemeProvider = ({ children }: DynamicMuiThemeProviderProps) => {
    const { colorTheme } = useTheme();

    // Create MUI theme based on current ColorTheme values
    // useMemo ensures we only recreate the theme when colorTheme changes
    const muiTheme = useMemo(() => createDynamicTheme(colorTheme), [colorTheme]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            {children}
        </MuiThemeProvider>
    );
};
