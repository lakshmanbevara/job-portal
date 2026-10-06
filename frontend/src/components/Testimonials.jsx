import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Alex Johnson',
      role: 'Software Engineer Intern at Google',
      quote: 'StudentJobPortal connected me with the recruiter at Google. The process was extremely straightforward and direct, which helped me land my summer internship!',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
    {
      name: 'Sarah Smith',
      role: 'UI Designer at Netflix',
      quote: 'The glassmorphic dashboard interface is a pleasure to use. I could create my student profile, upload my resume, and secure 3 interviews in a single week.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
    {
      name: 'Michael Brown',
      role: 'Data Analyst at Microsoft',
      quote: 'I love how easy it is to search and filter positions based on skills and salary. Highly recommend it to all college students looking for real career paths.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    }
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white font-heading">
            Placed Student Success Stories
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Read how other students used our portal to secure active internships and kickstart their tech professions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl smooth-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex space-x-1 text-warning mb-4">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic text-slate-600 dark:text-slate-300 line-clamp-4">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/40">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
