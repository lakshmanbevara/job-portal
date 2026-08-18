import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-md space-y-6">
        <FiAlertTriangle className="w-20 h-20 text-warning mx-auto animate-bounce" />
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white font-heading">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The link you followed may be broken or the dashboard view requires role authorizations.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 transition-opacity"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
