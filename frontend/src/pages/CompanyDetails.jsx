import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/Loader';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FiMapPin, FiBriefcase, FiStar, FiGlobe, FiUsers, 
  FiMessageSquare, FiArrowLeft, FiPlusCircle, FiCheck 
} from 'react-icons/fi';

const CompanyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'jobs' | 'reviews'

  // Review Form States
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchCompanyDetails = async () => {
    try {
      const res = await API.get(`/companies/${id}`);
      if (res.data.success) {
        setCompany(res.data.data.company);
        setJobs(res.data.data.jobs);
        setReviews(res.data.data.reviews);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading company profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText) {
      toast.warn('Please write your review feedback');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await API.post(`/reviews/${company._id}`, { rating, reviewText });
      if (res.data.success) {
        toast.success('Thank you for rating this company! 🌟');
        setReviewText('');
        setRating(5);
        fetchCompanyDetails(); // refresh details with new avg rating
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting company review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader fullPage />;
  if (!company) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold">Company profile not found.</h2>
        <Link to="/companies" className="text-primary hover:underline">Return to Companies</Link>
      </div>
    );
  }

  const companyLogo = company.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=100';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link to="/companies" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <FiArrowLeft className="mr-2" /> Back to companies
        </Link>

        {/* Company Header Block */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-100 dark:border-slate-700/60 rounded-3xl smooth-shadow p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-5">
              <img
                src={companyLogo}
                alt={company.companyName}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-100 dark:border-slate-700"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
                    {company.companyName}
                  </h1>
                  {company.isVerified && (
                    <span className="p-1 bg-success/10 text-success rounded-full" title="Verified Employer">
                      <FiCheck className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded">
                    {company.industry}
                  </span>
                  <div className="flex items-center text-warning font-semibold">
                    <FiStar className="mr-1 fill-current" />
                    <span>{company.rating ? company.rating.toFixed(1) : 'New'}</span>
                    <span className="text-[10px] text-slate-400 font-medium ml-1">
                      ({company.reviewsCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <FiGlobe />
                <span>Visit Website</span>
              </a>
            )}
          </div>

          {/* Tab Navigation buttons */}
          <div className="flex space-x-6 border-t border-slate-100 dark:border-slate-700/60 mt-8 pt-4 text-sm font-semibold">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'jobs', name: `Open Jobs (${jobs.length})` },
              { id: 'reviews', name: `Reviews (${reviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 relative transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-slate-450 hover:text-slate-750'
                }`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl smooth-shadow p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">About Company</h3>
                  <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-350 whitespace-pre-line">
                    {company.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500">
                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 block">HQ Location</span>
                    <span className="text-slate-800 dark:text-white font-semibold text-sm flex items-center">
                      <FiMapPin className="mr-1.5 text-primary" /> {company.location}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 block">Company Size</span>
                    <span className="text-slate-800 dark:text-white font-semibold text-sm flex items-center">
                      <FiUsers className="mr-1.5 text-secondary" /> {company.employeeCount ? `${company.employeeCount.toLocaleString()} employees` : '1-10'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 block">Industry Sector</span>
                    <span className="text-slate-800 dark:text-white font-semibold text-sm flex items-center">
                      <FiBriefcase className="mr-1.5 text-success" /> {company.industry}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Open Jobs */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                {jobs.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-12 text-center text-slate-550">
                    No active job listings posted currently by this employer.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <JobCard key={job._id} job={{ ...job, company }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Submit Review box */}
                {user?.role === 'student' && (
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Post a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500 font-semibold">Rating Score:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className={`p-1 transition-colors ${
                                rating >= star ? 'text-warning' : 'text-slate-300 dark:text-slate-600'
                              }`}
                            >
                              <FiStar className="w-5 h-5 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="3"
                        placeholder="Write constructive details regarding your internship or application experience..."
                        required
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        <FiPlusCircle />
                        <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Review Feed */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-12 text-center text-slate-550">
                      No student reviews posted yet.
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div 
                        key={rev._id} 
                        className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 smooth-shadow space-y-3"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800 dark:text-white">
                            {rev.reviewer?.user?.name || 'Anonymous Student'}
                          </span>
                          <span className="text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-0.5 text-warning">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                          {rev.reviewText}
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
