import React, { useState } from 'react';
import { login } from '../../auth/authService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import './Login.css';

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
    <div className="login-container">
      <Card title={"Login"}>
        <form onSubmit={handleLogin} className='login-form'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
          <Link to="/signup" state={{ from, search }} className="signup-link">
            Don't have an account yet? Signup
          </Link>
          {error && <p className="error-message">{error}</p>}
        </form>
      </Card>
    </div>
  );
};

export default Login;
