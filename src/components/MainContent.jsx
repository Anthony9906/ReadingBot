import React, { useState, useEffect } from 'react';
import { generateAndSaveStory, getUserStories } from '../api/storyService';
import { getUserProfile } from '../api/authService';
import StoryModal from './StoryModal';
import { format } from 'date-fns';
import './MainContent.css';
import { supabase } from '../lib/supabase'; // Import Supabase client
import { FaBook } from 'react-icons/fa'; // Import an icon for the reading section

function MainContent({ user, setUserLexile }) {
  const [currentStory, setCurrentStory] = useState(null);
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quizRecords, setQuizRecords] = useState([]); // Ensure this state is defined

  useEffect(() => {
    if (!user || !user.id) {
      console.error('User object is invalid or does not contain an id:', user);
      return;
    }
    loadUserProfile();
    loadRecentStories();
    loadQuizRecords(); // Load quiz records
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadRecentStories = async () => {
    try {
      const stories = await getUserStories(user.id);
      setRecentStories(stories.slice(0, 5)); // Get the most recent 5 stories
    } catch (error) {
      console.error('Error loading recent stories:', error);
    }
  };

  const loadQuizRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_records')
        .select('story_id, score')
        .eq('user_id', user.id);

      if (error) throw error;
      setQuizRecords(data); // Store quiz records in state
    } catch (error) {
      console.error('Error loading quiz records:', error);
    }
  };

  // Define the getBestScore function
  const getBestScore = (storyId) => {
    const scores = quizRecords
      .filter(record => record.story_id === storyId)
      .map(record => record.score);
    return scores.length > 0 ? Math.max(...scores) : null; // Return the best score or null
  };

  const handleReadNew = async () => {
    const lexile = userProfile?.lexile || '100L';
    console.log('Lexile for GPT:'+lexile);
    setLoading(true);
    try {
      const story = await generateAndSaveStory(user.id, lexile);
      setCurrentStory(story);
      setShowModal(true);

      loadRecentStories();
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
        <h2 className="reading-title">
          <FaBook className="reading-icon" /> Your Reading
        </h2>
        <p className="reading-subtitle">AI reads a story for you and levels up your lexile</p>
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
          {recentStories.map((story) => {
            const bestScore = getBestScore(story.id); // Get the best score for the story
            const scoreColor = bestScore !== null && bestScore > 80 ? 'green' : 'purple'; // Determine color based on score

            return (
              <div 
                key={story.id} 
                className="story-card"
                onClick={() => handleStoryClick(story)}
              >
                {bestScore !== null && (
                  <div className="best-score" style={{ color: scoreColor }}>
                    Best: {bestScore}%
                  </div>
                )}
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
            );
          })}
          {recentStories.length === 0 && (
            <div className="no-stories">
              No stories yet. Click "Read New" to generate your first story!
            </div>
          )}
        </div>
      </div>

      {showModal && currentStory && (
        <StoryModal 
          story={currentStory} 
          userId={user.id}
          userLexile={userProfile.lexile}
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

export default MainContent;