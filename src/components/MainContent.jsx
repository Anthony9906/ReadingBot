import React, { useState, useEffect } from 'react';
import './MainContent.css';
import StoryModal from './StoryModal';
import { generateAndSaveStory, getUserStories } from '../api/storyService';

function MainContent({ user }) {  // 添加 user prop
  const [story, setStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedStories, setSavedStories] = useState([]);

  useEffect(() => {
    loadSavedStories();
  }, []);

  const loadSavedStories = async () => {
    try {
      const stories = await getUserStories(user.id);  // 使用 user.id
      setSavedStories(stories);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const handleReadNew = async () => {
    try {
      setIsLoading(true);
      const newStory = await generateAndSaveStory(user.id);  // 使用 user.id
      setStory(newStory[0]);
      setIsModalOpen(true);
      loadSavedStories(); // 重新加载故事列表
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="start-reading-card">
        <h2>Start Reading</h2>
        <p>AI read a story for you and level up your lexile</p>
        <button 
          className="read-new-button" 
          onClick={handleReadNew}
          disabled={isLoading}
        >
          {isLoading ? 'Generating Story...' : 'Read New'}
        </button>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Generating your story...</p>
        </div>
      )}
      {isModalOpen && (
        <StoryModal story={story} onClose={() => setIsModalOpen(false)} />
      )}
      <div className="readings-section">
        <h2>Your Stories</h2>
        {savedStories.map((story) => (
          <div key={story.id} className="reading-card">
            <div className="reading-card-content">
              <h3>{story.title}</h3>
              <p>Created at: {new Date(story.created_at).toLocaleDateString()}</p>
            </div>
            <span className="arrow-icon">&gt;</span>
          </div>
        ))}
      </div>
    </main>
  );
}

export default MainContent;