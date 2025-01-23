import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/authService';
import { getUserStats } from '../api/statsService'; // 假设统计信息的API在这里
import './Sidebar.css';
import { FaBook, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

function Sidebar({ user }) {
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState({
    totalStories: 0,
    completedQuizzes: 0,
    lexileIncrease: 0
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (user && user.id) {
          const profile = await getUserProfile(user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    const loadUserStats = async () => {
      try {
        if (user && user.id) {
          const stats = await getUserStats(user.id);
          setUserStats(stats);
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    loadUserProfile();
    loadUserStats();
  }, [user]);

  return (
    <div className="sidebar">
      <div className="stats-container">
        <div className="stat-item">
          <FaBook className="stat-icon" />
          <div className="stat-label">STORIES</div>
          <div className="stat-value">{userStats.totalStories}</div>
        </div>
        <div className="stat-item">
          <FaClipboardCheck className="stat-icon" />
          <div className="stat-label">QUIZZES</div>
          <div className="stat-value">{userStats.completedQuizzes}</div>
        </div>
        <div className="stat-item">
          <FaChartLine className="stat-icon" />
          <div className="stat-label">LEXILE+</div>
          <div className="stat-value">{userStats.lexileIncrease}</div>
        </div>
      </div>
      <div className="lexile-container">
        <div className="lexile-value">{userProfile?.lexile || 0}</div>
        <div className="lexile-label">Lexile</div>
      </div>
      <div className="ar-container">
        <div className="ar-value">{userProfile?.ar || '2.3'}</div>
        <div className="ar-label">AR</div>
      </div>
      <div className="story-count">
        <p>You have read a total <span className="highlight">{userProfile?.monthly_stories || 0} stories</span> this month!</p>
      </div>
    </div>
  );
}

export default Sidebar;
