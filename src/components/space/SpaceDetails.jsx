const SpaceDetails = ({space, language, getTranslatedDescription, getTranslatedName}) => {
    return (
        <div className="mb-4">
            <p className="text-2xl font-semibold">
                {getTranslatedName(space.space_type, 'spaceType')} {language === 'EN' ? 'in' : 'en'} {space.address?.municipality?.name}, {space.address?.municipality.island?.name}
            </p>
            <p className="text-gray-700">{getTranslatedDescription()}</p>
        </div>
    );
};

export default SpaceDetails;