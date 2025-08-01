import React from 'react';

// /**
//  * FilterButtons component for filtering tasks by status
//  * @param {Object} props
//  * @param {string} props.currentFilter - Current filter status
//  * @param {Function} props.onFilterChange - Function to handle filter changes
//  * @param {Object} props.taskCounts - Object containing task counts for each filter
//  */
const FilterButtons = ({ currentFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: 'all', label: 'All', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <div className="filter-buttons">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`filter-button ${currentFilter === filter.key ? 'active' : ''}`}
        >
          {filter.label}
          <span className="count">{filter.count}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;