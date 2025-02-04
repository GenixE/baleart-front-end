import {useEffect, useState, useRef} from 'react';
import Card from './Card';

function ListSpace() {
    const [spaces, setSpaces] = useState([]);
    const [imagesData, setImagesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(getInitialVisibleCount()); // Dynamic initial count
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading state for "Load More"
    const sentinelRef = useRef(null); // Ref for the sentinel element

    // Function to get the initial visible count based on screen size
    function getInitialVisibleCount() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1536) { // 2xl screens
            return 12;
        } else if (screenWidth >= 1280) { // xl screens
            return 8;
        } else if (screenWidth >= 768) { // md screens
            return 6;
        } else { // sm screens
            return 4;
        }
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

    useEffect(() => {
        // Fetch space info from the API
        fetch('http://localhost:8000/api/spaces')
            .then((response) => response.json())
            .then((apiData) => {
                // Fetch images from the local JSON file
                return fetch('./spaces.json')
                    .then((res) => res.json())
                    .then((jsonImages) => {
                        setImagesData(jsonImages);

                        // Combine API data with image URLs by matching 'reg_number' <-> 'registre'
                        const mergedData = apiData.data.map((space) => {
                            const matchingImages = jsonImages.filter(
                                (img) => img.registre === space.reg_number
                            );

                            // Build an array of image URLs
                            const imageUrls = matchingImages.map((entry) => entry.image);

                            // Calculate rating
                            let rating = 0;
                            if (space.totalScore && space.countScore && Number(space.countScore) !== 0) {
                                rating = parseFloat(space.totalScore) / parseFloat(space.countScore);
                            }

                            // Build description from zone + municipality
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

                        setSpaces(mergedData);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

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
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full mt-4">
            {/* Grid with visible items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
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

            {/* Sentinel element to trigger loading more cards */}
            <div ref={sentinelRef} className="h-10"></div>

            {/* Show loader when loading more cards */}
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
        </div>
    );
}

export default ListSpace;