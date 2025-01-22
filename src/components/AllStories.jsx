import React, { useState, useEffect } from 'react';
import { getUserStories } from '../api/storyService'; // Adjust the import based on your structure
import { useNavigate } from 'react-router-dom'; // Change this line
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import the left arrow icon
import './AllStories.css'; // Create a CSS file for styles
import { supabase } from '../lib/supabase'; // Import Supabase client
import StoryModal from './StoryModal'; // Import StoryModal
import { getUserProfile } from '../api/authService';

function AllStories({ userId }) {
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null); // State to hold the current story for the modal
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [currentPage, setCurrentPage] = useState(0);
  const storiesPerPage = 10;
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [quizRecords, setQuizRecords] = useState([]); // Ensure this state is defined
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      const allStories = await getUserStories(userId);
      setStories(allStories);
      loadUserProfile();
      loadQuizRecords();
    };
    fetchStories();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadQuizRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_records')
        .select('story_id, score')
        .eq('user_id', userId);

      if (error) throw error;
      setQuizRecords(data); // Store quiz records in state
    } catch (error) {
      console.error('Error loading quiz records:', error);
    }
  };

  const getBestScore = (storyId) => {
    // Assuming you have a way to get quiz records for the user
    const scores = quizRecords
      .filter(record => record.story_id === storyId)
      .map(record => record.score);
    return scores.length > 0 ? Math.max(...scores) : null; // Return the best score or null
  };

  const handleStoryClick = (story) => {
    setCurrentStory(story); // Set the current story
    setShowModal(true); // Show the modal
  };

  const paginatedStories = stories.slice(currentPage * storiesPerPage, (currentPage + 1) * storiesPerPage);

  return (
    <div className="all-stories">
      <div className="header-container"> {/* Flex container for title and back button */}
        <span className="back-icon" onClick={() => navigate('/')}>
          <FontAwesomeIcon icon={faArrowLeft} /> {/* Back icon */}
        </span>
        <h2>All Stories</h2>
      </div>
      <div className="stories-grid">
        {paginatedStories.map((story) => {
          const bestScore = getBestScore(story.id); // Get the best score for the story
          const scoreColor = bestScore !== null && bestScore > 80 ? 'green' : 'purple'; // Determine color based on score
          const scoreBgColor = bestScore !== null && bestScore > 80 ? 'rgb(216 235 221 / 80%)' : 'rgb(246 223 255 / 80%)'; // Determine background color based on score

          return (
            <div key={story.id} className="story-card" onClick={() => handleStoryClick(story)}>
              <h4 className="story-title">{story.title}</h4>
              <div className="story-info">
                <span className="lexile-badge">Lexile: {story.lexile_level}</span>
                {bestScore !== null && (
                  <span className="best-score" style={{ color: scoreColor, backgroundColor: scoreBgColor }}>
                    Best: {bestScore}%
                  </span>
                )}
                <span className="creation-date">{new Date(story.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(stories.length / storiesPerPage) - 1))} disabled={(currentPage + 1) * storiesPerPage >= stories.length}>
          Next
        </button>
      </div>

      {/* Story Modal */}
      {showModal && currentStory && (
        <StoryModal 
          story={currentStory} 
          userId={userId}
          onClose={() => setShowModal(false)} 
          userLexile={userProfile.lexile} // Pass userLexile if needed
          bestScore={getBestScore(currentStory.id)}
        />
      )}
    </div>
  );
}

export default AllStories; 