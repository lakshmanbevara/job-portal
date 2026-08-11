import React from 'react';
import { toast } from 'react-toastify';

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast.success('Thank you for subscribing! 🚀');
      e.target.reset();
    }
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-16 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 md:p-12 shadow-2xl overflow-hidden glow-effect">
          
          {/* Animated decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white font-heading">
              Ready to Kickstart Your Career?
            </h2>
            <p className="text-sm md:text-base text-white/80 leading-relaxed">
              Subscribe to receive curated weekly newsletters with the freshest internships, entry-level positions, and resume building tips.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 text-sm bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold bg-white text-primary hover:bg-slate-100 rounded-xl shadow-md transition-colors"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
