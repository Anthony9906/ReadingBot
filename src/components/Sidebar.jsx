import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/authService';
import './Sidebar.css';
import { FaStar, FaBook, FaRegFileAlt } from 'react-icons/fa';

function Sidebar({ user }) {
  const [lexile, setLexile] = useState('100L');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile(user.id);
      if (profile?.lexile) {
        setLexile(profile.lexile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="stats-container">
        <div className="stat-item">
          <FaStar className="stat-icon" />
          <div className="stat-label">POINTS</div>
          <div className="stat-value">178</div>
        </div>
        <div className="stat-item">
          <FaBook className="stat-icon" />
          <div className="stat-label">GLOSSARY</div>
          <div className="stat-value">45</div>
        </div>
        <div className="stat-item">
          <FaRegFileAlt className="stat-icon" />
          <div className="stat-label">WORDS</div>
          <div className="stat-value">521</div>
        </div>
      </div>
      <div className="lexile-container">
        <div className="lexile-value">{lexile}</div>
        <div className="lexile-label">Lexile</div>
      </div>
      <div className="ar-container">
        <div className="ar-value">2.3</div>
        <div className="ar-label">AR</div>
      </div>
      <div className="story-count">
        <p>You have read a total <span className="highlight">24 stories</span> this month!</p>
      </div>
    </div>
  );
}

export default Sidebar;
