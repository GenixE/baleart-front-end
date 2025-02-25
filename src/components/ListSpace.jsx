import { useEffect, useRef, useState } from 'react';
import { useSearch } from '../contexts/FilterContext.jsx';
import Card from './Card';
import useSpacesData from '../hooks/useSpacesData';

function ListSpace() {
    const {
        searchQuery,
        selectedIsland,
        selectedSpaceTypes,
        selectedModalities,
        selectedServices,
        ratingRange,
    } = useSearch();

    const { spaces: allSpaces, loading } = useSpacesData();
    const [filteredSpaces, setFilteredSpaces] = useState([]);
    const [visibleCount, setVisibleCount] = useState(getInitialVisibleCount());
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const sentinelRef = useRef(null);

    function getInitialVisibleCount() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1536) return 12;
        if (screenWidth >= 1280) return 8;
        if (screenWidth >= 768) return 6;
        return 4;
    }

    function getCardsToLoad() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1536) return 6;
        if (screenWidth >= 1280) return 4;
        if (screenWidth >= 768) return 3;
        return 2;
    }

    const handleCardClick = (id) => {
        window.open(`/space/${id}`, '_blank');
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        const filterSpaces = () => {
            let data = [...allSpaces];

            if (selectedIsland !== 'all') {
                data = data.filter(space => space.island_id === selectedIsland);
            }

            if (selectedSpaceTypes.length > 0) {
                data = data.filter(space => space.space_type && selectedSpaceTypes.includes(space.space_type.id));
            }

            if (selectedModalities.length > 0) {
                data = data.filter(space => space.modalities && space.modalities.some(modality => selectedModalities.includes(modality.id)));
            }

            if (selectedServices.length > 0) {
                data = data.filter(space => space.services && space.services.some(service => selectedServices.includes(service.id)));
            }

            data = data.filter(space => {
                const rating = space.rating;
                return rating >= ratingRange[0] && rating <= ratingRange[1];
            });

            if (searchQuery.trim()) {
                data = data.filter(space => space.title.toLowerCase().includes(searchQuery.toLowerCase()));
            }

            const bestRatedSpaces = data.filter(space => space.rating >= 4);
            const ratedBelow4Spaces = data.filter(space => space.rating > 0 && space.rating < 4);
            const noRatingSpaces = data.filter(space => space.rating === 0);

            const shuffledBestRated = shuffleArray(bestRatedSpaces);
            const shuffledRatedBelow4 = shuffleArray(ratedBelow4Spaces);
            const shuffledNoRating = shuffleArray(noRatingSpaces);

            const finalData = [...shuffledBestRated, ...shuffledRatedBelow4, ...shuffledNoRating];
            setFilteredSpaces(finalData);
        };

        const timeoutId = setTimeout(() => {
            filterSpaces();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedIsland, selectedSpaceTypes, selectedModalities, selectedServices, ratingRange, allSpaces]);

    const loadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            const cardsToLoad = getCardsToLoad();
            setVisibleCount((prevCount) => prevCount + cardsToLoad);
            setIsLoadingMore(false);
        }, 1000);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < filteredSpaces.length) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, [visibleCount, filteredSpaces.length]);

    if (loading) {
        return (
            <div className="loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full mt-4">
            {!loading && filteredSpaces.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-xl text-gray-600 font-semibold mb-2">No spaces found</p>
                    <p className="text-gray-500">
                        {searchQuery
                            ? `No results found for "${searchQuery}"${selectedIsland !== 'all' ? ' in this island' : ''}`
                            : 'No spaces available for the selected filters'}
                    </p>
                </div>
            )}

            {!loading && filteredSpaces.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
                        {filteredSpaces.slice(0, visibleCount).map((item) => (
                            <div key={item.id} onClick={() => handleCardClick(item.id)}>
                                <Card
                                    images={item.images}
                                    title={item.title}
                                    description={item.location}
                                    rating={item.rating}
                                />
                            </div>
                        ))}
                    </div>

                    {filteredSpaces.length > visibleCount && (
                        <div ref={sentinelRef} className="h-10"></div>
                    )}

                    {isLoadingMore && (
                        <div className="loader mt-6 mb-6">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ListSpace;