import { createTheme, Theme } from '@mui/material/styles';

import { ColorTheme } from '../context/ThemeContext';
import { COLORS } from './styles';

// Create a dynamic theme based on ColorTheme values
export const createDynamicTheme = (colorTheme: ColorTheme): Theme => createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1180,
            xl: 1536,
        },
    },
    typography: {
        button: {
            textTransform: 'none'
        },
        caption: {
            color: COLORS.LIGHT_GRAY, // Change caption text color globally (e.g., orange)
        },
    },
    palette: {
        primary: {
            main: colorTheme.primaryAccent, // Dynamic from ColorTheme
        },
        secondary: {
            main: colorTheme.secondaryAccent, // Dynamic from ColorTheme
            light: '#ffffff',
            contrastText: '#ffffff'
        },
        background: {
            default: colorTheme.backgroundColor, // Dynamic from ColorTheme
            paper: colorTheme.widgetBackground // Dynamic from ColorTheme
        },
        text: {
            primary: colorTheme.primaryText, // Dynamic from ColorTheme
            secondary: colorTheme.secondaryText, // Dynamic from ColorTheme
        },
        success: {
            main: colorTheme.successColor, // Dynamic from ColorTheme
            contrastText: '#ffffff',
        },
        warning: {
            main: colorTheme.warningColor, // Dynamic from ColorTheme
            contrastText: '#ffffff',
        },
        error: {
            main: colorTheme.errorColor, // Dynamic from ColorTheme
            contrastText: '#ffffff',
        },
        action: {
            // Make disabled items lighter
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            disabled: 'rgba(255, 255, 255, 0.5)'
        }
    },
    components: {
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: `${COLORS.LIGHT_GRAY_HOVER} !important`,
                    },
                    '&.Mui-selected': {
                        backgroundColor: `${colorTheme.primaryAccent} !important`, // Dynamic from ColorTheme
                        color: 'white',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: `${colorTheme.primaryAccent} !important`, // Dynamic from ColorTheme
                        color: 'white',
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    '& .MuiAutocomplete-noOptions': {
                        color: colorTheme.primaryText, // Dynamic from ColorTheme
                    },
                },
                option: {
                    '&:hover': {
                        backgroundColor: `${COLORS.LIGHT_GRAY_HOVER} !important`,
                    },
                    '&[aria-selected="true"]': {
                        backgroundColor: `${colorTheme.primaryAccent} !important`, // Dynamic from ColorTheme
                        color: 'white',
                    },
                    '&[aria-selected="true"]:hover': {
                        backgroundColor: `${colorTheme.primaryAccent} !important`, // Dynamic from ColorTheme
                        color: 'white',
                    },
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: COLORS.LIGHT_GRAY_HOVER,
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: colorTheme.borderColor, // Dynamic from ColorTheme
                        },
                        '&:hover fieldset': { borderColor: colorTheme.primaryAccent }, // Dynamic from ColorTheme
                        '&.Mui-focused fieldset': { borderColor: colorTheme.primaryAccent }, // Dynamic from ColorTheme
                    },
                }
            },
            defaultProps: {
                slotProps: {
                    inputLabel: {
                        style: { color: 'inherit' },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--color-sidebar-background)',
                    backdropFilter: 'blur(var(--backdrop-blur))',
                },
            },
        },
        // Add styling for disabled buttons globally
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        color: 'rgba(255, 255, 255, 0.5)',
                    }
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        '@media (hover: hover)': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)'
                        }
                    },
                    '&:active': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        transition: 'background-color 0.1s ease-out'
                    }
                }
            }
        },
        // Style check icons in StepLabel component
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    '&.Mui-active': {
                        color: colorTheme.primaryAccent, // Dynamic from ColorTheme
                    },
                    '&.Mui-completed': {
                        color: colorTheme.primaryAccent, // Dynamic from ColorTheme
                    }
                },
                text: {
                    fill: '#ffffff', // White text for step icons
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: `${COLORS.LIGHT_GRAY_HOVER} !important`,
                    },
                    '&.Mui-selected': {
                        backgroundColor: `${colorTheme.primaryAccent} !important`, // Dynamic from ColorTheme
                        color: 'white',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: `${colorTheme.primaryAccent} !important`, // Dynamic from ColorTheme
                        color: 'white',
                    },
                },
            },
        }
    },
});

// For backward compatibility and places where we need a static theme
import { DEFAULT_THEME } from '../context/ThemeContext';
export const theme = createDynamicTheme(DEFAULT_THEME);

export const styles = {
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    vcenter : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
};
