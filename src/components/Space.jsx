import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import ServiceIcons from "../icons/ServiceIcons.jsx";
import ModalityIcons from "../icons/ModalityIcons.jsx";
import {useLanguage} from '../contexts/LanguageContext.jsx';
import axios from 'axios';
import {FiChevronLeft, FiChevronRight, FiX} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

// Star Rating Component
const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

// Image Modal Component
const ImageModal = ({imageUrl, onClose}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            >
                <FiX/>
            </button>
            <div className="max-w-90vw max-h-90vh">
                <img
                    src={imageUrl}
                    alt="Expanded view"
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
};

// Comment Component with Carousel
const Comment = ({comment, language, openModal}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = comment.images || [];
    const showCarousel = images.length > 3;

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex gap-6">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={comment.user.color || '#149d80'}
                        className="w-16 h-16 rounded-full"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>

                {/* Comment Content */}
                <div className="flex-grow">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">
                            {comment.user.name} {comment.user.lastName}
                        </h3>
                        <div className="flex items-center mt-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#149d80"
                                className="w-5 h-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="ml-2 text-gray-600">{comment.score}</span>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-4">{comment.comment}</p>

                    {images.length > 0 && (
                        <div className="relative">
                            {showCarousel ? (
                                /* Carousel Layout */
                                <div className="relative group">
                                    <div className="flex overflow-hidden rounded-lg">
                                        {images.map((image, index) => {
                                            // Check if image is stored locally
                                            const isLocalImage = !image.url.startsWith('http');
                                            const imageUrl = isLocalImage
                                                ? `http://localhost:8000/storage/${image.url}`
                                                : image.url;

                                            return (
                                                <img
                                                    key={image.id}
                                                    src={imageUrl}
                                                    alt="Comment"
                                                    onClick={() => openModal(imageUrl)}
                                                    className={`w-48 h-48 object-cover cursor-zoom-in transition-transform ${
                                                        index === currentImageIndex
                                                            ? 'translate-x-0'
                                                            : 'absolute opacity-0'
                                                    }`}
                                                    style={{transform: `translateX(-${currentImageIndex * 100}%)`}}
                                                />
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                                    >
                                        <FiChevronLeft size={24}/>
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                                    >
                                        <FiChevronRight size={24}/>
                                    </button>
                                </div>
                            ) : (
                                /* Grid Layout */
                                <div className="flex flex-wrap gap-4">
                                    {images.map((image) => {
                                        // Check if image is stored locally
                                        const isLocalImage = !image.url.startsWith('http');
                                        const imageUrl = isLocalImage
                                            ? `http://localhost:8000/storage/${image.url}`
                                            : image.url;

                                        return (
                                            <img
                                                key={image.id}
                                                src={imageUrl}
                                                alt="Comment"
                                                onClick={() => openModal(imageUrl)}
                                                className="w-32 h-32 object-cover rounded-lg cursor-zoom-in hover:scale-105 transition-transform"
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Space = () => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const {id} = useParams();
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState('');
    const {language} = useLanguage();
    const { isLoggedIn } = useAuth();
    const [rating, setRating] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!rating || !commentText.trim()) {
            setSubmitError('Rating and comment are required.');
            return;
        }

        setSubmitting(true);
        setSubmitError('');

        const formData = new FormData();
        formData.append('comment', commentText);
        formData.append('score', rating);
        formData.append('space_id', id);

        selectedImages.forEach((image) => {
            formData.append('images[]', image);
        });

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8000/api/comments',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ← MUST include this
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Add new comment to top of comments list
            setComments(prev => [response.data, ...prev]);
            setCommentText('');
            setRating(0);
            setSelectedImages([]);
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Failed to submit comment');
        } finally {
            setSubmitting(false);
        }
    };


    // Add new state for image modal
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    // State for translations
    const [spaceTypes, setSpaceTypes] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [services, setServices] = useState([]);

    // State for comments and pagination
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    // Fetch space details and translations
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
                setComments(data.data.comments || []);

                // Fetch spaces.json containing the images
                const spacesResponse = await fetch('/spaces.json');
                if (!spacesResponse.ok) {
                    throw new Error('Could not fetch spaces data');
                }
                const spacesData = await spacesResponse.json();

                // Find matching space and set image URL
                const matchedSpace = spacesData.find(s => s.registre === data.data.reg_number);
                if (matchedSpace && matchedSpace.image) {
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

        // Fetch translations for space types, modalities, and services
        const fetchTranslations = async () => {
            try {
                const [spaceTypesRes, modalitiesRes, servicesRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/space-types'),
                    axios.get('http://localhost:8000/api/modalities'),
                    axios.get('http://localhost:8000/api/services')
                ]);

                setSpaceTypes(spaceTypesRes.data);
                setModalities(modalitiesRes.data);
                setServices(servicesRes.data);
            } catch (error) {
                console.error('Error fetching translations:', error);
            }
        };

        fetchSpaceDetails();
        fetchTranslations();
    }, [id]);

    // Add error handling for image loading
    const handleImageError = (e) => {
        console.error('Image failed to load:', image);
        e.target.src = 'https://via.placeholder.com/400';
    };

    // Helper function to get translated description
    const getTranslatedDescription = () => {
        if (!space) return '';
        switch (language) {
            case 'CA':
                return space.observation_CA;
            case 'ES':
                return space.observation_ES;
            default:
                return space.observation_EN;
        }
    };

    // Helper function to get translated name for space type, modalities, and services
    const getTranslatedName = (item, type) => {
        if (!item) return '';
        switch (type) {
            case 'spaceType': {
                const spaceType = spaceTypes.find(st => st.id === item.id);
                return spaceType ? spaceType[`description_${language}`] : item.name;
            }
            case 'modality': {
                const modality = modalities.find(m => m.id === item.id);
                return modality ? modality[`description_${language}`] : item.name;
            }
            case 'service': {
                const service = services.find(s => s.id === item.id);
                return service ? service[`description_${language}`] : item.name;
            }
            default:
                return item.name;
        }
    };

    // Pagination logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Helper function to get random color for user icons
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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
            {isModalOpen && (
                <ImageModal imageUrl={selectedImage} onClose={() => setIsModalOpen(false)}/>
            )}
            <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
                {/* Space Name and Ratings */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">{space.name}</h1>
                    {(space.totalScore && space.countScore) ? (
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
                                {(space.totalScore / space.countScore).toFixed(1)}
                            </span>
                            <span className="text-gray-500 ml-1">({space.countScore}) ratings</span>
                        </div>
                    ) : null}
                </div>

                {/* Photo */}
                <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
                    {/* Modified Main Image Section */}
                    <div className="mb-8">
                        <div className="relative group cursor-zoom-in" onClick={() => openModal(image)}>
                            <img
                                src={image || 'https://via.placeholder.com/400'}
                                alt={space.name}
                                className="w-full h-96 object-cover rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105"
                                onError={handleImageError}
                            />
                            <div className="absolute inset-0 group-hover: transition-colors rounded-lg"/>
                        </div>
                    </div>
                </div>

                {/* Space Type, Municipality, and Island */}
                <div className="mb-4">
                    <p className="text-2xl font-semibold">
                        {getTranslatedName(space.space_type, 'spaceType')} {language === 'EN' ? 'in' : 'en'} {space.address?.municipality?.name}, {space.address?.municipality.island?.name}
                    </p>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <p className="text-gray-700">{getTranslatedDescription()}</p>
                </div>

                {/* Line Break */}
                <hr className="my-4 text-gray-300"/>

                {/* What this place offers */}
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-4">
                        {language === 'EN' ? 'What this place offers' : language === 'ES' ? '¿Que ofrece este espacio?' : 'Què ofereix aquest espai?'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Artistic Disciplines Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">{language === 'EN' ? 'Art Forms' : language === 'ES' ? 'Modalidades' : 'Modalitats'}</h3>
                            <ul className="list-none text-gray-700">
                                {space.modalities?.map((modality) => (
                                    <li key={modality.id} className="flex items-center mb-2">
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            {ModalityIcons[modality.id] || <span>No Icon</span>}
                                        </div>
                                        <span className="ml-4 text-lg">
                                            {getTranslatedName(modality, 'modality')}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Amenities Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">{language === 'EN' ? 'Amenities' : language === 'ES' ? 'Servicios' : 'Serveis'}</h3>
                            <ul className="list-none text-gray-700">
                                {space.services?.map((service) => (
                                    <li key={service.id} className="flex items-center mb-2">
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            {ServiceIcons[service.id] || <span>No Icon</span>}
                                        </div>
                                        <span className="ml-4 text-lg">
                                            {getTranslatedName(service, 'service')}
                                        </span>
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
                    <h2 className="text-2xl font-semibold mb-4">{language === 'EN' ? 'Contact Info' : language === 'ES' ? 'Información de contacto' : 'Informació de contacte'}</h2>
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
                            <h3 className="text-xl font-semibold mb-4">{language === 'EN' ? 'Location' : language === 'ES' ? 'Ubicación' : 'Ubicació'}</h3>
                            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                    title="Google Maps Embed"
                                    width="100%"
                                    height="100%"
                                    style={{border: 0}}
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
                                    {space.address.name}, {space.address?.municipality?.name}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                        space.address.name
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#149d80] text-white px-4 py-2 rounded-lg hover:bg-[#11866f] transition-colors"
                                >
                                    {language === 'EN' ? 'Get Directions' : language === 'ES' ? 'Obtener Dirección' : 'Obtenir Adreça'}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Line Break */}
                <hr className="my-4 text-gray-300"/>

                {/* Comment Form */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-6">
                        {language === 'EN' ? 'Leave a Comment' : language === 'ES' ? 'Dejar un comentario' : 'Deixar un comentari'}
                    </h2>

                    {!isLoggedIn ? (
                        <p className="text-gray-600">
                            {language === 'EN'
                                ? 'Please log in to leave a comment.'
                                : language === 'ES'
                                    ? 'Por favor inicie sesión para comentar.'
                                    : 'Si us plau, inicieu sessió per comentar.'}
                        </p>
                    ) : (
                        <form onSubmit={handleSubmitComment} className="bg-white p-6 rounded-lg shadow-md">
                            {submitError && <div className="text-red-500 mb-4">{submitError}</div>}

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    {language === 'EN' ? 'Rating' : language === 'ES' ? 'Valoración' : 'Valoració'}
                                </label>
                                <StarRating rating={rating} setRating={setRating} />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    {language === 'EN' ? 'Comment' : language === 'ES' ? 'Comentario' : 'Comentari'}
                                </label>
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="w-full p-3 border rounded-lg"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    {language === 'EN' ? 'Upload Images (optional)' : language === 'ES' ? 'Subir imágenes (opcional)' : 'Pujar imatges (opcional)'}
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setSelectedImages([...e.target.files])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#149d80] file:text-white hover:file:bg-[#11866f]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#149d80] text-white px-6 py-2 rounded-lg hover:bg-[#11866f] disabled:bg-gray-400 transition-colors"
                            >
                                {submitting ?
                                    (language === 'EN' ? 'Submitting...' : language === 'ES' ? 'Enviando...' : 'Enviant...') :
                                    (language === 'EN' ? 'Submit Comment' : language === 'ES' ? 'Enviar comentario' : 'Enviar comentari')}
                            </button>
                        </form>
                    )}
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-6">
                        {language === 'EN' ? 'Comments' : language === 'ES' ? 'Comentarios' : 'Comentaris'}
                    </h2>
                    {currentComments.length > 0 ? (
                        <div className="space-y-6">
                            {currentComments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    language={language}
                                    openModal={openModal}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">
                            {language === 'EN' ? 'No comments yet.' : language === 'ES' ? 'No hay comentarios aún.' : 'Encara no hi ha comentaris.'}
                        </p>
                    )}

                    {/* Pagination */}
                    {comments.length > commentsPerPage && (
                        <div className="flex justify-center mt-6">
                            {Array.from({length: Math.ceil(comments.length / commentsPerPage)}, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`mx-1 px-4 py-2 rounded-lg ${
                                        currentPage === i + 1 ? 'bg-[#149d80] text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};