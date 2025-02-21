import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {translations} from '../../translations/translations';
import {useLanguage} from '../../contexts/LanguageContext.jsx';

export const Account = ({setIsAuthModalOpen, setAuthModalType}) => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const {isLoggedIn, logout} = useAuth();
    const {language} = useLanguage();

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
            setIsUserDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
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
                                {translations.header.account[language]}
                            </Link>
                            <Link
                                to="/my-comments"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                                {translations.header.comment[language]}
                            </Link>
                            <button
                                onClick={logout}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                                {translations.header.logout[language]}
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
                                {translations.header.login[language]}
                            </button>
                            <button
                                onClick={() => {
                                    setAuthModalType('register');
                                    setIsAuthModalOpen(true);
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                                {translations.header.register[language]}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};