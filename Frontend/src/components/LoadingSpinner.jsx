import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ text = 'Loading...', fullScreen = true }) => {
  return (
    <div className={`loading-spinner-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="spinner-wrapper">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">{text}</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
