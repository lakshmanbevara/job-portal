import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiBriefcase, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Hero = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const popularSearches = ['React', 'Figma', 'Node.js', 'Remote', 'Marketing'];

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 pt-16 pb-20 md:pt-24 md:pb-28 transition-colors duration-300">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
                <FiTrendingUp className="mr-1.5" /> Empowering Student Careers
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-none font-heading">
                Find Your Dream <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Internship & Job
                </span> <br />
                Opportunities
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base sm:text-lg text-slate-650 dark:text-slate-350 max-w-xl"
            >
              The single platform built exclusively for students. Connect directly with hiring managers at top-tier startups and tech giants. Start your career journey today!
            </motion.p>

            {/* Quick Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSearchSubmit}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl md:rounded-3xl p-2 smooth-shadow flex flex-col md:flex-row items-center gap-2 max-w-2xl"
            >
              <div className="flex-1 w-full flex items-center px-3 space-x-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/60 pb-2 md:pb-0">
                <FiSearch className="text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title, tech skills..."
                  className="w-full bg-transparent text-sm focus:outline-none text-slate-850 dark:text-white placeholder-slate-400 py-2.5"
                />
              </div>

              <div className="flex-1 w-full flex items-center px-3 space-x-2 pb-2 md:pb-0">
                <FiMapPin className="text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or Remote..."
                  className="w-full bg-transparent text-sm focus:outline-none text-slate-850 dark:text-white placeholder-slate-400 py-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl md:rounded-2xl hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </motion.form>

            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-2 text-xs"
            >
              <span className="text-slate-450 dark:text-slate-400 font-medium">Popular:</span>
              {popularSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearch(term);
                    navigate(`/jobs?search=${term}`);
                  }}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-lg text-slate-600 dark:text-slate-350 transition-colors"
                >
                  {term}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Image/Illustration Column */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-[400px] bg-gradient-to-tr from-primary/20 to-secondary/20 border border-white/40 dark:border-slate-800/80 rounded-2xl glass flex items-center justify-center p-8 glow-effect"
            >
              {/* Mock dashboard interface elements inside Hero for rich aesthetics */}
              <div className="w-full bg-white dark:bg-slate-900 rounded-2xl smooth-shadow p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Interactive Dashboard</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">G</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">Google UX Intern</h4>
                        <p className="text-[10px] text-slate-400">Reviewing resume</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-semibold bg-warning/15 text-warning rounded-full">Interviewing</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold">N</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">Netflix Frontend</h4>
                        <p className="text-[10px] text-slate-400">Technical screening</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-semibold bg-success/15 text-success rounded-full">Offer Sent</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between text-xs font-medium text-slate-400">
                  <span>Applications: 12</span>
                  <span>Active interviews: 3</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Counter Stats Section */}
        <div className="mt-20 grid grid-cols-3 gap-4 max-w-4xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60 pt-10">
          <div className="text-center">
            <h4 className="text-3xl font-extrabold text-primary font-heading">5,000+</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Active Jobs</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-extrabold text-secondary font-heading">15,000+</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Students Placed</p>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 font-heading">1,000+</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Verified Companies</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
