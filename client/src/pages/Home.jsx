import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import JobCard from '../components/JobCard';
import CompanyCard from '../components/CompanyCard';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import API from '../services/api';
import Loader from '../components/Loader';
import { FiArrowRight, FiBriefcase, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Home = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          API.get('/jobs?limit=3'),
          API.get('/companies?limit=4')
        ]);
        if (jobsRes.data.success) setLatestJobs(jobsRes.data.data);
        if (companiesRes.data.success) setCompanies(companiesRes.data.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      {/* 1. Hero Search Section */}
      <Hero />

      {/* 2. Featured Jobs Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white font-heading">
              Latest Job Openings
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
              Discover recently added internships and full-time opportunities.
            </p>
          </div>
          <Link
            to="/jobs"
            className="flex items-center text-sm font-semibold text-primary hover:underline"
          >
            Explore All Jobs <FiArrowRight className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <Loader skeleton count={3} />
        ) : latestJobs.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm">No jobs posted recently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Featured Companies Section */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white font-heading">
                Top Hiring Companies
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                Explore student-friendly cultures and open roles.
              </p>
            </div>
            <Link
              to="/companies"
              className="flex items-center text-sm font-semibold text-primary hover:underline"
            >
              View All Companies <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <Loader skeleton count={2} />
          ) : companies.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-sm">No companies registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {companies.map((company) => (
                <CompanyCard key={company._id} company={company} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Testimonials Success Stories */}
      <Testimonials />

      {/* 5. Frequently Asked Questions */}
      <FAQ />

      {/* 6. Newsletter Subscription Banner */}
      <Newsletter />
    </div>
  );
};

export default Home;
