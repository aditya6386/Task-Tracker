import React, { useState } from 'react';
import { Edit3, Trash2, Check, Calendar, Flag } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TaskItem component for displaying individual tasks
 * @param {Object} props
 * @param {Object} props.task - Task object
 * @param {Function} props.onToggleComplete - Function to toggle task completion
 * @param {Function} props.onDelete - Function to delete task
 * @param {Function} props.onEdit - Function to edit task
 */
const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handle task completion toggle
   */
  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  /**
   * Handle task deletion with confirmation
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      onDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  /**
   * Format date for display
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  /**
   * Get priority color class
   * @param {string} priority - Priority level
   * @returns {string} CSS class name
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  return (
    <motion.div 
      className={`task-item ${task.completed ? 'completed' : ''}`}
      layout
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 20
      }}
    >
      <div className="task-content">
        <div className="task-header">
          <div className="task-checkbox-container">
            <motion.button
              onClick={handleToggleComplete}
              className={`task-checkbox ${task.completed ? 'checked' : ''}`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Check size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          
          <div className="task-main">
            <motion.h3 
              className={`task-title ${task.completed ? 'completed' : ''}`}
              layout
            >
              {task.title}
            </motion.h3>
            
            <motion.div 
              className="task-meta"
              layout
            >
              <motion.span 
                className={`task-priority ${getPriorityColor(task.priority)}`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Flag size={12} />
                {task.priority}
              </motion.span>
              <motion.span 
                className="task-date"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Calendar size={12} />
                {formatDate(task.createdAt)}
              </motion.span>
            </motion.div>
          </div>
        </div>

        <motion.p 
          className={`task-description ${task.completed ? 'completed' : ''}`}
          layout
        >
          {task.description}
        </motion.p>

        <AnimatePresence>
          {task.updatedAt > task.createdAt && (
            <motion.div 
              className="task-updated"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="updated-text">
                Updated: {formatDate(task.updatedAt)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="task-actions">
        <motion.button
          onClick={() => onEdit(task)}
          className="action-button edit-button"
          aria-label="Edit task"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Edit3 size={16} />
        </motion.button>
        
        <motion.button
          onClick={() => setShowDeleteConfirm(true)}
          className="action-button delete-button"
          aria-label="Delete task"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Trash2 size={16} />
        </motion.button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            className="delete-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="delete-confirm-modal"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h4>Delete Task</h4>
              <p>Are you sure you want to delete "{task.title}"?</p>
              <div className="delete-confirm-actions">
                <motion.button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="confirm-delete-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {isDeleting ? (
                    <>
                      <motion.div 
                        className="spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="cancel-delete-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskItem;