import {useState, useMemo, useEffect} from 'react';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { Language } from './Language.jsx';
import { Account } from './Account.jsx';
import { Contact } from './Contact.jsx';
import AuthModal from '../AuthModal';

export const Header = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalType, setAuthModalType] = useState('login');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isSmallScreen = useMemo(() => windowWidth < 768, [windowWidth]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <header className="bg-white shadow-xs">
                <div className="mx-4 sm:mx-8 md:mx-16 xl:mx-20 p-4">
                    <div className="flex flex-col sm:flex-row items-center w-full space-y-4 sm:space-y-0">
                        <Logo isSmallScreen={isSmallScreen} />
                        <SearchBar />
                        <div className="flex items-center space-x-4 sm:pl-4 md:pl-8 lg:pl-20">
                            <Contact />
                            <Language />
                            <Account setIsAuthModalOpen={setIsAuthModalOpen} setAuthModalType={setAuthModalType} />
                        </div>
                    </div>
                </div>
            </header>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} type={authModalType} />
        </>
    );
};