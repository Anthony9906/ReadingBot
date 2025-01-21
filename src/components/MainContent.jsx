import React, { useState, useEffect } from 'react';
import { generateAndSaveStory, getUserStories } from '../api/storyService';
import { getUserProfile } from '../api/authService';
import StoryModal from './StoryModal';
import { format } from 'date-fns';
import './MainContent.css';

function MainContent({ user }) {
  const [currentStory, setCurrentStory] = useState(null);
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user || !user.id) {
      console.error('User object is invalid or does not contain an id:', user);
      return; // 退出组件或显示错误信息
    }
    loadUserProfile();
    loadRecentStories();
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile({
        id: user.id,
        username: 'Username',
        lexile: '100L'
      });
    }
  };

  const loadRecentStories = async () => {
    try {
      const stories = await getUserStories(user.id);
      setRecentStories(stories.slice(0, 5)); // 只获取最近5个故事
    } catch (error) {
      console.error('Error loading recent stories:', error);
    }
  };

  const handleReadNew = async () => {
    const lexile = userProfile?.lexile || '100L';
    
    setLoading(true);
    try {
      const story = await generateAndSaveStory(user.id, lexile);
      setCurrentStory(story);
      setShowModal(true);
      loadRecentStories(); // 重新加载故事列表
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story) => {
    setCurrentStory(story);
    setShowModal(true);
  };

  return (
    <div className="main-content">
      <div className="content-header">
        <h2>Your Reading</h2>
        <button 
          onClick={handleReadNew} 
          className="read-new-button"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Read New'}
        </button>
      </div>
      
      {loading && (
        <div className="loading">
          Generating a story at your reading level ({userProfile?.lexile || '100L'})...
        </div>
      )}

      <div className="recent-stories">
        <h3>Recent Stories</h3>
        <div className="stories-grid">
          {recentStories.map((story) => (
            <div 
              key={story.id} 
              className="story-card"
              onClick={() => handleStoryClick(story)}
            >
              <h4 className="story-title">{story.title}</h4>
              <div className="story-info">
                <span className="lexile-badge">
                  {story.lexile_level}
                </span>
                <span className="vocab-count">
                  {story.vocabulary.length} words
                </span>
                <span className="creation-date">
                  {format(new Date(story.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
          {recentStories.length === 0 && (
            <div className="no-stories">
              No stories yet. Click "Read New" to generate your first story!
            </div>
          )}
        </div>
      </div>

      {showModal && currentStory && currentStory.questions && currentStory.questions.length > 0 && (
        <StoryModal 
          story={currentStory} 
          user={user}
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

export default MainContent;