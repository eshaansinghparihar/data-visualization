// src/Signup.js
import React, { useState } from 'react';
import { signUp } from '../auth/authService';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
    <div>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
        {(from !== '/dashboard' && search) ?
        <Link to="/login" state={{ from, search }}>Already have an account ? Login </Link> : 
        <Link to="/login">Already have an account ? Login </Link>}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
