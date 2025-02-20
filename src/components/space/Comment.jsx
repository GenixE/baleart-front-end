import {FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import {useState} from "react";

const Comment = ({comment, openModal}) => {
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const images = comment.images || [];
    const imagesPerGroup = 4;
    const showCarousel = images.length > imagesPerGroup;

    const handlePrev = () => {
        setCurrentGroupIndex((prevIndex) =>
            prevIndex === 0 ? Math.ceil(images.length / imagesPerGroup) - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentGroupIndex((prevIndex) =>
            prevIndex === Math.ceil(images.length / imagesPerGroup) - 1 ? 0 : prevIndex + 1
        );
    };

    const startIndex = currentGroupIndex * imagesPerGroup;
    const visibleImages = images.slice(startIndex, startIndex + imagesPerGroup);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex gap-6">
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
                                <div className="relative group">
                                    <div className="flex overflow-hidden rounded-lg gap-4">
                                        {visibleImages.map((image) => {
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
                                                    className="w-48 h-48 object-cover cursor-zoom-in transition-transform duration-300 ease-in-out"
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
                                <div className="flex flex-wrap gap-4">
                                    {images.map((image) => {
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

export default Comment;