import {useEffect, useRef, useState} from 'react';
import {Filter} from "./Filter.jsx";

export const Header = () => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
            setIsUserDropdownOpen(false);
        }
        if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
            setIsLanguageDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="bg-white shadow-xs sticky top-0 z-50">
                {/*
                  Use responsive margin (mx) and padding (p) classes to adjust spacing as screen size changes
                  e.g., sm:mx-4, md:mx-8, xl:mx-20
                */}
                <div className="mx-4 sm:mx-8 md:mx-16 xl:mx-20 p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <a href="/">
                            <img src="/baleart.svg" alt="baleart" className="w-32 sm:w-40 md:w-45 h-15 pr-2"/>
                        </a>

                        {/* Search bar */}
                        <div className="w-64 sm:w-80 md:w-96 mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full py-3 pl-6 rounded-full border border-gray-300 shadow-sm"
                                />
                                <button
                                    className="absolute right-0 top-0 bottom-0 my-auto mr-1 flex items-center justify-center">
                                    <div className="flex items-center justify-center rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#149d80"
                                             className="size-10">
                                            <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z"/>
                                            <path fillRule="evenodd"
                                                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="relative pr-2" ref={languageDropdownRef}>
                            <button onClick={toggleLanguageDropdown} className="hover:bg-gray-100 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="size-6">
                                    <path fillRule="evenodd"
                                          d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            {isLanguageDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                    <a href="/lang/en"
                                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100">English</a>
                                    <a href="/lang/es"
                                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Spanish</a>
                                    <a href="/lang/ca"
                                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Catalan</a>
                                </div>
                            )}
                        </div>

                        {/* User options */}
                        <div className="relative" ref={userDropdownRef}>
                            <button onClick={toggleUserDropdown}
                                    className={`flex items-center space-x-4 border border-gray-300 rounded-full pl-2 pr-1 py-1 ${isUserDropdownOpen ? 'shadow-md' : 'hover:shadow-md'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="w-5 h-5">
                                    <path fillRule="evenodd"
                                          d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 1 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                                          clipRule="evenodd"/>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="w-10 h-10">
                                    <path fillRule="evenodd"
                                          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                            {isUserDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                    <a href="/profile"
                                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</a>
                                    <a href="/settings"
                                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</a>
                                    <a href="/logout"
                                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Filter/>
            </header>
        </>
    );
};