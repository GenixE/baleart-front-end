import {Header} from "./components/Header.jsx";
import 'swiper/css/bundle';
import './css/navbutton.css';
import './css/pagination.css';
import './css/loading.css';
import 'rc-slider/assets/index.css';
import ListSpace from "./components/ListSpace.jsx";
import { SearchProvider } from './contexts/SearchContext';

function App() {
    return (
        <>
            <SearchProvider>
                <Header/>
                <div className="mx-20 my-2">
                    <div className="flex flex-row flex-wrap justify-center gap-4 mx-4">
                        <ListSpace/>
                    </div>
                </div>
            </SearchProvider>
        </>
    )
}

export default App