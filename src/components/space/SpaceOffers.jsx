import ServiceIcons from "../../assets/icons/ServiceIcons.jsx";
import ModalityIcons from "../../assets/icons/ModalityIcons.jsx";

const SpaceOffers = ({space, language, getTranslatedName, translations}) => {
    return (
        <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">
                {translations.spaceOffers.offer[language]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-2">{translations.spaceOffers.modalities[language]}</h3>
                    <ul className="list-none text-gray-700">
                        {space.modalities?.map((modality) => (
                            <li key={modality.id} className="flex items-center mb-2">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    {ModalityIcons[modality.id] || <span>No Icon</span>}
                                </div>
                                <span className="ml-4 text-lg">
                                    {getTranslatedName(modality, 'modality')}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">{translations.spaceOffers.amenities[language]}</h3>
                    <ul className="list-none text-gray-700">
                        {space.services?.map((service) => (
                            <li key={service.id} className="flex items-center mb-2">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    {ServiceIcons[service.id] || <span>No Icon</span>}
                                </div>
                                <span className="ml-4 text-lg">
                                    {getTranslatedName(service, 'service')}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SpaceOffers;