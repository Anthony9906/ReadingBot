import React, { useState, useEffect } from 'react';
import MainContent from './components/MainContent';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import { getCurrentUser } from './api/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  return (
    <div className="App">
      <Header user={user} />
      <div className="main-container">
        <MainContent user={user} />
        <Sidebar user={user} />
      </div>
    </div>
  );
}

export default App;