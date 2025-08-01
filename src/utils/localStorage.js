const TASKS_KEY = 'taskTracker_tasks';
const DARK_MODE_KEY = 'taskTracker_darkMode';

/**
 * Utility functions for managing tasks and preferences in localStorage
 */
export const localStorage = {
  /**
   * Load tasks from localStorage
   * @returns {Array} Array of tasks
   */
  loadTasks: () => {
    try {
      const storedTasks = window.localStorage.getItem(TASKS_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert date strings back to Date objects
        return parsedTasks.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  },

  /**
   * Save tasks to localStorage
   * @param {Array} tasks - Array of tasks to save
   */
  saveTasks: (tasks) => {
    try {
      window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  },

  /**
   * Clear all tasks from localStorage
   */
  clearTasks: () => {
    try {
      window.localStorage.removeItem(TASKS_KEY);
    } catch (error) {
      console.error('Error clearing tasks from localStorage:', error);
    }
  },

  /**
   * Load dark mode preference from localStorage
   * @returns {boolean} Dark mode preference
   */
  loadDarkMode: () => {
    try {
      const storedDarkMode = window.localStorage.getItem(DARK_MODE_KEY);
      if (storedDarkMode !== null) {
        return JSON.parse(storedDarkMode);
      }
      // Default to light mode
      return false;
    } catch (error) {
      console.error('Error loading dark mode from localStorage:', error);
      return false;
    }
  },

  /**
   * Save dark mode preference to localStorage
   * @param {boolean} darkMode - Dark mode preference
   */
  saveDarkMode: (darkMode) => {
    try {
      window.localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving dark mode to localStorage:', error);
    }
  }
};