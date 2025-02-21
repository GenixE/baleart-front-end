import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from "./components/header/Header.jsx";
import 'swiper/css/bundle';
import './css/navbutton.css';
import './css/pagination.css';
import './css/loading.css';
import './css/modal.css';
import 'rc-slider/assets/index.css';
import ListSpace from "./components/ListSpace.jsx";
import { SearchProvider, useSearch } from './contexts/FilterContext.jsx'; // Import useSearch
import { Filter } from "./components/Filter.jsx";
import Space from './components/space/Space.jsx';
import { Navigate } from "react-router";
import { MyAccountSettings } from "./components/settings/MyAccountSettings.jsx";
import { LoginAndSecurity } from "./components/settings/LoginAndSecurity.jsx";
import { PersonalInfo } from "./components/settings/PersonalInfo.jsx";
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import { MyComment } from "./components/settings/MyComment.jsx";
import BestRatedCarousel from './components/BestRatedCarousel';
import ContactForm from "./components/ContactForm.jsx";

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <Router>
                    <SearchProvider>
                        <AppContent />
                    </SearchProvider>
                </Router>
            </AuthProvider>
        </LanguageProvider>
    );
}

function AppContent() {
    const location = useLocation();
    const {
        searchQuery,
        selectedIsland,
        selectedSpaceTypes,
        selectedModalities,
        selectedServices,
        ratingRange,
    } = useSearch(); // Use the useSearch hook to access filter states

    // Check if any filters are applied
    const areFiltersApplied =
        searchQuery.trim() !== '' ||
        selectedIsland !== 'all' ||
        selectedSpaceTypes.length > 0 ||
        selectedModalities.length > 0 ||
        selectedServices.length > 0 ||
        ratingRange[0] !== 0 ||
        ratingRange[1] !== 5;

    return (
        <>
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <Header />
                {location.pathname === '/' && <Filter />}
            </div>
            <div className="mx-20 my-2">
                <div className="flex flex-col items-center">
                    {/* Show BestRatedCarousel only on the home page and if no filters are applied */}
                    {location.pathname === '/' && !areFiltersApplied && <BestRatedCarousel />}
                    <div className="flex flex-row flex-wrap justify-center gap-4 mx-4">
                        <Routes>
                            <Route path="/contact" element={<ContactForm />} />
                            <Route path="/" element={<ListSpace />} />
                            <Route path="/space/:id" element={<Space />} />
                            <Route path="*" element={<Navigate to="/" />} />

                            {/* Protected Routes */}
                            <Route
                                path="/account-settings"
                                element={
                                    <PrivateRoute>
                                        <MyAccountSettings />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/account-settings/personal-info"
                                element={
                                    <PrivateRoute>
                                        <PersonalInfo />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/account-settings/login-and-security"
                                element={
                                    <PrivateRoute>
                                        <LoginAndSecurity />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/my-comments"
                                element={
                                    <PrivateRoute>
                                        <MyComment />
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