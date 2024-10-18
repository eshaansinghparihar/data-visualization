import {useEffect, useState} from 'react';
import BarGraph from "./charts/BarGraph";
import LineChart from './charts/LineChart';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css'

const fetchData = async (age, gender, startDate, endDate) => {
    const hostname = (process.env["NODE_ENV"]==='development') ? 'http://localhost:8000' : `${window.location.protocol}//${window.location.hostname}`
    try {
    const response = await axios.get(`${hostname}/api/v1/getData`, {
        params: { age, gender, startDate, endDate },
    });
    return response.data;
    }
    catch(error)
    {
        throw error.response.data;
    }
};

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [features, setFeatures] = useState([]);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: new Date(), endDate: new Date(), key: 'selection', });
    const [uniqueAges, setUniqueAges] = useState([]);
    const [uniqueGenders, setUniqueGenders] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);

    function convertDate(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [day, mnth, date.getFullYear()].join("/");
      }
     
    useEffect(() => {
        let endDate, startDate;
        if(dateRange)
        {
            startDate = convertDate(dateRange.startDate);
            endDate = convertDate(dateRange.endDate);
        }
        const fetchDataFromApi = async () => {
            try {
            setLoading(true);
            const result = await fetchData(age, gender, startDate, endDate);

            setData(result);
            setError(null);
            extractUniqueValues(result);
            extractFeatures(result);
            }
            catch(error)
            {
                setError(error.error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchDataFromApi();
        setLoading(false);
    }, [age, gender, dateRange]);

    const extractUniqueValues = (data) => {
        const ages = new Set();
        const genders = new Set();
        
        data.forEach(entry => {
            ages.add(entry.Age);
            genders.add(entry.Gender);
        });
        
        setUniqueAges(Array.from(ages));
        setUniqueGenders(Array.from(genders));
    };

    const extractFeatures = (data) => {
        const keys = Object.keys(data[0])
        const features = keys.filter((_element, index) => index > 2);
        setFeatures(features)
    }

    const handleChange = ({selection}) =>{
        setDateRange(selection)
    }

    const handleShareView = () => {
        const shareUrl = '';
        // if(age) shareUrl
    }

    const handleSavePreference = () => {

    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Oopsie, Something went wrong !</h2>
                <p style={{color:'red'}}>{error}</p>
            </div>
        );
    }

    return (
        <div>
           <div className="dashboard-container">
           <button onClick={handleShareView}>Share View</button>
           <button onClick={handleShareView}>Save Preference</button>
            <div className="graph-container">
                <div className="bar-graph">
                <h5>Bar Graph: {isLoading && <span>Loading</span>}</h5>
                <BarGraph data={data} features={features} setSelectedFeature={setSelectedFeature}/>
                </div>
                <div className="line-graph">
                {selectedFeature && <h5>Line Graph for feature {selectedFeature} :  {isLoading && <span>Loading</span>}</h5>}
                {selectedFeature && <LineChart data={data} feature={selectedFeature} />}
                </div>
            </div>
            <div className='filters-container'>

            <div>
                <DateRangePicker ranges={[dateRange]} onChange={handleChange}/>
            </div>

           <label>
                    Age
                    <select value={age} onChange={(e) => setAge(e.target.value)}>
                        <option value="">Select</option>
                        {uniqueAges.map((ageValue) => (
                            <option key={ageValue} value={ageValue}>{ageValue}</option>
                        ))}
                    </select>
            </label>

            <label>
                    Gender
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select</option>
                        {uniqueGenders.map((genderValue) => (
                            <option key={genderValue} value={genderValue}>{genderValue}</option>
                        ))}
                    </select>
            </label>
           </div>
        </div>
        </div>
    );
};
export default Dashboard;