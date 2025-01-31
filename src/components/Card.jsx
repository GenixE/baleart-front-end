// Card.jsx
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';

const Card = ({images, title, description, rating}) => {
    const handleCardClick = () => {
        // Navigation logic for later
        console.log('Card clicked:', title);
    };

    return (
        <div
            onClick={handleCardClick}
            className="
        bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg
        transition duration-300 w-full cursor-pointer
      "
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick();
                }
            }}
        >
            <div className="aspect-square w-full relative">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}}
                    pagination={{
                        clickable: false,
                        dynamicBullets: true,
                        dynamicMainBullets: 5,
                        bulletActiveClass: 'swiper-pagination-bullet-active'
                    }}
                    className="w-full h-full"
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

                    {images.map((image, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="aspect-square">
                                <img
                                    src={image}
                                    alt={`${title} - Image ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
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

            <div className="p-2">
                <div className="flex justify-between items-center mb-0.5">
                    <h3 className="text-base font-semibold text-gray-800 truncate flex-1">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
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
                        <span className="text-sm font-medium text-gray-700">
              {rating.toFixed(2)}
            </span>
                    </div>
                </div>
                <p className="text-gray-600 text-xs line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default Card;