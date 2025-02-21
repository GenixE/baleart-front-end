import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Retrieve the language from localStorage if it exists, otherwise default to 'EN'
    const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'EN');

    useEffect(() => {
        // Save the selected language to localStorage whenever it changes
        localStorage.setItem('selectedLanguage', language);
    }, [language]); // This effect runs whenever the language changes

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

        // Set initial language only if no language is stored in localStorage
        if (!localStorage.getItem('selectedLanguage')) {
            handleLanguageChange();
        }

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