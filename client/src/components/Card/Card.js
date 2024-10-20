import React from 'react';
import './Card.css';

const Card = ({ title, children, height, width }) => {
    const cardStyle = {
        height: height ? height : 'auto',
        width: width ? width : 'auto',
    };
    return (
        <div className="card" style={cardStyle}>
            <h2 className="card-title">{title}</h2>
            <p className="card-content">
                {children}
            </p>
        </div>
    );
};

export default Card;
