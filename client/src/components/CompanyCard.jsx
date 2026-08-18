import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiStar } from 'react-icons/fi';

const CompanyCard = ({ company }) => {
  const companyLogo = company.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=100';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-100 dark:border-slate-700/50 rounded-2xl smooth-shadow flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center space-x-4">
          <img
            src={companyLogo}
            alt={company.companyName}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-100 dark:border-slate-700"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=100';
            }}
          />
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 hover:text-primary dark:hover:text-primary transition-colors">
              <Link to={`/companies/${company._id}`}>{company.companyName}</Link>
            </h3>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary uppercase">
              {company.industry}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {company.description}
        </p>

        {/* Location & Rating */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/30 text-xs text-slate-500">
          <div className="flex items-center">
            <FiMapPin className="mr-1.5 text-slate-400" />
            <span>{company.location}</span>
          </div>
          
          <div className="flex items-center text-warning font-semibold">
            <FiStar className="mr-1 fill-current" />
            <span>{company.rating ? company.rating.toFixed(1) : 'New'}</span>
            <span className="text-[10px] text-slate-450 dark:text-slate-400 ml-1">
              ({company.reviewsCount || 0})
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to={`/companies/${company._id}`}
          className="block w-full text-center py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 rounded-xl transition-opacity shadow-sm"
        >
          View Profile & Jobs
        </Link>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
