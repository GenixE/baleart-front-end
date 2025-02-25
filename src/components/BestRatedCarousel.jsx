import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import useSpacesData from '../hooks/useSpacesData';

const BestRatedCarousel = () => {
    const { spaces, loading } = useSpacesData();
    const [bestRatedSpaces, setBestRatedSpaces] = useState([]);

    useEffect(() => {
        if (spaces.length > 0) {
            const bestRatedSpaces = spaces.filter((space) => space.rating >= 4);
            const top5Spaces = bestRatedSpaces.sort((a, b) => b.rating - a.rating).slice(0, 5);
            setBestRatedSpaces(top5Spaces);
        }
    }, [spaces]);

    const handleCardClick = (id) => {
        window.open(`/space/${id}`, '_blank');
    };

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
                loop={true}
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