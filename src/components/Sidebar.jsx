import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/authService';
import './Sidebar.css';

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
    <aside className="sidebar">
      <div className="stats-card">
        <div className="lexile-ar-container">
          <div className="lexile-card">
            <p className="lexile-value">{lexile}</p>
            <p className="lexile-label">Lexile</p>
          </div>
          <div className="ar-card">
            <p className="ar-value">1.0</p>
            <p className="ar-label">AR</p>
          </div>
        </div>
        <p className="stories-read">
          You have read a total <span className="stories-count">24</span> stories
          this month!
        </p>
        <div className="points-progress">
          <div className="progress-circle">
            <span className="points-value">37/50</span>
          </div>
          <p className="points-label">Points</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
