import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [spaceTypes, setSpaceTypes] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [spaceTypesResponse, modalitiesResponse, servicesResponse] = await Promise.all([
                    axios.get('http://localhost:8000/api/space-types'),
                    axios.get('http://localhost:8000/api/modalities'),
                    axios.get('http://localhost:8000/api/services'),
                ]);

                setSpaceTypes(spaceTypesResponse.data);
                setModalities(modalitiesResponse.data);
                setServices(servicesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ spaceTypes, modalities, services, loading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);