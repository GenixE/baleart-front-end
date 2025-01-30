import {Header} from "./components/Header.jsx";
import Card from "./components/Card.jsx";
import 'swiper/css/bundle';
import './css/navbutton.css';
import './css/pagination.css';

function App() {
    return (
        <>
            <Header/>
            <div className="container mx-auto mt-6">
                <div className="flex flex-row flex-wrap gap-4">
                    <Card
                        images={[
                            "https://static.wikia.nocookie.net/colors/images/8/8e/-FF0000.png",
                            "https://static.wikia.nocookie.net/colors/images/c/cd/00ff00.png",
                            "https://static.wikia.nocookie.net/colors/images/2/2f/-0000FF.png",
                            "https://static.wikia.nocookie.net/colors/images/8/8e/-FF0000.png",
                            "https://static.wikia.nocookie.net/colors/images/c/cd/00ff00.png",
                            "https://static.wikia.nocookie.net/colors/images/2/2f/-0000FF.png",
                            "https://static.wikia.nocookie.net/colors/images/8/8e/-FF0000.png",
                            "https://static.wikia.nocookie.net/colors/images/c/cd/00ff00.png",
                            "https://static.wikia.nocookie.net/colors/images/2/2f/-0000FF.png",
                        ]}
                        title="Space Title"
                        description="Space description."
                        rating={4.8}
                    />
                </div>
            </div>
        </>
    )
}

export default App