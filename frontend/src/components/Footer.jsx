import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast.success('Thank you for subscribing to our newsletter! 🚀');
      e.target.reset();
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Info */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-tight text-white font-heading">
              StudentJobPortal
            </span>
            <p className="text-sm text-slate-400">
              The premier platform for university students to find verified internships, full-time jobs, and kickstart their careers.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Search Jobs</Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition-colors">Explore Companies</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <FiMapPin className="mr-2 flex-shrink-0" />
                <span>123 Innovation Way, Tech Park, Bangalore</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2 flex-shrink-0" />
                <span>support@studentjobportal.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Newsletter</h3>
            <p className="text-xs text-slate-400 mb-4">
              Get weekly updates on newly posted internships and tech openings directly in your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter email"
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-l-xl text-white focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-r-xl transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} StudentJobPortal. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
