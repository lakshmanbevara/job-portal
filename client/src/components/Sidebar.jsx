import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiUser, FiBookmark, FiFileText, FiPlusCircle, FiList, 
  FiUsers, FiBriefcase, FiBarChart2, FiSettings, FiGrid, FiMessageSquare
} from 'react-icons/fi';

const Sidebar = ({ role }) => {
  const getLinks = () => {
    switch (role) {
      case 'student':
        return [
          { name: 'Profile Overview', path: '/student-dashboard', icon: <FiUser className="w-5 h-5" /> },
          { name: 'My Applications', path: '/student-dashboard/applications', icon: <FiFileText className="w-5 h-5" /> },
          { name: 'Bookmarked Jobs', path: '/student-dashboard/saved-jobs', icon: <FiBookmark className="w-5 h-5" /> },
          { name: 'Messages & Chats', path: '/student-dashboard/messages', icon: <FiMessageSquare className="w-5 h-5" /> }
        ];
      case 'company':
        return [
          { name: 'Dashboard Analytics', path: '/company-dashboard', icon: <FiBarChart2 className="w-5 h-5" /> },
          { name: 'Company Profile', path: '/company-dashboard/profile', icon: <FiUser className="w-5 h-5" /> },
          { name: 'Post Internship/Job', path: '/company-dashboard/post-job', icon: <FiPlusCircle className="w-5 h-5" /> },
          { name: 'Manage Job Openings', path: '/company-dashboard/jobs', icon: <FiList className="w-5 h-5" /> },
          { name: 'Track Applicants', path: '/company-dashboard/applicants', icon: <FiUsers className="w-5 h-5" /> },
          { name: 'Direct Messages', path: '/company-dashboard/messages', icon: <FiMessageSquare className="w-5 h-5" /> }
        ];
      case 'admin':
        return [
          { name: 'Overview Analytics', path: '/admin-dashboard', icon: <FiBarChart2 className="w-5 h-5" /> },
          { name: 'Manage Students', path: '/admin-dashboard/students', icon: <FiUsers className="w-5 h-5" /> },
          { name: 'Manage Companies', path: '/admin-dashboard/companies', icon: <FiGrid className="w-5 h-5" /> },
          { name: 'Add Company', path: '/admin-dashboard/add-company', icon: <FiPlusCircle className="w-5 h-5" /> },
          { name: 'Manage Job Listings', path: '/admin-dashboard/jobs', icon: <FiBriefcase className="w-5 h-5" /> },
          { name: 'Site Settings', path: '/admin-dashboard/settings', icon: <FiSettings className="w-5 h-5" /> }
        ];
      default:
        return [];
    }
  };

  const roleLabel = {
    student: { label: 'Student Portal', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
    company: { label: 'Recruiter Portal', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    admin: { label: 'Admin Control', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' }
  }[role] || { label: 'Navigation', color: 'text-slate-500', bg: '' };

  const links = getLinks();

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/60 p-6 space-y-2 flex-shrink-0 md:min-h-[calc(100vh-4rem)]">
      <div className={`mb-4 px-3 py-2 rounded-xl ${roleLabel.bg}`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${roleLabel.color}`}>
          {roleLabel.label}
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Navigation Menu</p>
      </div>
      <nav className="flex flex-col space-y-1.5">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-hover shadow-sm'
                  : 'text-slate-650 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
              }`
            }
          >
            <span className="mr-3 flex-shrink-0">{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

