import './App.css';
import Dashboard from './components/Dashboard';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import SharedView from './components/SharedView';
import NotFound from './components/NotFound';
import { AppProvider } from './components/context/AppContext';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <BrowserRouter>
                    <AppProvider>
                        <Routes>
                            <Route exact path="/dashboard" element={<Dashboard />} />
                            <Route exact path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/shared/view" element={<SharedView />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </AppProvider>
                </BrowserRouter>
            </header>
        </div>
    );
}

export default App;
