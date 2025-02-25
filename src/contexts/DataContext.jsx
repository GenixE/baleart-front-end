import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [spaceTypes, setSpaceTypes] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [services, setServices] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [spaceTypesResponse, modalitiesResponse, servicesResponse, spacesResponse] = await Promise.all([
                    axios.get('http://localhost:8000/api/space-types'),
                    axios.get('http://localhost:8000/api/modalities'),
                    axios.get('http://localhost:8000/api/services'),
                    axios.get('http://localhost:8000/api/spaces'),
                ]);

                setSpaceTypes(spaceTypesResponse.data);
                setModalities(modalitiesResponse.data);
                setServices(servicesResponse.data);
                setSpaces(spacesResponse.data.data); // Assuming the spaces data is nested under `data`
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ spaceTypes, modalities, services, spaces, loading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);