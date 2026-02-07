import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <form onSubmit={handleSearch} className="relative flex items-center w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
          <FaSearch />
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-4 pl-12 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm text-neutral-700 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder="Search articles, topics, or mentors..."
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-primary-600 hover:bg-primary-700 text-white px-6 rounded-full font-semibold transition-colors shadow-md"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;