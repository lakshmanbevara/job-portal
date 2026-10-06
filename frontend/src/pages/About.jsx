import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiUsers, FiTrendingUp, FiAward } from 'react-icons/fi';

const About = () => {
  const cards = [
    {
      title: 'Our Mission',
      description: 'To simplify student hiring by connecting talented college candidates directly with verify hiring managers.',
      icon: <FiBriefcase className="w-6 h-6 text-primary" />
    },
    {
      title: 'Our Growth',
      description: 'Supporting thousands of student registrations and active job placements nationwide.',
      icon: <FiTrendingUp className="w-6 h-6 text-secondary" />
    },
    {
      title: 'Industry Scope',
      description: 'Partnering with startups and established corporations in technology, product management, design and operations.',
      icon: <FiUsers className="w-6 h-6 text-success" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
            About Us
          </span>
          <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white font-heading">
            Bridging Academics and Careers
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400">
            StudentJobPortal is built specifically to address the pain points of college student placement drives.
          </p>
        </div>

        {/* Content Details */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-8 smooth-shadow grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Why StudentJobPortal?</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-350">
              Unlike generic recruitment platforms that require years of experience, our portal is built exclusively for university students. 
              We focus on paid internships, entry-level engineering posts, designer training terms, and assistant administrative options.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-350">
              Our direct messaging capabilities let students follow up directly on applications, breaking the traditional resume black hole.
            </p>
          </div>
          
          <div className="bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-2xl p-8 border dark:border-slate-750 flex flex-col justify-center items-center text-center space-y-4 h-64 relative overflow-hidden">
            <FiAward className="w-16 h-16 text-primary animate-pulse" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-white font-heading">Award Winning Portal Design</h4>
            <p className="text-xs text-slate-450">Voted Best Student Recruitment Tool 2026</p>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl smooth-shadow space-y-4"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl w-fit">
                {card.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">{card.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default About;
