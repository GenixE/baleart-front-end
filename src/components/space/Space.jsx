import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext'; // Import useData
import ImageModal from './ImageModal';
import CommentForm from './CommentForm';
import ContactInfo from './ContactInfo';
import SpaceDetails from './SpaceDetails';
import SpaceOffers from './SpaceOffers';
import CommentsSection from './CommentsSection';
import { translations } from '../../translations/translations';

const Space = () => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const { id } = useParams();
    const [space, setSpace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState('');
    const { language } = useLanguage();
    const { isLoggedIn } = useAuth();
    const [rating, setRating] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    // Use the useData hook to get spaceTypes, modalities, and services
    const { spaceTypes, modalities, services } = useData();

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
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

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

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const handleImageError = (e) => {
        console.error('Image failed to load:', image);
        e.target.src = 'https://via.placeholder.com/400';
    };

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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const fetchSpaceDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/spaces/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSpace(data.data);
                setComments(data.data.comments || []);

                const spacesResponse = await fetch('/spaces.json');
                if (!spacesResponse.ok) {
                    throw new Error('Could not fetch spaces data');
                }
                const spacesData = await spacesResponse.json();

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

        fetchSpaceDetails();
    }, [id]);

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
                <ImageModal imageUrl={selectedImage} onClose={() => setIsModalOpen(false)} />
            )}
            <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
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

                <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg p-6">
                    <div className="mb-8">
                        <div className="relative group cursor-zoom-in" onClick={() => openModal(image)}>
                            <img
                                src={image || 'https://via.placeholder.com/400'}
                                alt={space.name}
                                className="w-full h-96 object-cover rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105"
                                onError={handleImageError}
                            />
                            <div className="absolute inset-0 group-hover: transition-colors rounded-lg" />
                        </div>
                    </div>
                </div>

                <SpaceDetails space={space} language={language} getTranslatedDescription={getTranslatedDescription}
                              getTranslatedName={getTranslatedName} />
                <hr className="my-4 text-gray-300" />
                <SpaceOffers space={space} language={language} getTranslatedName={getTranslatedName}
                             translations={translations} />
                <hr className="my-4 text-gray-300" />
                <ContactInfo space={space} language={language} apiKey={apiKey} translations={translations} />
                <hr className="my-4 text-gray-300" />
                <CommentForm
                    isLoggedIn={isLoggedIn}
                    language={language}
                    handleSubmitComment={handleSubmitComment}
                    rating={rating}
                    setRating={setRating}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    submitting={submitting}
                    submitError={submitError}
                    translations={translations}
                />
                <CommentsSection
                    comments={comments}
                    currentPage={currentPage}
                    commentsPerPage={commentsPerPage}
                    language={language}
                    openModal={openModal}
                    paginate={paginate}
                    translations={translations}
                />
            </div>
        </div>
    );
};

export default Space;