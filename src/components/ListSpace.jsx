import {useEffect, useState} from 'react';
import Card from './Card';

function ListSpace() {
    const [spaces, setSpaces] = useState([]);
    const [imagesData, setImagesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(8);  // Show 8 cards by default

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
                                rating: rating
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

    // Function to load 4 more cards
    const loadMore = () => {
        setVisibleCount((prevCount) => prevCount + 4);
    };

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
        )
    }

    return (
        <div className="flex flex-col items-center w-full mt-4">
            {/* Grid with 8 (or more) visible items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
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

            {/* Show 'Load More' only if there are more items to display */}
            {visibleCount < spaces.length && (
                <button
                    className="mt-6 mb-6 px-4 py-2 bg-[#149d80] text-white rounded hover:bg-[#128a70]"
                    onClick={loadMore}
                >
                    Load More
                </button>
            )}
        </div>
    );
}

export default ListSpace;