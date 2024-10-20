import React from 'react';
import './Navbar.css';

const Navbar = ({ children }) => {
    return (
        <nav className="navbar">
            <div className="navbar-title">Hi, Welcome to Dashboard</div>
            <div className="navbar-buttons">
                {children}
            </div>
        </nav>
    );
};

export default Navbar;
