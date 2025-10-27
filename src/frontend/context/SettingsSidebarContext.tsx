import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsSidebarContextType {
    isOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;
}

const SettingsSidebarContext = createContext<SettingsSidebarContextType | undefined>(undefined);

export const SettingsSidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openSidebar = () => setIsOpen(true);
    const closeSidebar = () => setIsOpen(false);
    const toggleSidebar = () => setIsOpen(prev => !prev);

    return (
        <SettingsSidebarContext.Provider value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}>
            {children}
        </SettingsSidebarContext.Provider>
    );
};

export const useSettingsSidebar = () => {
    const context = useContext(SettingsSidebarContext);
    if (!context) {
        throw new Error('useSettingsSidebar must be used within a SettingsSidebarProvider');
    }
    return context;
};
