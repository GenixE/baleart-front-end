import {FiX} from 'react-icons/fi';

const ImageModal = ({imageUrl, onClose}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            >
                <FiX/>
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

export default ImageModal;