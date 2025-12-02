import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaCalendarAlt, FaSpinner, FaTasks, FaCheckCircle, FaClock, FaChartBar } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import './Tasks.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function Tasks({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    trainingSessions: 0,
    gamesPlayed: 0,
    completed: 0,
    total: 0
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  useEffect(() => {
    filterTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, filter, categoryFilter, searchQuery]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterTasks = () => {
    let result = [...tasks];
    
    if (filter !== 'all') {
      result = result.filter(t => t.status === filter);
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }
    
    if (searchQuery) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTasks(result);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSaveTask = () => {
    setShowModal(false);
    fetchTasks();
    fetchStats();
  };

  const getStatusCount = (status) => {
    if (status === 'all') return tasks.length;
    return tasks.filter(t => t.status === status).length;
  };

  return (
    <div className="tasks-page">
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
        <div className="shape shape-6"></div>
      </div>

      <Navbar setAuth={setAuth} />
      
      <div className="tasks-content">
        {/* Header Section */}
        <div className="tasks-header">
          <div className="header-left">
            <h1><FaTasks /> Task Manager</h1>
            <p>Organize and track your volleyball activities</p>
          </div>
          <button className="btn-create-new" onClick={handleCreateTask}>
            <FaPlus /> New Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="mini-stat-card">
            <div className="mini-stat-icon training">🏋️</div>
            <div className="mini-stat-info">
              <span className="mini-stat-value">{stats.trainingSessions || 0}</span>
              <span className="mini-stat-label">Training</span>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon games">🏐</div>
            <div className="mini-stat-info">
              <span className="mini-stat-value">{stats.gamesPlayed || 0}</span>
              <span className="mini-stat-label">Games</span>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon completed">
              <FaCheckCircle />
            </div>
            <div className="mini-stat-info">
              <span className="mini-stat-value">{stats.completed || 0}</span>
              <span className="mini-stat-label">Completed</span>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon total">
              <FaChartBar />
            </div>
            <div className="mini-stat-info">
              <span className="mini-stat-value">{stats.total || 0}</span>
              <span className="mini-stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              <option value="training">Training</option>
              <option value="game">Game</option>
              <option value="equipment">Equipment</option>
              <option value="team_meeting">Team Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="status-tabs">
          <button 
            className={`status-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All <span className="tab-count">{getStatusCount('all')}</span>
          </button>
          <button 
            className={`status-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <FaClock /> Pending <span className="tab-count">{getStatusCount('pending')}</span>
          </button>
          <button 
            className={`status-tab ${filter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setFilter('in_progress')}
          >
            <FaSpinner /> In Progress <span className="tab-count">{getStatusCount('in_progress')}</span>
          </button>
          <button 
            className={`status-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <FaCheckCircle /> Completed <span className="tab-count">{getStatusCount('completed')}</span>
          </button>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner-large" />
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <div key={task.id} className={`task-card-new ${task.status}`}>
                <div className="task-card-top">
                  <span className={`category-chip ${task.category}`}>
                    {getCategoryIcon(task.category)} {formatCategory(task.category)}
                  </span>
                  <span className={`priority-chip ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description || 'No description'}</p>
                
                <div className="task-card-footer">
                  <div className="task-info">
                    <span className={`status-indicator ${task.status}`}>
                      {getStatusIcon(task.status)}
                      {formatStatus(task.status)}
                    </span>
                    <span className="due-date">
                      <FaCalendarAlt />
                      {task.due_date ? formatDate(task.due_date) : 'No date'}
                    </span>
                  </div>
                  
                  <div className="task-actions-new">
                    <button 
                      className="action-btn edit" 
                      onClick={() => handleEditTask(task)}
                      title="Edit task"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-new">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>Create your first task to get started!</p>
            <button className="btn-create-empty" onClick={handleCreateTask}>
              <FaPlus /> Create Task
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
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

function formatCategory(category) {
  const names = {
    training: 'Training',
    game: 'Game',
    equipment: 'Equipment',
    team_meeting: 'Meeting',
    other: 'Other'
  };
  return names[category] || 'Other';
}

function formatStatus(status) {
  const names = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed'
  };
  return names[status] || status;
}

function getStatusIcon(status) {
  if (status === 'completed') return <FaCheckCircle />;
  if (status === 'in_progress') return <FaSpinner />;
  return <FaClock />;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default Tasks;
