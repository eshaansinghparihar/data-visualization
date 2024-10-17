import {useEffect, useState} from 'react';
import BarGraph from "./charts/BarGraph";
import LineChart from './charts/LineChart';
import axios from 'axios';

const fetchData = async (age, gender, startDate, endDate) => {
    const response = await axios.get('http://localhost:8000/api/v1/getData', {
        params: { age, gender, startDate, endDate },
    });
    return response.data;
};

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [dateRange, setDateRange] = useState({ start: '04/10/2022', end: '07/10/2022' });

    const features = ['A', 'B', 'C', 'D', 'E', 'F'];

    useEffect(() => {
        const fetchDataFromApi = async () => {
            const result = await fetchData(age, gender, dateRange.start, dateRange.end);
            setData(result);
        };
        fetchDataFromApi();
    }, [age, gender, dateRange]);

    return (
        <div>
           <div className="dashboard-container">
           <h5>Interactive Data Visualization Dashboard</h5>
            <div className="graph-container">
                <div className="bar-graph">
                <h5>Bar Graph:</h5>
                <BarGraph data={data} features={features} setSelectedFeature={setSelectedFeature}/>
                </div>
                <div className="line-graph">
                {selectedFeature && <h5>Line Graph:</h5>}
                {selectedFeature && <LineChart data={data} feature={selectedFeature} />}
                </div>
            </div>
        </div>
        </div>
    );
};
export default Dashboard;