import React from 'react';
import TaskItem from './TaskItem';
import { CheckCircle, Circle, Search as SearchIcon } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TaskList component for displaying a list of tasks
 * @param {Object} props
 * @param {Array} props.tasks - Array of tasks to display
 * @param {Function} props.onToggleComplete - Function to toggle task completion
 * @param {Function} props.onDelete - Function to delete task
 * @param {Function} props.onEdit - Function to edit task
 * @param {boolean} props.isLoading - Whether tasks are loading
 * @param {string} props.searchTerm - Current search term
 * @param {string} props.filter - Current filter status
 */
const TaskList = ({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  isLoading = false,
  searchTerm = '',
  filter = 'all'
}) => {
  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <motion.div 
        className="task-list-loading"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading tasks...</p>
      </motion.div>
    );
  }

  /**
   * Empty state when no tasks exist
   */
  if (tasks.length === 0 && !searchTerm && filter === 'all') {
    return (
      <motion.div 
        className="task-list-empty"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="empty-icon"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Circle size={48} />
        </motion.div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started!</p>
      </motion.div>
    );
  }

  /**
   * No results state for search/filter
   */
  if (tasks.length === 0) {
    return (
      <motion.div 
        className="task-list-empty"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="empty-icon"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <SearchIcon size={48} />
        </motion.div>
        <h3>No tasks found</h3>
        <p>
          {searchTerm 
            ? `No tasks match "${searchTerm}"`
            : `No ${filter} tasks found`
          }
        </p>
      </motion.div>
    );
  }

  /**
   * Group tasks by completion status for better UX
   */
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <motion.div 
      className="task-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Pending Tasks */}
      <AnimatePresence>
        {pendingTasks.length > 0 && (
          <motion.div 
            className="task-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h3 
              className="section-title"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Circle size={20} />
              Pending Tasks ({pendingTasks.length})
            </motion.h3>
            <motion.div 
              className="task-grid"
              layout
            >
              <AnimatePresence>
                {pendingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300
                    }}
                    layout
                  >
                    <TaskItem
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed Tasks */}
      <AnimatePresence>
        {completedTasks.length > 0 && (
          <motion.div 
            className="task-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.h3 
              className="section-title"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CheckCircle size={20} />
              Completed Tasks ({completedTasks.length})
            </motion.h3>
            <motion.div 
              className="task-grid"
              layout
            >
              <AnimatePresence>
                {completedTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300
                    }}
                    layout
                  >
                    <TaskItem
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;