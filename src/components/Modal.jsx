// Modal.jsx
import Slider from 'rc-slider';
import {useEffect, useState} from 'react';
import modalityIcons from '../icons/ModalityIcons.jsx';
import serviceIcons from '../icons/ServiceIcons.jsx';
import axios from 'axios';

export const Modal = ({isOpen, onClose, sliderValue, setSliderValue}) => {

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

    const [modalities, setModalities] = useState([]);
    const [services, setServices] = useState([]);

    if (!isOpen) return null;

    // Handle changes to the slider value
    const handleSliderChange = (value) => {
        setSliderValue(value);
        console.log('Selected range:', value);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-xl max-h-6/7 overflow-y-auto">
                <header className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-center flex-grow">Filters</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </header>
                <div className="border-b pb-4">
                    <h2 className="text-lg font-semibold mb-4 mt-4">Ratings</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">{sliderValue[0]}</span>
                        <Slider
                            styles={{
                                track: {backgroundColor: '#149d80'},
                                rail: {backgroundColor: '#e5e7eb'},
                                handle: {backgroundColor: '#149d80'}
                            }}
                            range
                            defaultValue={[sliderValue[0], sliderValue[1]]}
                            min={0}
                            max={5}
                            step={0.1}
                            onChange={handleSliderChange}
                        />
                        <span className="text-sm text-gray-700">{sliderValue[1]}</span>
                    </div>
                </div>
                <div className="border-b pb-4">
                    <h2 className="text-lg font-semibold mb-4 mt-4">Modalities</h2>
                    <div className="justify gap-2 flex flex-wrap">
                        {modalities.map((modality) => (
                            <button
                                key={modality.id}
                                className="px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:border-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap"
                            >
                                {modalityIcons[modality.id]}
                                <span>{modality.description_EN}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="border-b pb-4">
                    <h2 className="text-lg font-semibold mb-4 mt-4">Services</h2>
                    <div className="justify gap-2 flex flex-wrap">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                className="px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:border-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap"
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