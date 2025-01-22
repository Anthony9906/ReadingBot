import React, { useState, useRef } from 'react';
import Quiz from './Quiz';
import './StoryModal.css';

function StoryModal({ story, userId, onClose, userLexile, bestScore }) {
  const quizRef = useRef(null); // Create a ref for the quiz section
  const [showQuiz, setShowQuiz] = React.useState(false); // State to control quiz visibility

  const handleTakeQuiz = () => {
    setShowQuiz(true); // Show the quiz
    // Use setTimeout to ensure the quiz section is rendered before scrolling
    setTimeout(() => {
      if (quizRef.current) {
        quizRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the quiz section
      }
    }, 0); // Delay to allow rendering
  };

  if (!story) return null;

  const scoreColor = bestScore !== null && bestScore > 80 ? 'green' : 'purple'; // Determine color based on score
  const scoreBgColor = bestScore !== null && bestScore > 80 ? 'rgb(216 235 221 / 80%)' : 'rgb(246 223 255 / 80%)'; // Determine color based on score

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="story-title">{story.title}</h2>
          <span className="lexile-badge">{story.lexile_level}</span>
          {bestScore !== null && (
            <span className="best-score" style={{ color: scoreColor, backgroundColor: scoreBgColor }}>
              Best: {bestScore}%
            </span>
          )}
          <div className="modal-actions">
            <button className="take-quiz-button" onClick={handleTakeQuiz}>
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
                  <li key={index}>
                    {word.word}: <span className="description">{word.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showQuiz && (
            <div ref={quizRef} className="quiz-container">
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
