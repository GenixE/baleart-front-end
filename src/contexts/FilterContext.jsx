import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIsland, setSelectedIsland] = useState('all');
    const [selectedSpaceTypes, setSelectedSpaceTypes] = useState([]);
    const [selectedModalities, setSelectedModalities] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [ratingRange, setRatingRange] = useState([0, 5]);

    return (
        <FilterContext.Provider value={{
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
        </FilterContext.Provider>
    );
}

export function useSearch() {
    return useContext(FilterContext);
}