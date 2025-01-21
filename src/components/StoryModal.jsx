import React, { useState } from 'react';
import Quiz from './Quiz';
import './StoryModal.css';

function StoryModal({ story, user, onClose }) {
  const [showQuiz, setShowQuiz] = useState(false);

  if (!story) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{story.title}</h2>
          <div className="modal-actions">
            <button 
              className="take-quiz-button"
              onClick={() => setShowQuiz(true)}
            >
              Take Quiz
            </button>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
        </div>
        <div className="modal-body">
          <div className="story-text">
            {story.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          {story.vocabulary && story.vocabulary.length > 0 && (
            <div className="vocabulary-section">
              <h3>Key Vocabulary</h3>
              <ul className="vocabulary-list">
                {story.vocabulary.map((word, index) => (
                  <li key={index}>{word}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {showQuiz && (
        <Quiz 
          story={story} 
          userId={user.id}
          onClose={() => setShowQuiz(false)}
          onComplete={(score) => {
            console.log('Quiz completed with score:', score);
            // 这里可以添加保存分数的逻辑
          }}
        />
      )}
    </div>
  );
}

export default StoryModal;
