import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import BarGraph from './charts/BarGraph';
import LineChart from './charts/LineChart';
import { extractFeatures } from './utils/extractFeatures';
import { useAppContext } from './context/AppContext';
import { logout } from '../auth/authService';
import Navbar from './Navbar/Navbar';
import CardContainer from './CardContainer/CardContainer';
import Card from './Card/Card';

const SharedView = () => {
    const {
        setData,
        selectedFeature,
        setSelectedFeature,
        features, setFeatures,
        data
    } = useAppContext();

    const navigator = useNavigate()

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

    const handleLogout = async () => {
        await logout();
    }

    const navigate = () => {
        navigator('/dashboard', {replace : true});
    }

    return (
        <div className="dashboard-container">
            <Navbar>
            <button className="navbar-button" onClick={handleLogout}>Logout</button>
            <button className="navbar-button" onClick={navigate}>Go To Dashboard</button>
            </Navbar>
            <CardContainer>
            <Card title={"Bar Graph"}>
                <BarGraph data={data} features={features}/>
            </Card>
            {selectedFeature &&
            (<Card title={"Line Graph"} width={"100%"}>
                <LineChart data={data} feature={selectedFeature} />
            </Card>)}
            </CardContainer>
        </div>
    );
};

export default SharedView;
