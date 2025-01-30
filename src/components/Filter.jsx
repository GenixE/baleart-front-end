import {useEffect, useState} from 'react';
import axios from 'axios';
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import icons from '../icons/Icons.jsx';

export const Filter = () => {
    const [spaceTypes, setSpaceTypes] = useState([]);

    useEffect(() => {
        const fetchSpaceTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/space-types');
                setSpaceTypes(response.data);
            } catch (error) {
                console.error('Error fetching space types:', error);
            }
        };
        fetchSpaceTypes();
    }, []);

    const handleFilterClick = (type) => {
        // This is where you'll add the filter logic later
        console.log('Filter clicked:', type.description_EN);
    };

    return (
        <div className="bg-white shadow-sm my-1">
            <div className="mx-20 p-4">
                <Swiper
                    modules={[Navigation, Pagination]}
                    breakpoints={{
                        320: {
                            slidesPerView: 2,
                        },
                        480: {
                            slidesPerView: 3,
                        },
                        720: {
                            slidesPerView: 5,
                        },
                        1080: {
                            slidesPerView: 10,
                        },
                        1440: {
                            slidesPerView: 15,
                        },
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    className="mySwiper"
                >
                    {/* Custom prev button */}
                    <div className="swiper-button-prev">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                        </svg>
                    </div>
                    {spaceTypes.map((type) => (
                        <SwiperSlide key={type.id}>
                            <div
                                className="flex flex-col items-center space-y-1 mx-16 cursor-pointer transition-all duration-200 hover:opacity-75"
                                onClick={() => handleFilterClick(type)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleFilterClick(type);
                                    }
                                }}
                            >
                                <div className="transition-transform duration-200 hover:scale-110">
                                    {icons[type.description_EN] || (
                                        // Fallback icon
                                        <svg viewBox="0 0 50 50" className="size-6">
                                            <path
                                                fill="currentColor"
                                                d="M25 5L5 15v2h40v-2L25 5zm-16 13h32v20H9zm-4 22h40v2H5z"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-xs font-semibold text-gray-700 text-center whitespace-nowrap">
                                    {type.description_EN}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                    {/* Custom next button */}
                    <div className="swiper-button-next">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                        </svg>
                    </div>
                </Swiper>
            </div>
        </div>
    );
};