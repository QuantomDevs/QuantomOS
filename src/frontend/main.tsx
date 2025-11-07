import { CssBaseline } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { DashApi } from './api/dash-api.ts';
import { App } from './App.tsx';
import { DynamicMuiThemeProvider } from './components/DynamicMuiThemeProvider.tsx';
import { ToastInitializer } from './components/toast/ToastInitializer.tsx';
import { ToastProvider } from './components/toast/ToastManager.tsx';
import { AppContextProvider } from './context/AppContextProvider.tsx';
import { SettingsSidebarProvider } from './context/SettingsSidebarContext.tsx';
import { ThemeProvider as ColorThemeProvider } from './context/ThemeContext.tsx';
import './theme/index.css';
import 'react-grid-layout/css/styles.css';
import './styles/gridLayout.css';

DashApi.setupAxiosInterceptors();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <ToastProvider>
                <ColorThemeProvider>
                    <DynamicMuiThemeProvider>
                        <SettingsSidebarProvider>
                            <AppContextProvider>
                                <ToastInitializer />
                                <CssBaseline />
                                <App />
                            </AppContextProvider>
                        </SettingsSidebarProvider>
                    </DynamicMuiThemeProvider>
                </ColorThemeProvider>
            </ToastProvider>
        </Router>
    </StrictMode>
);
