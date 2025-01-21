import React from 'react';
import './StoryModal.css';

function StoryModal({ story, onClose }) {
  if (!story) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{story.title}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
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

          {story.questions && story.questions.length > 0 && (
            <div className="questions-section">
              <h3>Comprehension Questions</h3>
              <div className="questions-list">
                {story.questions.map((qa, index) => (
                  <div key={index} className="question-item">
                    <p className="question">Q: {qa.question}</p>
                    <p className="answer">A: {qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryModal;
