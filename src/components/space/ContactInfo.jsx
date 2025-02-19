const ContactInfo = ({space, language, apiKey}) => {
    return (
        <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">{language === 'EN' ? 'Contact Info' : language === 'ES' ? 'Información de contacto' : 'Informació de contacte'}</h2>
            <div className="space-y-4">
                {space.email && (
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-gray-600"
                        >
                            <path
                                d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"
                            />
                            <path
                                d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"
                            />
                        </svg>
                        <a href={`mailto:${space.email}`}
                           className="ml-2 text-lg text-gray-700 hover:text-[#149d80]">
                            {space.email}
                        </a>
                    </div>
                )}

                {space.phone && (
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-gray-600"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <a href={`tel:${space.phone}`}
                           className="ml-2 text-lg text-gray-700 hover:text-[#149d80]">
                            {space.phone}
                        </a>
                    </div>
                )}

                {space.website && (
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-gray-600"
                        >
                            <path
                                fillRule="evenodd"
                                d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <a
                            href={space.website.startsWith('http') ? space.website : `https://${space.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-lg text-gray-700 hover:text-[#149d80]"
                        >
                            {space.website}
                        </a>
                    </div>
                )}
            </div>

            {space.address?.name && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">{language === 'EN' ? 'Location' : language === 'ES' ? 'Ubicación' : 'Ubicació'}</h3>
                    <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            title="Google Maps Embed"
                            width="100%"
                            height="100%"
                            style={{border: 0}}
                            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
                                `${space.name}, ${space.address.name}, ${space.address?.municipality?.name}`
                            )}`}
                            allowFullScreen
                            aria-label="Location of the space on Google Maps"
                        ></iframe>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <p className="text-sm text-gray-600 mb-2 sm:mb-0">
                            {space.address.name}, {space.address?.municipality?.name}
                        </p>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                space.address.name
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#149d80] text-white px-4 py-2 rounded-lg hover:bg-[#11866f] transition-colors"
                        >
                            {language === 'EN' ? 'Get Directions' : language === 'ES' ? 'Obtener Dirección' : 'Obtenir Adreça'}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactInfo;