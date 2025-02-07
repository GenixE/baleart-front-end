import {useEffect, useState} from 'react';
import axios from 'axios';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';
import spaceTypeIcons from '../icons/SpaceTypeIcons.jsx';
import {FilterModal} from './FilterModal.jsx';
import {useSearch} from '../contexts/FilterContext.jsx';

export const Filter = () => {
    const {selectedSpaceTypes, setSelectedSpaceTypes} = useSearch();
    const [spaceTypes, setSpaceTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sliderValue, setSliderValue] = useState([0, 5]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpaceTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/space-types');
                // The response is directly an array
                setSpaceTypes(response.data);
            } catch (error) {
                console.error('Error fetching space types:', error);
                setSpaceTypes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSpaceTypes();
    }, []);

    const handleFilterClick = (type) => {
        console.log('Clicked space type:', type);
        setSelectedSpaceTypes(prevSelectedTypes => {
            const isTypeSelected = prevSelectedTypes.includes(type.id);
            const newSelectedTypes = isTypeSelected
                ? prevSelectedTypes.filter(id => id !== type.id)
                : [...prevSelectedTypes, type.id];
            console.log('Updated selected types:', newSelectedTypes);
            return newSelectedTypes;
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.classList.remove('overflow-hidden');
    };

    return (
        <div className="bg-white shadow-sm my-1">
            <div className="mx-20 p-4 flex items-center gap-4">
                <div className="w-[calc(100%-120px)]">
                    {loading ? (
                        <div className="flex justify-center items-center h-20">
                            <div className="loader">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    ) : (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            breakpoints={{
                                320: {slidesPerView: 3},
                                480: {slidesPerView: 5},
                                720: {slidesPerView: 8},
                                1000: {slidesPerView: 12},
                                2000: {slidesPerView: 15},
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev'
                            }}
                            className="mySwiper"
                        >
                            <div className="swiper-button-prev">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15.75 19.5 8.25 12l7.5-7.5"/>
                                </svg>
                            </div>
                            {spaceTypes.map((type) => (
                                <SwiperSlide key={type.id}>
                                    <div
                                        className={`flex flex-col items-center space-y-1 mx-16 cursor-pointer transition-all duration-200 hover:opacity-75 
                                            ${selectedSpaceTypes.includes(type.id) ? 'p-2 text-[#149d80]' : 'p-2'}`}
                                        onClick={() => handleFilterClick(type)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleFilterClick(type);
                                            }
                                        }}
                                    >
                                        <div
                                            className={`transition-transform duration-200 hover:scale-110 ${selectedSpaceTypes.includes(type.id) ? 'text-[#149d80]' : ''}`}>
                                            {spaceTypeIcons[type.id] || (
                                                <svg viewBox="0 0 50 50" className="size-6">
                                                    <path
                                                        fill="currentColor"
                                                        d="M25 5L5 15v2h40v-2L25 5zm-16 13h32v20H9zm-4 22h40v2H5z"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <p className={`text-xs font-semibold text-center ${selectedSpaceTypes.includes(type.id) ? 'text-[#149d80]' : 'text-gray-700'}`}>
                                            {type.description_EN}
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                            <div className="swiper-button-next">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                                </svg>
                            </div>
                        </Swiper>
                    )}
                </div>
                <button
                    onClick={openModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:border-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5"/>
                    </svg>
                    <span>Filters</span>
                </button>
            </div>
            <FilterModal
                isOpen={isModalOpen}
                onClose={closeModal}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
            />
        </div>
    );
};