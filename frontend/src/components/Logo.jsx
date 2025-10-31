import { Rocket } from 'lucide-react';
import React from 'react';
import './Logo.css';

const apiUrl = import.meta.env.VITE_FRONTEND_URL;

const Logo = () => {
  const handleClick = () => {
    window.location.href = apiUrl;
  };
  return (
    <div className="logo-container" onClick={handleClick} style={{cursor: 'pointer'}}>
      <div className="logo-icon-wrapper">
        <Rocket size={24} className="logo-icon" />
      </div>
      <span className="logo-text">
        Launch<span>Pad</span>
      </span>
    </div>
  );
};

export default Logo;
