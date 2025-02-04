import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIsland, setSelectedIsland] = useState('all');
    const [selectedSpaceTypes, setSelectedSpaceTypes] = useState([]);

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            selectedIsland,
            setSelectedIsland,
            selectedSpaceTypes,
            setSelectedSpaceTypes,
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}