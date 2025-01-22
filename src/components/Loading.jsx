import React from 'react';
import './Loading.css'; // Import CSS for styling

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading; 