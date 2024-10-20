import './App.css';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Dashboard from './components/Dashboard/Dashboard';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import SharedView from './components/SharedView';
import NotFound from './components/NotFound';
import Signup from './components/Signup';
import Login from './components/Login';
import { AppProvider } from './components/context/AppContext';

function App() {
  return (
    <AppProvider>
      <AppRoutes/>
    </AppProvider>
  );
}
function AppRoutes() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [user]);

    return (
        <div className="App">
            <header className="App-header">
                <BrowserRouter>
                    <AppProvider>
                        <Routes>
                            <Route exact path="/dashboard" element={ user ? <Dashboard user={user}/> : <Navigate to="/login"/>} />
                            <Route exact path="/" element={ user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login"/>} />
                            <Route path="/shared/view" element={ user ? <SharedView/> : <Navigate to="/login" state={{ from: '/shared/view', search: window.location.search }}/>} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </AppProvider>
                </BrowserRouter>
            </header>
        </div>
    );
}

export default App;
