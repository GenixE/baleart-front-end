import { createContext, useContext, useState } from 'react';

const SearchContext = createContext(undefined);

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIsland, setSelectedIsland] = useState('all');

    const value = {
        searchQuery,
        setSearchQuery,
        selectedIsland,
        setSelectedIsland
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}