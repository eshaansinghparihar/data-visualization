import { useEffect } from 'react';
import BarGraph from "../charts/BarGraph";
import LineChart from '../charts/LineChart';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { extractFeatures } from '../utils/extractFeatures';
import { useAppContext } from '../context/AppContext';
import { getCookie, savePreferences, eraseCookies } from '../utils/handleCookies';
import { logout } from '../../auth/authService';
import Navbar from '../Navbar/Navbar';
import Card from '../Card/Card';
import './Dashboard.css'
import CardContainer from '../CardContainer/CardContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const Dashboard = ({user}) => {
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
        setLoading
    } = useAppContext();

    const convertDate = (str) => {
        const date = new Date(str);
        return [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join("/");
    };

    console.log(user)

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
        toast("Link copied to clipboard!");
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
        toast("Saved preferences have been cleared!");
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
        <div>
            <Navbar>
                <button className="navbar-button" onClick={handleShareView}>Share View</button>
                <button className="navbar-button" onClick={handleLogout}>Logout</button>
                <button className="navbar-button" onClick={clearPreferences}>Clear Preferences</button>
                <ToastContainer />
            </Navbar>
            <CardContainer>
            <Card title={"Date Range Filter"}>
            <DateRangePicker ranges={[dateRange]} onChange={handleChange} />
            </Card>
            <Card title={"Filters"}>
            <div className='filter-container'>
            <label style={{ display: 'block', marginBottom: '20px'}}>
                    Age
                    <br></br>
                    <select className={`custom-select ${age ? 'selected' : ''}`} value={age} onChange={(e) => setAge(e.target.value)}>
                        <option value="">All values</option>
                        {uniqueAges.map((ageValue) => (
                            <option key={ageValue} value={ageValue}>{ageValue}</option>
                        ))}
                    </select>
            </label>
            <label style={{ display: 'block', marginBottom: '20px'}}>
                Gender
                <br></br>
                <select className={`custom-select ${age ? 'selected' : ''}`} value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">All</option>
                    {uniqueGenders.map((genderValue) => (
                        <option key={genderValue} value={genderValue}>{genderValue}</option>
                    ))}
                </select>
            </label>
            </div>
            </Card>
            <Card title={"Bar Graph"}>
                <BarGraph data={data} features={features} setSelectedFeature={setSelectedFeature} />
            </Card>
            {selectedFeature &&
            (<Card title={"Line Graph"} width={"100%"}>
                <LineChart data={data} feature={selectedFeature} />
            </Card>)}
            </CardContainer>
            </div>
    );
};

export default Dashboard;
