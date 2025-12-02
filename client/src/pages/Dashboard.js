import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaVolleyballBall, FaTasks, FaCalendarAlt, FaTrophy, FaChartLine, FaArrowRight, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import OnboardingTutorial from '../components/OnboardingTutorial';
import AchievementsModal from '../components/AchievementsModal';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowOnboarding(true);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const tasksData = response.data;
      setTasks(tasksData);
      
      const completedTasks = tasksData.filter(t => t.status === 'completed');
      const trainingSessions = completedTasks.filter(t => t.category === 'training').length;
      const gamesPlayed = completedTasks.filter(t => t.category === 'game').length;
      
      setStats({
        total: tasksData.length,
        pending: tasksData.filter(t => t.status === 'pending').length,
        completed: completedTasks.length,
        inProgress: tasksData.filter(t => t.status === 'in_progress').length,
        trainingSessions,
        gamesPlayed,
        equipmentChecks: completedTasks.filter(t => t.category === 'equipment').length,
        teamMeetings: completedTasks.filter(t => t.category === 'team_meeting').length
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 4);

  const recentCompleted = tasks
    .filter(t => t.status === 'completed')
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
        <div className="shape shape-6"></div>
      </div>

      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
      <Navbar setAuth={setAuth} />
      
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>{getGreeting()}, {user?.username || 'Player'}! 🏐</h1>
            <p>Ready to crush your volleyball goals today?</p>
          </div>
          <div className="welcome-actions">
            <button className="btn-primary-action" onClick={() => navigate('/tasks')}>
              <FaTasks /> Manage Tasks
            </button>
            <button className="btn-secondary-action" onClick={() => setShowAchievements(true)}>
              <FaTrophy /> Achievements
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card-new primary">
            <div className="stat-card-icon">
              <FaChartLine />
            </div>
            <div className="stat-card-content">
              <span className="stat-value">{completionRate}%</span>
              <span className="stat-label">Completion Rate</span>
            </div>
            <div className="stat-card-progress">
              <div className="progress-bar" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>

          <div className="stat-card-new">
            <div className="stat-card-icon training">
              <span>🏋️</span>
            </div>
            <div className="stat-card-content">
              <span className="stat-value">{stats.trainingSessions || 0}</span>
              <span className="stat-label">Training Sessions</span>
            </div>
          </div>

          <div className="stat-card-new">
            <div className="stat-card-icon games">
              <FaVolleyballBall />
            </div>
            <div className="stat-card-content">
              <span className="stat-value">{stats.gamesPlayed || 0}</span>
              <span className="stat-label">Games Played</span>
            </div>
          </div>

          <div className="stat-card-new">
            <div className="stat-card-icon pending">
              <FaClock />
            </div>
            <div className="stat-card-content">
              <span className="stat-value">{stats.pending || 0}</span>
              <span className="stat-label">Pending Tasks</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Upcoming Tasks */}
          <div className="dashboard-card upcoming-card">
            <div className="card-header">
              <h2><FaCalendarAlt /> Upcoming Tasks</h2>
              <button className="btn-link" onClick={() => navigate('/tasks')}>
                View All <FaArrowRight />
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-state">
                  <FaSpinner className="spinner" />
                  <p>Loading tasks...</p>
                </div>
              ) : upcomingTasks.length > 0 ? (
                <div className="task-list-new">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className="task-item-new">
                      <div className={`task-category-badge ${task.category}`}>
                        {getCategoryIcon(task.category)}
                      </div>
                      <div className="task-content">
                        <h4>{task.title}</h4>
                        <div className="task-meta">
                          <span className={`priority-dot ${task.priority}`}></span>
                          <span className="priority-text">{task.priority}</span>
                          <span className="task-date-new">
                            {task.due_date ? formatDate(task.due_date) : 'No due date'}
                          </span>
                        </div>
                      </div>
                      <div className={`task-status-badge ${task.status}`}>
                        {task.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FaCalendarAlt />
                  <p>No upcoming tasks</p>
                  <button className="btn-add-task" onClick={() => navigate('/tasks')}>
                    Add Your First Task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="dashboard-card stats-panel">
            <div className="card-header">
              <h2><FaTrophy /> Activity Summary</h2>
            </div>
            <div className="card-body">
              <div className="activity-stats">
                <div className="activity-item">
                  <div className="activity-icon completed">
                    <FaCheckCircle />
                  </div>
                  <div className="activity-info">
                    <span className="activity-value">{stats.completed || 0}</span>
                    <span className="activity-label">Completed</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon in-progress">
                    <FaSpinner />
                  </div>
                  <div className="activity-info">
                    <span className="activity-value">{stats.inProgress || 0}</span>
                    <span className="activity-label">In Progress</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon equipment">
                    <span>🧤</span>
                  </div>
                  <div className="activity-info">
                    <span className="activity-value">{stats.equipmentChecks || 0}</span>
                    <span className="activity-label">Equipment</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon meetings">
                    <span>👥</span>
                  </div>
                  <div className="activity-info">
                    <span className="activity-value">{stats.teamMeetings || 0}</span>
                    <span className="activity-label">Meetings</span>
                  </div>
                </div>
              </div>

              {recentCompleted.length > 0 && (
                <div className="recent-completed">
                  <h3>Recently Completed</h3>
                  {recentCompleted.map(task => (
                    <div key={task.id} className="completed-item">
                      <FaCheckCircle className="check-icon" />
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => navigate('/tasks')}>
            <span className="action-icon">📝</span>
            <span className="action-text">New Task</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/game')}>
            <span className="action-icon">🎮</span>
            <span className="action-text">Play Game</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/profile')}>
            <span className="action-icon">👤</span>
            <span className="action-text">Profile</span>
          </button>
          <button className="quick-action-btn" onClick={() => setShowAchievements(true)}>
            <span className="action-icon">🏆</span>
            <span className="action-text">Achievements</span>
          </button>
        </div>
      </div>

      {showAchievements && (
        <AchievementsModal 
          isOpen={showAchievements} 
          onClose={() => setShowAchievements(false)} 
          stats={stats} 
        />
      )}
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    training: '🏋️',
    game: '🏐',
    equipment: '🧤',
    team_meeting: '👥',
    other: '📌'
  };
  return icons[category] || icons.other;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export default Dashboard;
