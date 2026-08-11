import React from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    if (name) {
      toast.success(`Message sent successfully! Thank you, ${name}. ✉️`);
      e.target.reset();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
            Get In Touch
          </span>
          <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white font-heading">
            We'd Love to Hear From You
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400">
            Have questions about student verifications or job listings? Reach out directly.
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Info */}
          <div className="md:col-span-5 bg-gradient-to-tr from-primary to-secondary p-8 rounded-3xl text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="space-y-6 relative z-10">
              <h2 className="text-2xl font-bold font-heading">Contact Information</h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Connect with our team for account setup requests, API support or security audits.
              </p>
            </div>

            <div className="space-y-4 pt-8 relative z-10 text-xs">
              <div className="flex items-center">
                <FiMapPin className="mr-3 w-5 h-5 text-white/80 flex-shrink-0" />
                <span>123 Innovation Way, Tech Park, Bangalore, India</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="mr-3 w-5 h-5 text-white/80 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <FiMail className="mr-3 w-5 h-5 text-white/80 flex-shrink-0" />
                <span>support@studentjobportal.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Form */}
          <div className="md:col-span-7 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 smooth-shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Emma Watson"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. emma@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="e.g. Recruitment support"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message Description</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  placeholder="Write details of your query..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-md flex items-center justify-center space-x-2 transition-opacity"
              >
                <FiSend />
                <span>Send Message</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
