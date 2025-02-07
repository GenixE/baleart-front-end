import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from "./components/Header.jsx";
import 'swiper/css/bundle';
import './css/navbutton.css';
import './css/pagination.css';
import './css/loading.css';
import './css/modal.css';
import 'rc-slider/assets/index.css';
import ListSpace from "./components/ListSpace.jsx";
import { SearchProvider } from './contexts/SearchContext';
import { Filter } from "./components/Filter.jsx";
import { Space } from './components/Space';
import {Navigate} from "react-router";

function App() {
    return (
        <Router>
            <SearchProvider>
                <AppContent />
            </SearchProvider>
        </Router>
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
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;