import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('EN'); // Default to English

    useEffect(() => {
        // Initial language setup
        const handleLanguageChange = () => {
            const systemLanguage = navigator.language.split('-')[0].toUpperCase();
            if (systemLanguage === 'ES' || systemLanguage === 'CA') {
                setLanguage(systemLanguage);
            } else {
                setLanguage('EN'); // Default to English for other languages
            }
        };

        // Set initial language
        handleLanguageChange();

        // Listen for language changes
        window.addEventListener('languagechange', handleLanguageChange);

        // Cleanup listener when component unmounts
        return () => {
            window.removeEventListener('languagechange', handleLanguageChange);
        };
    }, []); // Empty dependency array as we want to set up the listener only once

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);