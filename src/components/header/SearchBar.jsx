import { useState, useEffect } from 'react';
import { useSearch } from '../../contexts/FilterContext.jsx';
import { translations } from '../../translations/translations';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export const SearchBar = () => {
    const { searchQuery, setSearchQuery, selectedIsland, setSelectedIsland } = useSearch();
    const [islands, setIslands] = useState([]);
    const { language } = useLanguage();

    useEffect(() => {
        const fetchIslands = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/islands');
                const data = await response.json();
                setIslands(data);
            } catch (error) {
                console.error('Error fetching islands:', error);
            }
        };
        fetchIslands();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleIslandChange = (e) => {
        setSelectedIsland(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex-grow w-full sm:w-auto mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                <div className="relative w-full flex items-center">
                    <div className="relative flex-shrink-0">
                        <select
                            value={selectedIsland}
                            onChange={handleIslandChange}
                            className="appearance-none bg-white border border-gray-300 shadow-sm rounded-l-full py-3 pl-6 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-gray-500 h-12"
                        >
                            <option value="all">{translations.header.all[language]}</option>
                            {islands.map((island) => (
                                <option key={island.id} value={island.id}>
                                    {island.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder={translations.header.search[language]}
                        className="flex-grow py-3 pl-6 pr-12 rounded-r-full border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 h-12"
                    />
                </div>
            </form>
        </div>
    );
};