import React, { useState } from 'react';
import { login } from '../auth/authService';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/dashboard';
  const search = location.state?.search || '';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(`${from}${search}`, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {(from !== '/dashboard' && search) ?
        <Link to="/signup" state={{ from, search }}>Don't have an account yet ? Signup </Link> : 
        <Link to="/signup" >Don't have an account yet ? Signup </Link>}
        
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
