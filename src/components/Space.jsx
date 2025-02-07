import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Space = () => {
    const { id } = useParams();
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchSpaceDetails = async () => {
            try {
                // Fetch space details
                const response = await fetch(`http://localhost:8000/api/spaces/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSpace(data.data);

                // Fetch spaces.json containing the images
                const spacesResponse = await fetch('/spaces.json');
                if (!spacesResponse.ok) {
                    throw new Error('Could not fetch spaces data');
                }
                const spacesData = await spacesResponse.json();

                // Find matching space and set image URL
                const matchedSpace = spacesData.find(s => s.registre === data.data.reg_number);
                if (matchedSpace && matchedSpace.image) {
                    // Since we're using direct URLs, we can use them as is
                    setImage(matchedSpace.image);
                } else {
                    console.log('No matching space found or no image URL', {
                        searchedRegNumber: data.data.reg_number,
                        matchedSpace
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSpaceDetails();
    }, [id]);

    // Add error handling for image loading
    const handleImageError = (e) => {
        console.error('Image failed to load:', image);
        e.target.src = 'https://via.placeholder.com/400';
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
                <span></span>
                <span></span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
    }

    if (!space) {
        return <div className="text-gray-600 text-center mt-8">No space found</div>;
    }

    return (
        <div className="flex flex-col items-center w-full mt-4">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{space.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <img
                            src={image || 'https://via.placeholder.com/400'}
                            alt={space.name}
                            className="w-full h-64 object-cover rounded-lg"
                            onError={handleImageError}

                        />
                    </div>
                    <div>
                        <p className="text-gray-700 mb-4">{space.observation_EN}</p>
                        <div className="flex items-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#149d80"
                                className="w-4 h-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007
                  5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527
                  1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354
                  7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273
                  -4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433
                  2.082-5.006z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="ml-2 text-gray-700">
                                {space.totalScore && space.countScore ? (space.totalScore / space.countScore).toFixed(1) : 'No ratings'}
                            </span>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Address</h2>
                            <p className="text-gray-700">
                                {space.address.name}, {space.address?.municipality?.name}
                            </p>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Space Type</h2>
                            <p className="text-gray-700">{space.space_type?.name}</p>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Modalities</h2>
                            <ul className="list-disc list-inside text-gray-700">
                                {space.modalities?.map((modality) => (
                                    <li key={modality.id}>{modality.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Services</h2>
                            <ul className="list-disc list-inside text-gray-700">
                                {space.services?.map((service) => (
                                    <li key={service.id}>{service.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};