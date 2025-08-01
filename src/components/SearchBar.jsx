import React from 'react';
import { Search } from 'lucide-react';

// /**
//  * SearchBar component for filtering tasks by title or description
//  * @param {Object} props
//  * @param {string} props.searchTerm - Current search term
//  * @param {Function} props.onSearchChange - Function to handle search term changes
//  */
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default SearchBar;