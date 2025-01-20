import React from 'react';
import './StoryModal.css';

function StoryModal({ story, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="story-content">
          <h2>{story.title}</h2>
          <div className="story-text">
            {story.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryModal;
