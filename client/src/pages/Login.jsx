import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiUser, FiBriefcase, FiShield, FiChevronDown, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Config per tab
  const tabConfig = {
    student: {
      title: 'Student Portal',
      subtitle: 'Search internships, apply to jobs, and manage your academic profile.',
      icon: <FiUser className="w-5 h-5" />,
      btnLabel: 'Sign In as Student',
      emailLabel: 'Student Email',
    },
    company: {
      title: 'Company / Recruiter Portal',
      subtitle: 'Post openings, track applicants, and message students.',
      icon: <FiBriefcase className="w-5 h-5" />,
      btnLabel: 'Sign In as Company',
      emailLabel: 'Corporate Email',
    },
    admin: {
      title: 'Admin Control Panel',
      subtitle: 'Access analytics, verify companies, and manage the platform.',
      icon: <FiShield className="w-5 h-5" />,
      btnLabel: 'Sign In as Admin',
      emailLabel: 'Admin Email',
    }
  };

  const currentConfig = tabConfig[tab];

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const roleLabel = result.role === 'admin' ? 'Admin' : result.role === 'company' ? 'Company' : 'Student';
      toast.success(`Welcome back! Logged in as ${roleLabel} 👋`);
      if (result.role === 'admin') navigate('/admin-dashboard');
      else if (result.role === 'company') navigate('/company-dashboard');
      else navigate('/student-dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* ── Tab Switcher ── */}
        <div className="flex rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg mb-0">
          {/* Student Tab */}
          <button
            type="button"
            onClick={() => handleTabSwitch('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
              tab === 'student'
                ? 'bg-indigo-600 text-white shadow-inner'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:text-slate-400'
            }`}
          >
            <FiUser className="w-4 h-4" />
            Student
          </button>

          {/* Divider */}
          <div className="w-px bg-slate-200 dark:bg-slate-700" />

          {/* Company Tab */}
          <button
            type="button"
            onClick={() => handleTabSwitch('company')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
              tab === 'company'
                ? 'bg-emerald-600 text-white shadow-inner'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:text-slate-400'
            }`}
          >
            <FiBriefcase className="w-4 h-4" />
            Company
          </button>

          {/* Divider */}
          <div className="w-px bg-slate-200 dark:bg-slate-700" />

          {/* Admin Tab */}
          <button
            type="button"
            onClick={() => handleTabSwitch('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
              tab === 'admin'
                ? 'bg-purple-600 text-white shadow-inner'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:text-slate-400'
            }`}
          >
            <FiShield className="w-4 h-4" />
            Admin
          </button>
        </div>

        {/* ── Main Card ── */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-0 p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-t-0 border-slate-200/80 dark:border-slate-700/80 rounded-b-3xl shadow-xl space-y-5"
        >
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-1 ${tab === 'student' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300' : tab === 'admin' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300'}`}>
              {currentConfig.icon}
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
              {currentConfig.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {currentConfig.subtitle}
            </p>
          </div>


          {/* Form */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentConfig.emailLabel}
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={currentConfig.demoEmail}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 text-sm bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white text-sm font-bold rounded-xl hover:opacity-95 shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                tab === 'student'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-500/25'
                  : tab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-purple-500/25'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/25'
              }`}
            >
              {loading ? 'Logging in...' : (
                <>
                  <span>{currentConfig.btnLabel}</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {tab !== 'admin' && (
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
              New here?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline">
                Create an Account
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
