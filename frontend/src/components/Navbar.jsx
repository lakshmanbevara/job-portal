import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FiMenu, FiX, FiSun, FiMoon, FiBell, FiLogOut, 
  FiUser, FiBriefcase, FiCompass, FiInfo, FiMail, FiLayers, FiFileText 
} from 'react-icons/fi';
import API from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch unread notifications if user is logged in
  useEffect(() => {
    let interval;
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await API.get('/notifications');
        if (res.data.success) {
          setNotifications(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching notifications in navbar:', err);
      }
    };

    fetchNotifications();

    if (user) {
      // Poll notifications every 30 seconds
      interval = setInterval(fetchNotifications, 30000);
    }

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin-dashboard';
    if (user.role === 'company') return '/company-dashboard';
    return '/student-dashboard';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getNavLinks = () => {
    if (!user) {
      return [
        { name: 'Home', path: '/home', icon: <FiCompass className="mr-1" /> },
        { name: 'Jobs', path: '/jobs', icon: <FiBriefcase className="mr-1" /> },
        { name: 'Companies', path: '/companies', icon: <FiLayers className="mr-1" /> },
        { name: 'About', path: '/about', icon: <FiInfo className="mr-1" /> },
        { name: 'Contact', path: '/contact', icon: <FiMail className="mr-1" /> },
      ];
    }
    
    if (user.role === 'admin') {
      return [
        { name: 'Overview', path: '/admin-dashboard', icon: <FiCompass className="mr-1" /> },
        { name: 'Students', path: '/admin-dashboard/students', icon: <FiUser className="mr-1" /> },
        { name: 'Companies', path: '/admin-dashboard/companies', icon: <FiLayers className="mr-1" /> },
        { name: 'Jobs', path: '/admin-dashboard/jobs', icon: <FiBriefcase className="mr-1" /> },
      ];
    }

    if (user.role === 'company') {
      return [
        { name: 'Dashboard', path: '/company-dashboard', icon: <FiCompass className="mr-1" /> },
        { name: 'Profile', path: '/company-dashboard/profile', icon: <FiUser className="mr-1" /> },
        { name: 'Post Job', path: '/company-dashboard/post-job', icon: <FiBriefcase className="mr-1" /> },
        { name: 'My Jobs', path: '/company-dashboard/jobs', icon: <FiLayers className="mr-1" /> },
        { name: 'Applicants', path: '/company-dashboard/applicants', icon: <FiUser className="mr-1" /> },
      ];
    }

    if (user.role === 'student') {
      return [
        { name: 'Dashboard', path: '/student-dashboard', icon: <FiCompass className="mr-1" /> },
        { name: 'Search Jobs', path: '/jobs', icon: <FiBriefcase className="mr-1" /> },
        { name: 'Companies', path: '/companies', icon: <FiLayers className="mr-1" /> },
        { name: 'Applications', path: '/student-dashboard/applications', icon: <FiFileText className="mr-1" /> },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">
                {user?.role === 'admin' ? 'Admin Panel' : user?.role === 'company' ? 'Recruiter Portal' : 'StudentJobPortal'}
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary dark:text-primary'
                    : 'text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                  >
                    <FiBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  <AnimatePresence>
                    {showNotifDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowNotifDropdown(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 shadow-2xl py-2 z-20"
                        >
                          <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 dark:border-slate-700/50">
                            <span className="font-semibold text-sm">Notifications</span>
                            {unreadCount > 0 && (
                              <button 
                                onClick={markAllAsRead} 
                                className="text-xs text-primary font-medium hover:underline"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <p className="text-center text-xs text-slate-400 py-6">No notifications</p>
                            ) : (
                              notifications.map((notif) => (
                                <div 
                                  key={notif._id} 
                                  className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700/30 text-xs transition-colors ${
                                    notif.read ? 'opacity-75' : 'bg-slate-50/50 dark:bg-slate-700/20'
                                  }`}
                                >
                                  <div className="flex justify-between font-medium">
                                    <span className={
                                      notif.type === 'success' ? 'text-success' :
                                      notif.type === 'danger' ? 'text-danger' :
                                      notif.type === 'warning' ? 'text-warning' : 'text-primary'
                                    }>
                                      {notif.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-slate-600 dark:text-slate-350">{notif.message}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dashboard and profile redirection */}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center text-sm font-semibold text-white px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-xl hover:opacity-90 transition-opacity shadow-md"
                >
                  <FiUser className="mr-1.5" />
                  {user?.role === 'admin' ? 'Admin Panel' : user?.role === 'company' ? 'My Company' : 'Dashboard'}
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-danger rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-xl hover:opacity-90 transition-opacity shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 text-base font-semibold rounded-xl transition-colors ${
                  isActive(link.path)
                    ? 'bg-slate-50 text-primary dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl"
                >
                  <FiUser className="mr-2" /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center px-3 py-2 text-base font-semibold text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center px-4 py-2.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center px-4 py-2.5 text-base font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-xl hover:opacity-90 shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
