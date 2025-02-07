import { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import modalityIcons from '../icons/ModalityIcons.jsx';
import serviceIcons from '../icons/ServiceIcons.jsx';
import axios from 'axios';
import { useSearch } from '../contexts/FilterContext.jsx';

export const FilterModal = ({ isOpen, onClose }) => {
    const {
        selectedModalities,
        setSelectedModalities,
        selectedServices,
        setSelectedServices,
        ratingRange,
        setRatingRange,
    } = useSearch();

    const [modalities, setModalities] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchModalities = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/modalities');
                setModalities(response.data);
            } catch (error) {
                console.error('Error fetching modalities:', error);
            }
        };
        fetchModalities();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/services');
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, []);

    const handleModalityClick = (modality) => {
        setSelectedModalities(prevSelected => {
            const isSelected = prevSelected.includes(modality.id);
            return isSelected
                ? prevSelected.filter(id => id !== modality.id)
                : [...prevSelected, modality.id];
        });
    };

    const handleServiceClick = (service) => {
        setSelectedServices(prevSelected => {
            const isSelected = prevSelected.includes(service.id);
            return isSelected
                ? prevSelected.filter(id => id !== service.id)
                : [...prevSelected, service.id];
        });
    };

    const handleSliderChange = (value) => {
        setRatingRange(value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-xl max-h-6/7 overflow-y-auto">
                <header className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-center flex-grow">Filters</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </header>
                <div className="border-b pb-4">
                    <h2 className="text-lg font-semibold mb-4 mt-4">Ratings</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">{ratingRange[0]}</span>
                        <Slider
                            styles={{
                                track: { backgroundColor: '#149d80' },
                                rail: { backgroundColor: '#e5e7eb' },
                                handle: { backgroundColor: '#149d80' }
                            }}
                            range
                            value={ratingRange}
                            min={0}
                            max={5}
                            step={0.1}
                            onChange={handleSliderChange}
                        />
                        <span className="text-sm text-gray-700">{ratingRange[1]}</span>
                    </div>
                </div>
                <div className="border-b pb-4">
                    <h2 className="text-lg font-semibold mb-4 mt-4">Modalities</h2>
                    <div className="justify gap-2 flex flex-wrap">
                        {modalities.map((modality) => (
                            <button
                                key={modality.id}
                                className={`px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:border-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap ${
                                    selectedModalities.includes(modality.id) ? 'bg-gray-100 border-gray-500' : ''
                                }`}
                                onClick={() => handleModalityClick(modality)}
                            >
                                {modalityIcons[modality.id]}
                                <span>{modality.description_EN}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="pb-4">
                    <h2 className="text-lg font-semibold mb-4 mt-4">Services</h2>
                    <div className="justify gap-2 flex flex-wrap">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                className={`px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:border-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap ${
                                    selectedServices.includes(service.id) ? 'bg-gray-100 border-gray-500' : ''
                                }`}
                                onClick={() => handleServiceClick(service)}
                            >
                                {serviceIcons[service.id]}
                                <span>{service.description_EN}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};