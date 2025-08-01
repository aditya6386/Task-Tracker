import React, { useState, useEffect, useMemo } from 'react';
import { localStorage } from './utils/localStorage';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchBar from './components/SearchBar';
import FilterButtons from './components/FilterButtons';
import { CheckSquare, Plus, Settings, Download, Upload, Moon, Sun } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Main App component - Task Tracker Application
 */
function App() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /**
   * Load tasks and dark mode preference from localStorage on component mount
   */
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        const savedTasks = localStorage.loadTasks();
        setTasks(savedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load dark mode preference
    const savedDarkMode = localStorage.loadDarkMode();
    setDarkMode(savedDarkMode);

    loadTasks();
  }, []);

  /**
   * Save tasks to localStorage whenever tasks change
   */
  useEffect(() => {
    if (!isLoading) {
      localStorage.saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  /**
   * Apply dark mode to document body
   */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.saveDarkMode(darkMode);
  }, [darkMode]);

  /**
   * Filter and search tasks based on current filters
   */
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }

    // Search by title or description
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by priority and creation date
    return filtered.sort((a, b) => {
      // First sort by completion status (pending first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority (high, medium, low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Finally by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, searchTerm, filter]);

  /**
   * Calculate task counts for filter buttons
   */
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length
  }), [tasks]);

  /**
   * Generate unique ID for new tasks
   * @returns {string} Unique task ID
   */
  const generateId = () => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Add new task
   * @param {Object} taskData - Task data without id, createdAt, updatedAt
   */
  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
  };

  /**
   * Update existing task
   * @param {Object} taskData - Task data without id, createdAt, updatedAt
   */
  const handleUpdateTask = (taskData) => {
    if (!editingTask) return;

    const updatedTask = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date()
    };

    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      )
    );
    setEditingTask(null);
  };

  /**
   * Toggle task completion status
   * @param {string} id - Task ID
   */
  const handleToggleComplete = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      )
    );
  };

  /**
   * Delete task
   * @param {string} id - Task ID
   */
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  /**
   * Start editing task
   * @param {Object} task - Task to edit
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  /**
   * Export tasks to JSON
   */
  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tasks_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  /**
   * Import tasks from JSON file
   * @param {Event} event - File input change event
   */
  const handleImportTasks = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target?.result);
        if (Array.isArray(importedTasks)) {
          const validTasks = importedTasks
            .filter(task => task.id && task.title && task.description)
            .map(task => ({
              ...task,
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt)
            }));
          setTasks(validTasks);
        }
      } catch (error) {
        console.error('Error importing tasks:', error);
        alert('Error importing tasks. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  /**
   * Clear all tasks
   */
  const handleClearAllTasks = () => {
    if (window.confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      setTasks([]);
      localStorage.clearTasks();
    }
  };

  return (
    <motion.div 
      className="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header 
        className="app-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="header-content">
          <motion.div 
            className="header-left"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <motion.h1 
              className="app-title"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CheckSquare size={32} />
              Task Tracker
            </motion.h1>
            <motion.p 
              className="app-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Organize your tasks efficiently
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="header-right"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="header-actions">
              <div className="import-export">
                <motion.label 
                  className="import-button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Upload size={16} />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportTasks}
                    style={{ display: 'none' }}
                  />
                </motion.label>
                
                <motion.button
                  onClick={handleExportTasks}
                  className="export-button"
                  disabled={tasks.length === 0}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Download size={16} />
                  Export
                </motion.button>
              </div>
              
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="dark-mode-toggle"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>
              
              <motion.button
                onClick={() => setShowForm(!showForm)}
                className="add-task-button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Plus size={16} />
                Add Task
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="app-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="main-content">
          {/* Task Form */}
          <AnimatePresence>
            {(showForm || editingTask) && (
              <motion.div 
                className="form-section"
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TaskForm
                  task={editingTask || undefined}
                  onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                  onCancel={editingTask ? handleCancelEdit : () => setShowForm(false)}
                  isEditing={!!editingTask}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <motion.div 
            className="controls-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <FilterButtons
              currentFilter={filter}
              onFilterChange={setFilter}
              taskCounts={taskCounts}
            />
          </motion.div>

          {/* Task List */}
          <motion.div 
            className="tasks-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              isLoading={isLoading}
              searchTerm={searchTerm}
              filter={filter}
            />
          </motion.div>

          {/* Footer Actions */}
          <AnimatePresence>
            {tasks.length > 0 && (
              <motion.div 
                className="footer-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.button
                  onClick={handleClearAllTasks}
                  className="clear-all-button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Settings size={16} />
                  Clear All Tasks
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </motion.div>
  );
}

export default App;