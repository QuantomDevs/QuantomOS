import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    toggleModal: () => void;
}

const SettingsModalContext = createContext<SettingsModalContextType | undefined>(undefined);

export const SettingsModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const toggleModal = () => setIsOpen(prev => !prev);

    return (
        <SettingsModalContext.Provider value={{ isOpen, openModal, closeModal, toggleModal }}>
            {children}
        </SettingsModalContext.Provider>
    );
};

export const useSettingsModal = () => {
    const context = useContext(SettingsModalContext);
    if (!context) {
        throw new Error('useSettingsModal must be used within a SettingsModalProvider');
    }
    return context;
};
