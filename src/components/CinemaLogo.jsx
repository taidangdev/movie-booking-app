import React from 'react';

const CinemaLogo = ({ width = 50, height = 50, url }) => {
  return (
    <div style={{ 
      width, 
      height, 
      borderRadius: '50%', 
      overflow: 'hidden', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      border: '2px solid #ddd',
      backgroundColor: '#f0f2f5'
    }}>
      {url ? (
        <img src={url} alt="Cinema Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: '10px', color: '#888', fontWeight: 'bold' }}>LOGO</span>
      )}
    </div>
  );
};

export default CinemaLogo;
