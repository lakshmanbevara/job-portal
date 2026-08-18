import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiMail, FiLock, FiGlobe, FiMapPin, FiCpu, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const { registerStudent, registerCompany } = useAuth();
  const [role, setRole] = useState('student'); // 'student' or 'company'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Basic Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Company Specific Form States
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.warn('Please fill in credentials');
      return;
    }

    setLoading(true);

    let res;
    if (role === 'student') {
      res = await registerStudent(name, email, password);
    } else {
      if (!companyName || !description || !location || !industry) {
        toast.warn('Please fill in all company fields');
        setLoading(false);
        return;
      }
      res = await registerCompany({
        name,
        email,
        password,
        companyName,
        website,
        description,
        location,
        industry
      });
    }

    setLoading(false);

    if (res.success) {
      toast.success('Registration successful! Please verify your email ✉️');
      navigate(role === 'student' ? '/student-dashboard' : '/company-dashboard');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-100 dark:border-slate-700/60 rounded-3xl smooth-shadow space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white font-heading">
            Create an Account
          </h2>
          <p className="text-sm text-slate-450">
            Sign up to discover opportunities or recruit top student talents.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-1 max-w-md mx-auto bg-slate-55/30 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center ${
              role === 'student'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <FiUser className="mr-1.5 w-4 h-4" />
            I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('company')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center ${
              role === 'company'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <FiBriefcase className="mr-1.5 w-4 h-4" />
            We are a Company
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Fields */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Contact Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Alex Watson"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. alex@university.edu"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Company Specific Fields */}
            {role === 'company' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="e.g. Google Inc"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
                  <div className="relative">
                    <FiGlobe className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Office Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      placeholder="e.g. Bangalore, India"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                  <div className="relative">
                    <FiCpu className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      required
                      placeholder="e.g. Technology, Finance"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="3"
                    placeholder="Provide details about company, target audience and student growth offerings..."
                    className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-md transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Profile'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-750 text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
