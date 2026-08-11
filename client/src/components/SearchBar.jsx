import React, { useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';

const SearchBar = ({ onSearch, initialSearch = '', initialLocation = '' }) => {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, location });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-3xl smooth-shadow p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-4"
    >
      {/* Search Input */}
      <div className="flex-1 w-full flex items-center px-3 space-x-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/60 pb-2 md:pb-0">
        <FiSearch className="text-slate-400 w-5 h-5 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Job title, keywords, or skills..."
          className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none py-2"
        />
      </div>

      {/* Location Input */}
      <div className="flex-1 w-full flex items-center px-3 space-x-2 pb-2 md:pb-0">
        <FiMapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, state, or remote..."
          className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none py-2"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-2xl hover:opacity-95 shadow-md transition-opacity flex-shrink-0 flex items-center justify-center space-x-2"
      >
        <span>Find Jobs</span>
      </button>
    </form>
  );
};

export default SearchBar;
