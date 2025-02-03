import React from 'react';
import './Loader.css';
import LightbulbIcon from '/android-chrome-512x512.png';

const Loader: React.FC = () => {
    return (
        <div className="loader-container">
            {/* Основной лоадер */}
            <img src={LightbulbIcon} alt="Loading" className="loader-icon" />
            <div className="loader-shadow" />

            {/* Светлячок и частицы */}
            <div className="firefly" />
            {[...Array(9)].map((_, i) => (
                <div key={i} className={`particle particle-${i}`} />
            ))}
        </div>
    );
};

export default Loader;