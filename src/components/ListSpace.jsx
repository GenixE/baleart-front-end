import { useEffect, useRef, useState } from 'react';
import { useSearch } from '../contexts/SearchContext';
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

    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // Function to get the number of cards to load based on screen size
    function getCardsToLoad() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1536) { // 2xl screens
            return 6;
        } else if (screenWidth >= 1280) { // xl screens
            return 4;
        } else if (screenWidth >= 768) { // md screens
            return 3;
        } else { // sm screens
            return 2;
        }
    }

    // Fetch spaces based on search query and island filter

    useEffect(() => {
        const fetchSpaces = async () => {
            setLoading(true);
            try {
                let data;

                // Always fetch based on island filter first
                const spacesUrl = selectedIsland === 'all'
                    ? 'http://localhost:8000/api/spaces'
                    : `http://localhost:8000/api/spaces?island_id=${selectedIsland}`;
                const spacesResponse = await fetch(spacesUrl);
                const spacesResult = await spacesResponse.json();
                data = spacesResult.data;

                // Apply space type filter if any types are selected
                if (selectedSpaceTypes.length > 0) {
                    data = data.filter(space => space.space_type && selectedSpaceTypes.includes(space.space_type.id));
                }

                // Apply modality filter if any modalities are selected
                if (selectedModalities.length > 0) {
                    data = data.filter(space => space.modalities && space.modalities.some(modality => selectedModalities.includes(modality.id)));
                }

                // Apply service filter if any services are selected
                if (selectedServices.length > 0) {
                    data = data.filter(space => space.services && space.services.some(service => selectedServices.includes(service.id)));
                }

                // Apply rating filter
                data = data.filter(space => {
                    const rating = space.totalScore && space.countScore && Number(space.countScore) !== 0
                        ? parseFloat(space.totalScore) / parseFloat(space.countScore)
                        : 0;
                    return rating >= ratingRange[0] && rating <= ratingRange[1];
                });

                // If there's a search query, filter the results
                if (searchQuery.trim()) {
                    const searchResponse = await fetch(`http://localhost:8000/api/search?search=${encodeURIComponent(searchQuery)}`);
                    const searchResults = await searchResponse.json();

                    data = data.filter(spaceFromIsland =>
                        searchResults.some(searchSpace => searchSpace.id === spaceFromIsland.id)
                    );
                }

                // Fetch images
                const jsonResponse = await fetch('./spaces.json');
                const jsonImages = await jsonResponse.json();

                // Merge the data with images
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

                console.log('Final merged data:', mergedData); // Log final data
                setSpaces(mergedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        // Add debouncing for search queries
        const timeoutId = setTimeout(() => {
            fetchSpaces();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedIsland, selectedSpaceTypes, selectedModalities, selectedServices, ratingRange]);
    
    // Load more cards dynamically based on screen size
    const loadMore = () => {
        setIsLoadingMore(true); // Show loader
        setTimeout(() => {
            const cardsToLoad = getCardsToLoad();
            setVisibleCount((prevCount) => prevCount + cardsToLoad);
            setIsLoadingMore(false); // Hide loader
        }, 1000); // Simulate a delay for loading (1 second)
    };

    // Intersection Observer to detect when the sentinel is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < spaces.length) {
                    loadMore(); // Load more cards when sentinel is in view
                }
            },
            {threshold: 1.0} // Trigger when the sentinel is fully visible
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current); // Observe the sentinel element
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current); // Cleanup observer
            }
        };
    }, [visibleCount, spaces.length]); // Re-run when visibleCount or spaces.length changes

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
            {/* Show loading state */}
            {loading && (
                <div className="loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}
            {/* Show no results message */}
            {!loading && spaces.length === 0 && (
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

            {/* Show results if we have any */}
            {!loading && spaces.length > 0 && (
                <>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
                        {spaces.slice(0, visibleCount).map((item) => (
                            <Card
                                key={item.id}
                                images={item.images}
                                title={item.title}
                                description={item.description}
                                rating={item.rating}
                            />
                        ))}
                    </div>

                    {/* Sentinel element for infinite scroll */}
                    {spaces.length > visibleCount && (
                        <div ref={sentinelRef} className="h-10"></div>
                    )}

                    {/* Loading more indicator */}
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