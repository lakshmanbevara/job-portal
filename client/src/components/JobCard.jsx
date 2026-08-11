import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiDollarSign, FiClock, FiBookmark, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { toast } from 'react-toastify';

const JobCard = ({ job, saved = false, onSaveToggle }) => {
  const { user, refreshUser } = useAuth();

  const handleSaveClick = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn('Please log in to save jobs! 🔐');
      return;
    }
    if (user.role !== 'student') {
      toast.warn('Only students can save job postings! 🎓');
      return;
    }

    try {
      const endpoint = saved ? `/jobs/${job._id}/unsave` : `/jobs/${job._id}/save`;
      const res = await API.post(endpoint);
      if (res.data.success) {
        toast.success(saved ? 'Removed from bookmarks' : 'Job bookmarked successfully! 🔖');
        if (onSaveToggle) onSaveToggle(job._id, !saved);
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating bookmark status');
    }
  };

  // Safe fallback if company or logo is missing
  const companyName = job.company?.companyName || 'Anonymous';
  const companyLogo = job.company?.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=100';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-100 dark:border-slate-700/50 rounded-2xl smooth-shadow hover:smooth-shadow-lg transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header: Logo, Company Name, Bookmark */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <img
              src={companyLogo}
              alt={companyName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-700"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=100';
              }}
            />
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{companyName}</h4>
              <Link to={`/jobs/detail/${job._id}`} className="text-base font-bold text-slate-800 dark:text-slate-100 hover:text-primary dark:hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </Link>
            </div>
          </div>

          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-xl border transition-colors ${
              saved
                ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            aria-label="Bookmark Job"
          >
            <FiBookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badges: Workmode, Type, Experience */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            {job.jobType}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary">
            {job.workMode}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-650 dark:text-slate-350">
            <FiClock className="mr-1 w-3 h-3" />
            {job.experienceRequired}
          </span>
        </div>

        {/* Location & Salary */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center">
            <FiMapPin className="mr-1.5 w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 font-bold text-slate-450 dark:text-slate-400 text-sm">₹</span>
            <span>
              {job.salary?.min 
                ? `${((job.salary.min * 12) / 100000).toFixed(1).replace('.0', '')} LPA - ${((job.salary.max * 12) / 100000).toFixed(1).replace('.0', '')} LPA` 
                : 'Unspecified'}
            </span>
          </div>
        </div>

        {/* Key Skills Required */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.skillsRequired?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-[10px] font-medium bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 rounded"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired?.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-medium text-slate-400">
              +{job.skillsRequired.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Footer: Detail and Quick Apply */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex space-x-3">
        <Link
          to={`/jobs/detail/${job._id}`}
          className="flex-1 text-center py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 rounded-xl transition-colors"
        >
          View Details
        </Link>
        <Link
          to={`/jobs/detail/${job._id}`}
          className="flex-1 text-center py-2 text-xs font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 rounded-xl transition-opacity shadow-sm"
        >
          Apply Now
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
