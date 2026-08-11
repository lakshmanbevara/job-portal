import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQ = () => {
  const faqs = [
    {
      question: 'Is StudentJobPortal free for college students?',
      answer: 'Yes, absolutely! The portal is 100% free for students. You can search, bookmark, and apply for as many job opportunities as you want without any charges.'
    },
    {
      question: 'How do companies verify their credentials?',
      answer: 'Our platform administrator reviews each registered company. Admins evaluate company verification flags, checking websites and descriptions, ensuring only genuine businesses list jobs.'
    },
    {
      question: 'What formats can I upload my resume in?',
      answer: 'Currently, the portal supports PDF document uploads. Resumes can be managed directly under the Student Dashboard profile section and are shared automatically during job applications.'
    },
    {
      question: 'Can I track the status of my applications?',
      answer: 'Yes! The Student Dashboard lists all submitted applications alongside their current evaluation status: Applied, Reviewing, Interview Scheduled, Accepted, or Rejected.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white dark:bg-slate-900 py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Got questions? We have answers to help you navigate our portal.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/40 text-left font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <FiMinus className="text-primary w-4 h-4" /> : <FiPlus className="text-primary w-4 h-4" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <p className="p-5 text-sm leading-relaxed text-slate-550 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
