import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainContent from './components/MainContent';
import Auth from './components/Auth';
import { getCurrentUser } from './api/authService';
import AllStories from './components/AllStories';
import Loading from './components/Loading';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false); // Set loading to false after data is loaded
    };
    loadData();
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
    return (
      <Router>
        <Loading />
      </Router>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent user={user} />} />
        <Route path="/all-stories" element={<AllStories userId={user?.id} />} />
      </Routes>
    </Router>
  );
}

export default App;