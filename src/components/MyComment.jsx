import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { translations } from '../translations/translations';


const ImageModal = ({ imageUrl, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            >
                <FiX />
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

export const MyComment = () => {
    const { isLoggedIn } = useAuth();
    const { language } = useLanguage();
    const [comments, setComments] = useState([]);
    const [spacesData, setSpacesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});

    // Fetch spaces.json data
    useEffect(() => {
        const fetchSpacesData = async () => {
            try {
                const response = await fetch('/spaces.json');
                if (!response.ok) throw new Error('Could not fetch spaces data');
                const data = await response.json();
                setSpacesData(data);
            } catch (error) {
                console.error('Error fetching spaces.json:', error);
            }
        };
        fetchSpacesData();
    }, []);

    const getSpaceImage = (space) => {
        const matchedSpace = spacesData.find(s => s.registre === space.reg_number);
        return matchedSpace?.image || 'https://via.placeholder.com/60';
    };

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const handleCarouselNav = (commentId, direction) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [commentId]: direction === 'next'
                ? (prev[commentId] + 1) % comments.find(c => c.id === commentId).images.length
                : (prev[commentId] - 1 + comments.find(c => c.id === commentId).images.length) % comments.find(c => c.id === commentId).images.length
        }));
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/comments/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Enhance comments with space images
                const commentsWithImages = response.data.map(comment => ({
                    ...comment,
                    space: {
                        ...comment.space,
                        image: getSpaceImage(comment.space)
                    }
                }));

                setComments(commentsWithImages);

                // Initialize carousel indexes
                const indexes = {};
                commentsWithImages.forEach(comment => {
                    indexes[comment.id] = 0;
                });
                setCurrentImageIndexes(indexes);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching comments');
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn && spacesData.length) fetchComments();
    }, [isLoggedIn, spacesData]);

    if (!isLoggedIn) {
        return (
            <div className="text-center mt-8 text-gray-600">
                {translations.myComment.notLoggedIn[language]}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loader">
                {[...Array(8)].map((_, i) => <span key={i}></span>)}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center w-full mt-4">
            {isModalOpen && (
                <ImageModal imageUrl={selectedImage} onClose={() => setIsModalOpen(false)} />
            )}

            <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-6">
                    {translations.myComment.myComments[language]}
                </h1>

                {comments.length === 0 ? (
                    <div className="text-gray-600 text-center py-8">
                        {translations.myComment.noComments[language]}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comments.map((comment) => {
                            const space = comment.space;
                            const currentIndex = currentImageIndexes[comment.id] || 0;
                            const images = comment.images || [];

                            return (
                                <div key={comment.id} className="bg-white p-6 rounded-lg shadow-md">
                                    {/* Space Header */}
                                    <div className="flex items-center mb-6">
                                        <Link
                                            to={`/spaces/${space.id}`}
                                            className="flex items-center hover:opacity-80"
                                        >
                                            <img
                                                src={space.image}
                                                alt={space.name}
                                                className="w-16 h-16 rounded-full object-cover mr-4"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/60';
                                                    console.error('Image failed to load:', space.image);
                                                }}
                                            />
                                            <div>
                                                <h2 className="text-xl font-semibold">{space.name}</h2>
                                                <p className="text-gray-600">
                                                    {space.address?.name}, {space.address?.municipality?.name}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-2xl ${i < comment.score ? 'text-[#149d80]' : 'text-gray-300'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* Comment Text */}
                                    <p className="text-gray-700 mb-6">{comment.comment}</p>

                                    {/* Images */}
                                    {images.length > 0 && (
                                        <div className="relative">
                                            <div className="flex gap-4 overflow-hidden">
                                                {images.map((image, index) => {
                                                    const imageUrl = image.url.startsWith('http')
                                                        ? image.url
                                                        : `http://localhost:8000/storage/${image.url}`;

                                                    return (
                                                        <img
                                                            key={image.id}
                                                            src={imageUrl}
                                                            alt="Comment"
                                                            onClick={() => openModal(imageUrl)}
                                                            className={`w-32 h-32 object-cover rounded-lg cursor-zoom-in transition-transform ${
                                                                index === currentIndex ? 'opacity-100' : 'opacity-0 absolute'
                                                            }`}
                                                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                                        />
                                                    );
                                                })}
                                            </div>

                                            {images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => handleCarouselNav(comment.id, 'prev')}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                                                    >
                                                        <FiChevronLeft size={24} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCarouselNav(comment.id, 'next')}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                                                    >
                                                        <FiChevronRight size={24} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};