import React, { useState } from 'react';
import Quiz from './Quiz';
import './StoryModal.css';

function StoryModal({ story, userId, onClose, userLexile }) {
  const [showQuiz, setShowQuiz] = useState(false);

  if (!story) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="story-title">{story.title}</h2>
          <span className="lexile-badge">{story.lexile_level}</span>
          <div className="modal-actions">
            <button 
              className="take-quiz-button"
              onClick={() => setShowQuiz(prev => !prev)}
            >
              {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
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
                  <li key={index}>
                    {word.word}: <span className="description">{word.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showQuiz && (
            <div className="quiz-container">
              <Quiz 
                story={story} 
                userId={userId}
                onClose={() => setShowQuiz(false)}
                onComplete={(score) => {
                  console.log('Quiz completed with score:', score);
                  // 这里可以添加保存分数的逻辑
                }}
                userLexile={userLexile}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryModal;
