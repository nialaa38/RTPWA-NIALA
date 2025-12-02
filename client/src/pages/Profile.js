import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaIdBadge, FaGoogle, FaTrophy, FaRedo } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import OnboardingTutorial from '../components/OnboardingTutorial';
import AchievementsModal from '../components/AchievementsModal';
import './Profile.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function Profile({ setAuth }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    trainingSessions: 0,
    gamesPlayed: 0,
    tasksCompleted: 0,
    equipmentChecks: 0,
    teamMeetings: 0,
    totalTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchUserStats();
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLoading(false);
      }
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const decodedUser = {
            id: payload.id,
            username: payload.username,
            email: payload.email
          };
          setUser(decodedUser);
          localStorage.setItem('user', JSON.stringify(decodedUser));
          fetchUserStats();
        } catch (error) {
          console.error('Error decoding token:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const tasks = response.data;
      const completedTasks = tasks.filter(t => t.status === 'completed');
      
      setStats({
        trainingSessions: completedTasks.filter(t => t.category === 'training').length,
        gamesPlayed: completedTasks.filter(t => t.category === 'game').length,
        tasksCompleted: completedTasks.length,
        equipmentChecks: completedTasks.filter(t => t.category === 'equipment').length,
        teamMeetings: completedTasks.filter(t => t.category === 'team_meeting').length,
        totalTasks: tasks.length
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="error-screen">
          <h2>No user data found</h2>
          <button onClick={() => window.location.href = '/login'} className="btn-login">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <Navbar setAuth={setAuth} />
      
      <div className="profile-content">
        <div className="profile-grid">
          {/* Profile Card */}
          <div className="profile-card-main">
            <div className="profile-avatar-section">
              {user.profile_picture ? (
                <img src={user.profile_picture} alt={user.username} className="avatar-img" />
              ) : (
                <div className="avatar-placeholder-new">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="profile-name-section">
                <h1>{user.username || 'User'}</h1>
                <span className="account-badge">
                  {user.google_id ? <><FaGoogle /> Google Account</> : '🔐 Local Account'}
                </span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user.email || 'Not set'}</span>
                </div>
              </div>
              <div className="detail-item">
                <FaIdBadge className="detail-icon" />
                <div className="detail-content">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value">#{user.id}</span>
                </div>
              </div>
            </div>

            <div className="profile-actions-new">
              <button className="action-btn-profile" onClick={() => setShowAchievements(true)}>
                <FaTrophy /> View Achievements
              </button>
              <button 
                className="action-btn-profile secondary"
                onClick={() => {
                  localStorage.removeItem('hasSeenTutorial');
                  setShowOnboarding(true);
                }}
              >
                <FaRedo /> Restart Tutorial
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-card">
            <h2>Performance Overview</h2>
            
            <div className="completion-ring">
              <svg viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r="45" />
                <circle 
                  className="ring-progress" 
                  cx="50" cy="50" r="45"
                  style={{ strokeDashoffset: 283 - (283 * completionRate / 100) }}
                />
              </svg>
              <div className="ring-text">
                <span className="ring-value">{completionRate}%</span>
                <span className="ring-label">Complete</span>
              </div>
            </div>

            <div className="stats-summary">
              <div className="summary-item">
                <span className="summary-value">{stats.totalTasks}</span>
                <span className="summary-label">Total Tasks</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{stats.tasksCompleted}</span>
                <span className="summary-label">Completed</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{stats.totalTasks - stats.tasksCompleted}</span>
                <span className="summary-label">Remaining</span>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="activity-card">
            <h2>Activity Breakdown</h2>
            <div className="activity-grid">
              <div className="activity-stat" onClick={() => setShowAchievements(true)}>
                <span className="activity-emoji">🏋️</span>
                <span className="activity-value">{stats.trainingSessions}</span>
                <span className="activity-label">Training</span>
              </div>
              <div className="activity-stat" onClick={() => setShowAchievements(true)}>
                <span className="activity-emoji">🏐</span>
                <span className="activity-value">{stats.gamesPlayed}</span>
                <span className="activity-label">Games</span>
              </div>
              <div className="activity-stat" onClick={() => setShowAchievements(true)}>
                <span className="activity-emoji">🧤</span>
                <span className="activity-value">{stats.equipmentChecks}</span>
                <span className="activity-label">Equipment</span>
              </div>
              <div className="activity-stat" onClick={() => setShowAchievements(true)}>
                <span className="activity-emoji">👥</span>
                <span className="activity-value">{stats.teamMeetings}</span>
                <span className="activity-label">Meetings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
      {showAchievements && <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} stats={stats} />}
    </div>
  );
}

export default Profile;
