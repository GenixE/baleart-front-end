import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {Header} from "./components/header/Header.jsx";
import 'swiper/css/bundle';
import './css/navbutton.css';
import './css/pagination.css';
import './css/loading.css';
import './css/modal.css';
import 'rc-slider/assets/index.css';
import ListSpace from "./components/ListSpace.jsx";
import {SearchProvider, useSearch} from './contexts/FilterContext.jsx';
import {Filter} from "./components/Filter.jsx";
import Space from './components/space/Space.jsx';
import {Navigate} from "react-router";
import {MyAccountSettings} from "./components/accountSettings/MyAccountSettings.jsx";
import {LoginAndSecurity} from "./components/accountSettings/LoginAndSecurity.jsx";
import {PersonalInfo} from "./components/accountSettings/PersonalInfo.jsx";
import PrivateRoute from './components/PrivateRoute';
import {AuthProvider} from './contexts/AuthContext';
import {LanguageProvider} from "./contexts/LanguageContext.jsx";
import {MyComment} from "./components/accountSettings/MyComment.jsx";
import BestRatedCarousel from './components/BestRatedCarousel';
import ContactForm from "./components/ContactForm.jsx";
import {DataProvider, useData} from './contexts/DataContext'; // Import DataProvider and useData
import {useEffect, useState} from 'react';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    return (
        <LanguageProvider>
            <AuthProvider>
                <Router>
                    <SearchProvider>
                        <DataProvider>
                            <AppContent isLoading={isLoading} loadingMessage={loadingMessage}
                                        setIsLoading={setIsLoading} setLoadingMessage={setLoadingMessage}/>
                        </DataProvider>
                    </SearchProvider>
                </Router>
            </AuthProvider>
        </LanguageProvider>
    );
}

function AppContent({isLoading, loadingMessage, setIsLoading, setLoadingMessage}) {
    const location = useLocation();
    const {spaces, spaceTypes, modalities, services, loading: dataLoading} = useData();
    const {
        searchQuery,
        selectedIsland,
        selectedSpaceTypes,
        selectedModalities,
        selectedServices,
        ratingRange,
    } = useSearch();

    useEffect(() => {
        if (!dataLoading && spaces.length > 0 && spaceTypes.length > 0 && modalities.length > 0 && services.length > 0) {
            setIsLoading(false);
        } else {
            if (dataLoading) setLoadingMessage('Fetching data...');
            else if (spaces.length === 0) setLoadingMessage('Loading spaces...');
            else if (spaceTypes.length === 0) setLoadingMessage('Loading space types...');
            else if (modalities.length === 0) setLoadingMessage('Loading modalities...');
            else if (services.length === 0) setLoadingMessage('Loading services...');
        }
    }, [dataLoading, spaces, spaceTypes, modalities, services, setIsLoading, setLoadingMessage]);

    const areFiltersApplied =
        searchQuery.trim() !== '' ||
        selectedIsland !== 'all' ||
        selectedSpaceTypes.length > 0 ||
        selectedModalities.length > 0 ||
        selectedServices.length > 0 ||
        ratingRange[0] !== 0 ||
        ratingRange[1] !== 5;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p className="mt-4 text-gray-600">{loadingMessage}</p>
            </div>
        );
    }

    return (
        <>
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <Header/>
                {location.pathname === '/' && <Filter/>}
            </div>
            <div className="mx-20 my-2">
                <div className="flex flex-col items-center">
                    {location.pathname === '/' && !areFiltersApplied && <BestRatedCarousel/>}
                    <div className="flex flex-row flex-wrap justify-center gap-4 mx-4">
                        <Routes>
                            <Route path="/contact" element={<ContactForm/>}/>
                            <Route path="/" element={<ListSpace/>}/>
                            <Route path="/space/:id" element={<Space/>}/>
                            <Route path="*" element={<Navigate to="/"/>}/>

                            {/* Protected Routes */}
                            <Route
                                path="/account-settings"
                                element={
                                    <PrivateRoute>
                                        <MyAccountSettings/>
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/account-settings/personal-info"
                                element={
                                    <PrivateRoute>
                                        <PersonalInfo/>
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/account-settings/login-and-security"
                                element={
                                    <PrivateRoute>
                                        <LoginAndSecurity/>
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/my-comments"
                                element={
                                    <PrivateRoute>
                                        <MyComment/>
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;