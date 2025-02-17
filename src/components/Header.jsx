import { useEffect, useRef, useState } from 'react';
import { useSearch } from '../contexts/FilterContext.jsx';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export const Header = () => {
    const { searchQuery, setSearchQuery, selectedIsland, setSelectedIsland } = useSearch();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalType, setAuthModalType] = useState('login');
    const userDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);
    const [islands, setIslands] = useState([]);
    const { isLoggedIn, logout } = useAuth();
    const { language, setLanguage } = useLanguage();

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

    useEffect(() => {
        const fetchIslands = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/islands');
                const data = await response.json();
                setIslands(data);
            } catch (error) {
                console.error('Error fetching islands:', error);
            }
        };
        fetchIslands();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleIslandChange = (e) => {
        setSelectedIsland(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            logout();
            window.location.reload();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setIsLanguageDropdownOpen(false);
    };

    return (
        <>
            <header className="bg-white shadow-xs">
                <div className="mx-4 sm:mx-8 md:mx-16 xl:mx-20 p-4">
                    <div className="flex items-center w-full">
                        <div className="flex-shrink-0 pr-40">
                            <a href="/">
                                <img src="/baleart.svg" alt="baleart" className="w-32 sm:w-40 md:w-45 h-15 pr-2" />
                            </a>
                        </div>

                        <div className="flex-grow mx-4">
                            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                                <div className="relative w-full flex items-center">
                                    <div className="relative flex-shrink-0">
                                        <select
                                            value={selectedIsland}
                                            onChange={handleIslandChange}
                                            className="appearance-none bg-white border border-gray-300 shadow-sm rounded-l-full py-3 pl-6 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-gray-500 h-12"
                                        >
                                            <option value="all">{language === 'EN' ? 'All' : language === 'ES' ? 'Todos' : 'Tots'}</option>
                                            {islands.map((island) => (
                                                <option key={island.id} value={island.id}>
                                                    {island.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search"
                                        className="flex-grow py-3 pl-6 pr-12 rounded-r-full border border-gray-300 shadow-sm focus:outline-none focus:border-gray-500 h-12"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center space-x-4 pl-40">
                            <div className="relative pr-2" ref={languageDropdownRef}>
                                <button onClick={toggleLanguageDropdown} className="hover:bg-gray-100 rounded-full p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {isLanguageDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                        <button
                                            onClick={() => handleLanguageChange('EN')}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            English
                                        </button>
                                        <button
                                            onClick={() => handleLanguageChange('ES')}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            Spanish
                                        </button>
                                        <button
                                            onClick={() => handleLanguageChange('CA')}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            Catalan
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    onClick={toggleUserDropdown}
                                    className={`flex items-center space-x-4 border border-gray-300 rounded-full pl-2 pr-1 py-1 ${
                                        isUserDropdownOpen ? 'shadow-md' : 'hover:shadow-md'
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 1 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={isLoggedIn ? '#149d80' : 'currentColor'}
                                        className="w-10 h-10"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                        {isLoggedIn ? (
                                            <>
                                                <Link
                                                    to="/account-settings"
                                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                >
                                                    {language === 'EN' ? 'My Account' : language === 'ES' ? 'Mi cuenta' : 'El meu compte'}
                                                </Link>
                                                <Link
                                                    to="/my-comments"
                                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                >
                                                    {language === 'EN' ? 'My comments' : language === 'ES' ? 'Mis comentarios' : 'Els meus comentaris'}
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                >
                                                    {language === 'EN' ? 'Logout' : language === 'ES' ? 'Cerrar sesión' : 'Tancar sessió'}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setAuthModalType('login');
                                                        setIsAuthModalOpen(true);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                >
                                                    {language === 'EN' ? 'Login' : language === 'ES' ? 'Iniciar sesión' : 'Iniciar sessió'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAuthModalType('register');
                                                        setIsAuthModalOpen(true);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                >
                                                    {language === 'EN' ? 'Register' : language === 'ES' ? 'Registrarse' : 'Registrar-se'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} type={authModalType} />
        </>
    );
};