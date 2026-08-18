import React, { useState, useEffect } from 'react';
import API from '../services/api';
import CompanyCard from '../components/CompanyCard';
import Loader from '../components/Loader';
import { FiSearch, FiLayers } from 'react-icons/fi';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/companies?search=${search}`);
      if (res.data.success) {
        setCompanies(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
            Verified Employers
          </span>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white font-heading">
            Explore Hiring Companies
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400">
            Learn about student placement history, work culture, reviews, and explore open roles.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl smooth-shadow p-1.5 flex items-center">
          <FiSearch className="text-slate-400 ml-3 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none px-3 py-2"
          />
        </div>

        {/* List */}
        {loading ? (
          <Loader skeleton count={3} />
        ) : companies.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl">
            <FiLayers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 dark:text-slate-400">No matching companies found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Companies;
