import React, { Component } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-md space-y-6 bg-white dark:bg-slate-800 p-8 rounded-3xl smooth-shadow border border-slate-100 dark:border-slate-700/60">
            <FiAlertTriangle className="w-16 h-16 text-danger mx-auto" />
            <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white font-heading">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-550 dark:text-slate-400">
              An unexpected client-side error occurred. Let's try reloading the page to restore state.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
