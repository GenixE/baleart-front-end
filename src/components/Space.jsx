import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import ServiceIcons from "../icons/ServiceIcons.jsx";
import ModalityIcons from "../icons/ModalityIcons.jsx";

export const Space = () => {
    const apiKey = import.meta.env.VITE_API_KEY

    const {id} = useParams();
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
                {/* Space Name and Ratings */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">{space.name}</h1>
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#149d80"
                            className="size-6"
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
                </div>

                {/* Photo */}
                <div className="mb-4">
                    <img
                        src={image || 'https://via.placeholder.com/400'}
                        alt={space.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={handleImageError}
                    />
                </div>

                {/* Space Type, Municipality, and Island */}
                <div className="mb-4">
                    <p className="text-2xl font-semibold">
                        {space.space_type?.name} in {space.address?.municipality?.name}, {space.address?.municipality.island?.name}
                    </p>
                </div>

                {/*Description*/}
                <div className="mb-4">
                    <p className="text-gray-700">{space.observation_EN}</p>
                </div>

                {/* Line Break */}
                <hr className="my-4 text-gray-300"/>

                {/* What this place offers */}
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Artistic Disciplines Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Artistic Disciplines</h3>
                            <ul className="list-none text-gray-700"> {/* Removed bullets for a cleaner look */}
                                {space.modalities?.map((modality) => (
                                    <li key={modality.id} className="flex items-center mb-2">
                                        <div
                                            className="w-8 h-8 flex items-center justify-center"> {/* Larger icon container */}
                                            {ModalityIcons[modality.id] ||
                                                <span>No Icon</span>} {/* Render modality icon */}
                                        </div>
                                        <span
                                            className="ml-4 text-lg">{modality.name}</span> {/* Text with increased margin */}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Amenities Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                            <ul className="list-none text-gray-700"> {/* Removed bullets for a cleaner look */}
                                {space.services?.map((service) => (
                                    <li key={service.id} className="flex items-center mb-2">
                                        <div
                                            className="w-8 h-8 flex items-center justify-center"> {/* Larger icon container */}
                                            {ServiceIcons[service.id] ||
                                                <span>No Icon</span>} {/* Render service icon */}
                                        </div>
                                        <span
                                            className="ml-4 text-lg">{service.name}</span> {/* Text with increased margin */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Line Break */}
                <hr className="my-4 text-gray-300"/>

                {/* Contact Information Section */}
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                    <div className="space-y-4">
                        {/* Email */}
                        {space.email && (
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-gray-600"
                                >
                                    <path
                                        d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"
                                    />
                                    <path
                                        d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"
                                    />
                                </svg>
                                <a href={`mailto:${space.email}`}
                                   className="ml-2 text-lg text-gray-700 hover:text-[#149d80]">
                                    {space.email}
                                </a>
                            </div>
                        )}

                        {/* Phone */}
                        {space.phone && (
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-gray-600"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <a href={`tel:${space.phone}`}
                                   className="ml-2 text-lg text-gray-700 hover:text-[#149d80]">
                                    {space.phone}
                                </a>
                            </div>
                        )}

                        {/* Website */}
                        {space.website && (
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 text-gray-600"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <a
                                    href={space.website.startsWith('http') ? space.website : `https://${space.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-lg text-gray-700 hover:text-[#149d80]"
                                >
                                    {space.website}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Google Maps Embed */}
                    {space.address?.name && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">Location</h3>
                            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                    title="Google Maps Embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
                                        space.name
                                    )}`}
                                    allowFullScreen
                                    aria-label="Location of the space on Google Maps"
                                ></iframe>
                            </div>
                            {/* Address Text and Get Directions Button */}
                            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <p className="text-sm text-gray-600 mb-2 sm:mb-0">
                                    {space.address.name}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                        space.address.name
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#149d80] text-white px-4 py-2 rounded-lg hover:bg-[#11866f] transition-colors"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};