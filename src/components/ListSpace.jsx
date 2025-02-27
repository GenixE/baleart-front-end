import { useEffect, useRef, useState } from 'react';
import { useSearch } from '../contexts/FilterContext.jsx';
import { useData } from '../contexts/DataContext';
import Card from './Card';

function ListSpace() {
    const {
        searchQuery,
        selectedIsland,
        selectedSpaceTypes,
        selectedModalities,
        selectedServices,
        ratingRange,
    } = useSearch();

    const { spaces: contextSpaces, loading: contextLoading } = useData();
    const [filteredSpaces, setFilteredSpaces] = useState([]);
    const [visibleCount, setVisibleCount] = useState(getInitialVisibleCount());
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const sentinelRef = useRef(null);

    function getInitialVisibleCount() {
        const screenWidth = window.innerWidth * window.devicePixelRatio;
        if (screenWidth >= 1536) return 6;
        if (screenWidth >= 1280) return 4;
        if (screenWidth >= 768) return 3;
        return 2;
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
        const fetchSpaces = async () => {
            setIsLoading(true);

            try {
                let data;

                if (selectedIsland === 'all') {
                    data = contextSpaces;
                } else {
                    const spacesUrl = `http://localhost:8000/api/spaces?island_id=${selectedIsland}`;
                    const spacesResponse = await fetch(spacesUrl);
                    const spacesResult = await spacesResponse.json();
                    data = spacesResult.data;
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
                    const rating = space.totalScore && space.countScore && Number(space.countScore) !== 0
                        ? parseFloat(space.totalScore) / parseFloat(space.countScore)
                        : 0;
                    return rating >= ratingRange[0] && rating <= ratingRange[1];
                });

                if (searchQuery.trim()) {
                    try {
                        const searchResponse = await fetch(`http://localhost:8000/api/search?search=${encodeURIComponent(searchQuery)}`);
                        const searchResults = await searchResponse.json();

                        data = data.filter(spaceFromIsland =>
                            searchResults.some(searchSpace => searchSpace.id === spaceFromIsland.id)
                        );
                    } catch (error) {
                        console.error('Error fetching search results:', error);
                    }
                }

                try {
                    const jsonResponse = await fetch('./spaces.json');
                    const jsonImages = await jsonResponse.json();

                    const mergedData = data.map((space) => {
                        const matchingImages = jsonImages.filter(
                            (img) => img.registre === space.reg_number
                        );

                        const imageUrls = matchingImages.map((entry) => entry.image);

                        let rating = 0;
                        if (space.totalScore && space.countScore && Number(space.countScore) !== 0) {
                            rating = parseFloat(space.totalScore) / parseFloat(space.countScore);
                        }

                        const zoneName = space.address?.zone?.name || '';
                        const municipalityName = space.address?.municipality?.name || '';
                        const combinedDescription = `${zoneName} - ${municipalityName}`;

                        return {
                            id: space.id,
                            images: imageUrls,
                            title: space.name,
                            description: combinedDescription,
                            rating: rating,
                        };
                    });

                    const bestRatedSpaces = mergedData.filter(space => space.rating >= 4);
                    const ratedBelow4Spaces = mergedData.filter(space => space.rating > 0 && space.rating < 4);
                    const noRatingSpaces = mergedData.filter(space => space.rating === 0);

                    const shuffledBestRated = shuffleArray(bestRatedSpaces);
                    const shuffledRatedBelow4 = shuffleArray(ratedBelow4Spaces);
                    const shuffledNoRating = shuffleArray(noRatingSpaces);

                    const finalData = [...shuffledBestRated, ...shuffledRatedBelow4, ...shuffledNoRating];

                    setFilteredSpaces(finalData);
                } catch (error) {
                    console.error('Error fetching JSON images:', error);
                }
            } catch (error) {
                console.error('Error fetching spaces:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpaces();
    }, [contextSpaces, contextLoading, searchQuery, selectedIsland, selectedSpaceTypes, selectedModalities, selectedServices, ratingRange]);

    const loadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            const cardsToLoad = getCardsToLoad();
            setVisibleCount((prevCount) => prevCount + cardsToLoad);
            setIsLoadingMore(false);
        }, 1000);
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const debouncedLoadMore = debounce(loadMore, 100);

    useEffect(() => {
        if (filteredSpaces.length > 0) {
            const observer = new IntersectionObserver(
                (entries) => {
                    console.log("Intersection Observer triggered:", entries[0].isIntersecting);
                    if (entries[0].isIntersecting && visibleCount < filteredSpaces.length) {
                        console.log("Loading more...");
                        loadMore();
                        debouncedLoadMore();
                    }
                },
                { threshold: 0.1 }
            );

            if (sentinelRef.current) {
                console.log("Observing sentinel element");
                observer.observe(sentinelRef.current);
            }

            return () => {
                if (sentinelRef.current) {
                    console.log("Unobserving sentinel element");
                    observer.unobserve(sentinelRef.current);
                }
            };
        }
    }, [visibleCount, filteredSpaces.length]);

    useEffect(() => {
        if (filteredSpaces.length > 0) {
            setVisibleCount(getInitialVisibleCount());
        }
    }, [filteredSpaces]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p className="mt-4 text-gray-600">Loading spaces...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full mt-4">
            {!isLoading && filteredSpaces.length === 0 && (
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

            {!isLoading && filteredSpaces.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
                        {filteredSpaces.slice(0, visibleCount).map((item) => (
                            <div key={item.id} onClick={() => handleCardClick(item.id)}>
                                <Card
                                    images={item.images}
                                    title={item.title}
                                    description={item.description}
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