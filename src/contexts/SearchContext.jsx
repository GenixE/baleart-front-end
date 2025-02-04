import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIsland, setSelectedIsland] = useState('all');
    const [selectedSpaceTypes, setSelectedSpaceTypes] = useState([]);
    const [selectedModalities, setSelectedModalities] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [ratingRange, setRatingRange] = useState([0, 5]);

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            selectedIsland,
            setSelectedIsland,
            selectedSpaceTypes,
            setSelectedSpaceTypes,
            selectedModalities,
            setSelectedModalities,
            selectedServices,
            setSelectedServices,
            ratingRange,
            setRatingRange,
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}