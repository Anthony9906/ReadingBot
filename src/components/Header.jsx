import React, { useState } from 'react';
import { signOut, updateUserNickname } from '../api/authService';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';

function Header({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user.user_metadata?.nickname || 'Username');

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNicknameSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserNickname(nickname);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating nickname:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>Story Reader</h1>
      </div>
      <div className="user-section">
        {isEditing ? (
          <form onSubmit={handleNicknameSubmit} className="nickname-form">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="nickname-input"
              autoFocus
              placeholder="Enter nickname"
            />
            <button type="submit" className="save-button">Save</button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="user-info">
              <FaUserCircle className="user-avatar" />
              <span className="nickname" onClick={() => setIsEditing(true)}>
                {nickname}
              </span>
            </div>
            <button onClick={handleSignOut} className="logout-button">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
