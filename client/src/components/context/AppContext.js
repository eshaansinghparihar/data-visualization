import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [dateRange, setDateRange] = useState({ 
        startDate: new Date('10/01/2022'), 
        endDate: new Date('10/31/2022'), 
        key: 'selection' });
    const [data, setData] = useState([]);
    const [features, setFeatures] = useState([]);
    const [uniqueAges, setUniqueAges] = useState([]);
    const [uniqueGenders, setUniqueGenders] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <AppContext.Provider value={{
            age, setAge,
            gender, setGender,
            dateRange, setDateRange,
            data, setData,
            features, setFeatures,
            uniqueAges, setUniqueAges,
            uniqueGenders, setUniqueGenders,
            error, setError,
            isLoading, setLoading,
            selectedFeature, setSelectedFeature,
        }}>
            {children}
        </AppContext.Provider>
    );
};
