import { useState, useEffect } from 'react';

const useSpacesData = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpacesData = async () => {
            try {
                // Fetch spaces data
                const spacesResponse = await fetch('http://localhost:8000/api/spaces');
                const spacesData = await spacesResponse.json();
                const spaces = spacesData.data;

                // Fetch images from spaces.json
                const jsonResponse = await fetch('./spaces.json');
                const jsonImages = await jsonResponse.json();

                // Merge spaces data with images
                const mergedData = spaces.map((space) => {
                    const matchingImages = jsonImages.filter(
                        (img) => img.registre === space.reg_number
                    );

                    const imageUrls = matchingImages.map((entry) => entry.image);

                    // Calculate rating
                    let rating = 0;
                    if (space.totalScore && space.countScore && Number(space.countScore) !== 0) {
                        rating = parseFloat(space.totalScore) / parseFloat(space.countScore);
                    }

                    // Combine location details
                    const zoneName = space.address?.zone?.name || '';
                    const municipalityName = space.address?.municipality?.name || '';
                    const location = `${zoneName} - ${municipalityName}`;

                    return {
                        id: space.id,
                        images: imageUrls,
                        title: space.name,
                        location: location,
                        rating: rating,
                    };
                });

                setSpaces(mergedData);
            } catch (error) {
                console.error('Error fetching spaces data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpacesData();
    }, []);

    return { spaces, loading };
};

export default useSpacesData;