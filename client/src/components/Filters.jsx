import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FiSliders, FiDollarSign, FiCalendar, FiBriefcase } from 'react-icons/fi';

const Filters = ({ onChange, initialFilters = {} }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [jobType, setJobType] = useState(initialFilters.jobType || '');
  const [workMode, setWorkMode] = useState(initialFilters.workMode || '');
  const [exp, setExp] = useState(initialFilters.experienceRequired || '');
  const [minSalary, setMinSalary] = useState(
    initialFilters.minSalary ? Math.round((Number(initialFilters.minSalary) * 12) / 100000) : 0
  );
  const [sort, setSort] = useState(initialFilters.sort || '-createdAt');

  // Load Categories dynamically from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories in filters:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleApply = (e) => {
    e.preventDefault();
    onChange({
      category: selectedCategory,
      jobType,
      workMode,
      experienceRequired: exp,
      minSalary: minSalary > 0 ? (minSalary * 100000) / 12 : '',
      sort
    });
  };

  const handleReset = () => {
    setSelectedCategory('');
    setJobType('');
    setWorkMode('');
    setExp('');
    setMinSalary(0);
    setSort('-createdAt');
    onChange({});
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-6 smooth-shadow space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
          <FiSliders className="mr-2 text-primary" />
          Search Filters
        </h3>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Reset All
        </button>
      </div>

      <form onSubmit={handleApply} className="space-y-5">
        {/* Category Select */}
        <div>
          <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type Select */}
        <div>
          <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2">Job Type</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Government Jobs">Government Jobs</option>
          </select>
        </div>

        {/* Work Mode Select */}
        <div>
          <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2">Work Mode</label>
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">All Modes</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Experience Required */}
        <div>
          <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2">Experience</label>
          <select
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Any Experience</option>
            <option value="No Experience">No Experience</option>
            <option value="0-1 Years">0-1 Years</option>
            <option value="1-3 Years">1-3 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        </div>

        {/* Min Salary Slider (INR LPA) */}
        <div>
          <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2">
            Min Salary: ₹{minSalary} LPA
          </label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-semibold">
            <span>₹0 LPA</span>
            <span>₹50 LPA</span>
          </div>
        </div>

        {/* Sort Select */}
        <div>
          <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2">Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="-createdAt">Newest Posted</option>
            <option value="oldest">Oldest Posted</option>
            <option value="-salary.max">Salary: High to Low</option>
            <option value="salary.min">Salary: Low to High</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default Filters;
