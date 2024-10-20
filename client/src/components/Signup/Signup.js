// src/Signup.js
import React, { useState } from 'react';
import { signUp } from '../../auth/authService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/dashboard';
  const search = location.state?.search || '';

  console.log(from, " ", search)

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate(`${from}${search}`, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
       <Card title={"Sign Up"}>
       <form onSubmit={handleSignUp} className='signup-form'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signup-input"
        />
        <button type="submit" className="signup-button">Sign Up</button>
        {(from !== '/dashboard' && search) ?
        <Link to="/login" state={{ from, search }} className="login-link">Already have an account ? Login </Link> : 
        <Link to="/login" className="login-link">Already have an account ? Login </Link>}
        {error && <p className="error-message">{error}</p>}
      </form>
       </Card>
    </div>
  );
};

export default Signup;
