import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import BarGraph from './charts/BarGraph';
import LineChart from './charts/LineChart';
import { extractFeatures } from './utils/extractFeatures';
import { useAppContext } from './context/AppContext';

const SharedView = () => {
    const {
        setData,
        selectedFeature,
        setSelectedFeature,
        features, setFeatures,
        data
    } = useAppContext();

    const location = useLocation();

    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            age: params.get('age'),
            gender: params.get('gender'),
            startDate: params.get('startDate'),
            endDate: params.get('endDate'),
            selectedFeature: params.get('selectedFeature'),
        };
    };

    const fetchData = async (age, gender, startDate, endDate) => {
        const hostname = (process.env["NODE_ENV"] === 'development') ? 'http://localhost:8000' : `${window.location.protocol}//${window.location.hostname}`;
        try {
            const response = await axios.get(`${hostname}/api/v1/getData`, {
                params: { age, gender, startDate, endDate },
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    };

    useEffect(() => {
        const { age, gender, startDate, endDate, selectedFeature } = getQueryParams();
        if (selectedFeature) setSelectedFeature(selectedFeature);
        const fetchDataFromApi = async () => {
            const response = await fetchData(age, gender, startDate, endDate);
            setData(response);
            setFeatures(extractFeatures(response));
        };
        fetchDataFromApi();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="graph-container">
            <div className="bar-graph">
            <BarGraph data={data} features={features} />
            </div>
            <div className="line-graph">
            {selectedFeature ? <LineChart data={data} feature={selectedFeature} /> : <></>}
            </div>
            </div>
        </div>
    );
};

export default SharedView;
