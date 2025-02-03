import {Header} from "./components/Header.jsx";
import 'swiper/css/bundle';
import './css/navbutton.css';
import './css/pagination.css';
import './css/loading.css';
import 'rc-slider/assets/index.css';
import ListSpace from "./components/ListSpace.jsx";

function App() {
    return (
        <>
            <Header/>
            <div className="container mx-auto mt-6">
                <div className="flex flex-row flex-wrap justify-center gap-4 mx-4 sm:mx-8 md:mx-16 xl:mx-20">
                    <ListSpace/>
                </div>
            </div>
        </>
    )
}

export default App