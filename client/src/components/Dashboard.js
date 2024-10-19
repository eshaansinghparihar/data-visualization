import { useEffect } from 'react';
import BarGraph from "./charts/BarGraph";
import LineChart from './charts/LineChart';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { extractFeatures } from './utils/extractFeatures';
import { useAppContext } from './context/AppContext';
import { getCookie, savePreferences, eraseCookies } from './utils/handleCookies';
import { logout } from '../auth/authService';

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

const Dashboard = () => {
    const {
        data, setData,
        selectedFeature, setSelectedFeature,
        uniqueAges, setUniqueAges,
        uniqueGenders, setUniqueGenders,
        features, setFeatures,
        age, setAge,
        gender, setGender,
        dateRange, setDateRange,
        error, setError,
        setLoading, user
    } = useAppContext();

    const convertDate = (str) => {
        const date = new Date(str);
        return [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join("/");
    };

    useEffect(() => {
        setTimeout(()=>{
            const filters = JSON.parse(getCookie('userFilters'));
            const dateRangeFromCookie = JSON.parse(getCookie('userDateRange'));
            if (filters) {
                setAge(filters.age);
                setGender(filters.gender);
            }
            
            if (dateRangeFromCookie) {
                const { startDate, endDate } = dateRangeFromCookie;
                if (new Date(startDate) instanceof Date && !isNaN(new Date(startDate)) &&
                    new Date(endDate) instanceof Date && !isNaN(new Date(endDate))) {
                    setDateRange({
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        key: 'selection'
                    });
                } else {
                    console.error('Invalid date range from cookie:', dateRangeFromCookie);
                }
            }
        },800)
    }, []);
    


    useEffect(() => {
        const startDate = convertDate(dateRange.startDate);
        const endDate = convertDate(dateRange.endDate);

        const fetchDataFromApi = async () => {
            try {
                setLoading(true);
                const result = await fetchData(age, gender, startDate, endDate);
                setData(result);
                setError(null);
                extractUniqueValues(result);
                setFeatures(extractFeatures(result));
            } catch (error) {
                setError(error.error);
            } finally {
                setSelectedFeature('')
                setLoading(false);
            }
        };

        fetchDataFromApi();
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

    const handleChange = ({ selection }) => {
        setDateRange(selection);
    };

    const generateShareableURL = () => {
        const baseURL = window.location.origin;
        const params = new URLSearchParams({
            age,
            gender,
            startDate: convertDate(dateRange.startDate),
            endDate: convertDate(dateRange.endDate),
            selectedFeature,
        }).toString();
        return `${baseURL}/shared/view?${params}`;
    };

    const handleShareView = () => {
        const shareLink = generateShareableURL();
        navigator.clipboard.writeText(shareLink);
    };

    const handleLogout = async () => {
        const filters = { age, gender };
        savePreferences(filters, dateRange);
        console.log(user);
        await logout();
    }

    const clearPreferences = () => {
        eraseCookies();
        setAge('');
        setGender('');
        setDateRange({ startDate: new Date(), endDate: new Date(), key: 'selection' });
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Oopsie, Something went wrong!</h2>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <button onClick={handleShareView}>Share View</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={clearPreferences}>Clear Preferences</button>
            <div className="graph-container">
            <div className="bar-graph">
                <BarGraph data={data} features={features} setSelectedFeature={setSelectedFeature} />
            </div>
            <div className="line-graph">
                {selectedFeature && <LineChart data={data} feature={selectedFeature} />}
            </div>
            </div>
            <div className='filters-container'>
                <DateRangePicker ranges={[dateRange]} onChange={handleChange} />
                <label>
                    Age
                    <select value={age} onChange={(e) => setAge(e.target.value)}>
                        <option value="">All values</option>
                        {uniqueAges.map((ageValue) => (
                            <option key={ageValue} value={ageValue}>{ageValue}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Gender
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">All</option>
                        {uniqueGenders.map((genderValue) => (
                            <option key={genderValue} value={genderValue}>{genderValue}</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Dashboard;
