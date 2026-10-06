import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Jobs = () => {
  const { profile } = useAuth();
  const location = useLocation();

  // Parse initial query params from URL
  const getUrlParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      location: params.get('location') || ''
    };
  };

  const urlParams = getUrlParams();

  // Search States
  const [search, setSearch] = useState(urlParams.search);
  const [locQuery, setLocQuery] = useState(urlParams.location);

  // Filter States
  const [filters, setFilters] = useState({});

  // Pagination & Results States
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Trigger search fetch whenever queries or filters change
  const fetchJobs = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pageNumber,
        limit: 9,
        search,
        location: locQuery,
        ...filters
      };

      // Clean empty keys
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const res = await API.get('/jobs', { params });
      if (res.data.success) {
        setJobs(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Re-read URL queries if location state updates (e.g. user clicks logo or navbar link)
    const updatedParams = getUrlParams();
    setSearch(updatedParams.search);
    setLocQuery(updatedParams.location);
  }, [location.search]);

  useEffect(() => {
    fetchJobs(1);
  }, [search, locQuery, filters]);

  const handleSearchBarSubmit = ({ search: s, location: l }) => {
    setSearch(s);
    setLocQuery(l);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchJobs(newPage);
    }
  };

  const savedJobIds = profile?.savedJobs?.map(job => job._id || job) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white font-heading">
              Search Internships & Jobs
            </h1>
            <p className="text-sm text-slate-550 dark:text-slate-400">
              Apply filters to locate your perfect engineering, marketing or design positions.
            </p>
          </div>
          <SearchBar 
            onSearch={handleSearchBarSubmit} 
            initialSearch={urlParams.search} 
            initialLocation={urlParams.location} 
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Filters Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Filters onChange={handleFiltersChange} initialFilters={filters} />
          </div>

          {/* Right Column: Job Listing Grid */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {loading ? (
              <Loader skeleton count={3} />
            ) : jobs.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-12 text-center">
                <p className="text-slate-500 dark:text-slate-450 font-medium">
                  No jobs matched your criteria. Try widening your search or removing some filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard 
                      key={job._id} 
                      job={job} 
                      saved={savedJobIds.includes(job._id)} 
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-50 transition-colors"
                      aria-label="Previous Page"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                      Page {pagination.page} of {pagination.pages}
                    </span>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-50 transition-colors"
                      aria-label="Next Page"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Jobs;
