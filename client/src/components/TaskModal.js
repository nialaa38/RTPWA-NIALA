import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaSave, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import './TaskModal.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function TaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    status: 'pending',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a task title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (task) {
        await axios.put(`${API_URL}/api/tasks/${task.id}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/tasks`, formData, config);
      }

      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay-new" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header-new">
          <div className="modal-title">
            <span className="modal-icon">{task ? '✏️' : '➕'}</span>
            <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="modal-error">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group-new">
            <label htmlFor="title">
              Task Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              className={error && !formData.title.trim() ? 'error' : ''}
            />
          </div>

          <div className="form-group-new">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description..."
              rows="3"
            />
          </div>

          <div className="form-row-new">
            <div className="form-group-new">
              <label htmlFor="category">Category</label>
              <div className="select-wrapper">
                <select 
                  id="category"
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                >
                  <option value="training">🏋️ Training</option>
                  <option value="game">🏐 Game</option>
                  <option value="equipment">🧤 Equipment</option>
                  <option value="team_meeting">👥 Team Meeting</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>
            </div>

            <div className="form-group-new">
              <label htmlFor="priority">Priority</label>
              <div className="priority-selector">
                <button
                  type="button"
                  className={`priority-btn low ${formData.priority === 'low' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, priority: 'low' })}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`priority-btn medium ${formData.priority === 'medium' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, priority: 'medium' })}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`priority-btn high ${formData.priority === 'high' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, priority: 'high' })}
                >
                  High
                </button>
              </div>
            </div>
          </div>

          <div className="form-row-new">
            <div className="form-group-new">
              <label htmlFor="status">Status</label>
              <div className="status-selector">
                <button
                  type="button"
                  className={`status-btn pending ${formData.status === 'pending' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, status: 'pending' })}
                >
                  ⏳ Pending
                </button>
                <button
                  type="button"
                  className={`status-btn in_progress ${formData.status === 'in_progress' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, status: 'in_progress' })}
                >
                  🔄 In Progress
                </button>
                <button
                  type="button"
                  className={`status-btn completed ${formData.status === 'completed' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, status: 'completed' })}
                >
                  ✅ Completed
                </button>
              </div>
            </div>

            <div className="form-group-new">
              <label htmlFor="due_date">Due Date</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions-new">
            <button type="button" className="btn-cancel-new" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save-new" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> {task ? 'Update Task' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
