import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from "./components/Header.jsx";
import 'swiper/css/bundle';
import './css/navbutton.css';
import './css/pagination.css';
import './css/loading.css';
import './css/modal.css';
import 'rc-slider/assets/index.css';
import ListSpace from "./components/ListSpace.jsx";
import { SearchProvider } from './contexts/FilterContext.jsx';
import { Filter } from "./components/Filter.jsx";
import Space from './components/space/Space.jsx';
import { Navigate } from "react-router";
import { MyAccountSettings } from "./components/MyAccountSettings.jsx";
import { LoginAndSecurity } from "./components/LoginAndSecurity.jsx";
import { PersonalInfo } from "./components/PersonalInfo.jsx";
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import { AuthProvider } from './contexts/AuthContext';
import {LanguageProvider} from "./contexts/LanguageContext.jsx";
import {MyComment} from "./components/MyComment.jsx"; // Import the AuthProvider

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
    const location = useLocation(); // Get the current route location

    return (
        <>
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <Header />
                {/* Render Filter only on the main route (/) */}
                {location.pathname === '/' && <Filter />}
            </div>
            <div className="mx-20 my-2">
                <div className="flex flex-row flex-wrap justify-center gap-4 mx-4">
                    <Routes>
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
        </>
    );
}

export default App;