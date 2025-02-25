import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useData } from '../contexts/DataContext';

const BestRatedCarousel = () => {
    const { spaces, loading } = useData();
    const [bestRatedSpaces, setBestRatedSpaces] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false); // State to track if data is loaded

    useEffect(() => {
        if (!loading && spaces.length > 0) {
            const fetchJsonImages = async () => {
                try {
                    const jsonResponse = await fetch('./spaces.json');
                    const jsonImages = await jsonResponse.json();

                    const mergedData = spaces.map((space) => {
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
                        const location = `${zoneName} - ${municipalityName}`;

                        return {
                            id: space.id,
                            images: imageUrls,
                            title: space.name,
                            location: location,
                            rating: rating,
                        };
                    });

                    const bestRatedSpaces = mergedData.filter((space) => space.rating >= 4);
                    const top5Spaces = bestRatedSpaces.sort((a, b) => b.rating - a.rating).slice(0, 5);

                    // Set the best-rated spaces and mark data as loaded
                    setBestRatedSpaces(top5Spaces);
                    setIsDataLoaded(true);
                } catch (error) {
                    console.error('Error fetching JSON images:', error);
                }
            };

            fetchJsonImages();
        }
    }, [loading, spaces]);

    const handleCardClick = (id) => {
        window.open(`/space/${id}`, '_blank');
    };

    // Only render the Swiper if there are at least 2 slides (required for loop to work)
    if (!isDataLoaded || bestRatedSpaces.length < 2) {
        return null; // Don't render the carousel if data isn't ready or there aren't enough slides
    }

    return (
        <div className="my-8 w-full px-4">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                spaceBetween={20}
                slidesPerView={1}
                loop={true} // Enable loop only if there are enough slides
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                className="w-full mx-auto"
            >
                <div
                    className="swiper-button-prev"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                    </svg>
                </div>

                {bestRatedSpaces.map((space) => (
                    <SwiperSlide key={space.id}>
                        <div
                            className="flex justify-center cursor-pointer"
                            onClick={() => handleCardClick(space.id)}
                        >
                            <div className="w-full h-132 overflow-hidden rounded-lg shadow-lg relative">
                                {space.images.length > 0 ? (
                                    <img
                                        src={space.images[0]}
                                        alt={`Best Rated Space ${space.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">No Image Available</span>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-4 text-white">
                                    <h3 className="text-xl font-semibold">{space.title}</h3>
                                    <p className="text-sm">{space.location}</p>
                                    <div className="flex items-center gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#149d80"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium">
                                            {space.rating.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                <div
                    className="swiper-button-next"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </div>
            </Swiper>
        </div>
    );
};

export default BestRatedCarousel;