import React from 'react';
import { useLocation } from 'react-router-dom';

const SharedView = () => {
    const location = useLocation();
    
    // Function to get query parameters
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

    const { age, gender, startDate, endDate, selectedFeature } = getQueryParams();

    return (
        <div>
            <h1>Shared View</h1>
            <p>Age: {age}</p>
            <p>Gender: {gender}</p>
            <p>Start Date: {startDate}</p>
            <p>End Date: {endDate}</p>
            <p>Selected Feature: {selectedFeature}</p>
        </div>
    );
};

export default SharedView;
