import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiGlobe, 
  FiArrowLeft, FiSend, FiBookmark, FiLink, FiCheckCircle, FiUpload 
} from 'react-icons/fi';

const JobDetails = () => {
  const { id } = useParams();
  const { user, profile, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Application Form States
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await API.get(`/jobs/detail/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  // Check if student has already applied to this job on mount/update
  useEffect(() => {
    const checkApplication = async () => {
      if (user?.role === 'student') {
        try {
          const res = await API.get('/students/applications');
          if (res.data.success) {
            const hasApplied = res.data.data.some(app => app.job._id === id);
            setApplied(hasApplied);
          }
        } catch (err) {
          console.error('Error checking application status:', err);
        }
      }
    };
    if (user && id) checkApplication();
  }, [user, id]);

  const handleDirectResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF documents are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploadingResume(true);
    setUploadProgress(0);
    try {
      const res = await API.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.size;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percentCompleted);
        }
      });
      if (res.data.success) {
        toast.success('Resume uploaded successfully! 📄');
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn('Please log in as a student to apply! 🔐');
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      toast.warn('Only students can submit job applications!');
      return;
    }
    if (!profile?.resume || !profile.resume.url) {
      toast.error('Please upload your resume before applying! 📄');
      return;
    }

    setApplying(true);
    try {
      const res = await API.post(`/applications/apply/${id}`, { coverLetter });
      if (res.data.success) {
        toast.success('Application submitted successfully! 🚀');
        setApplied(true);
        setCoverLetter('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user || user.role !== 'student') {
      toast.warn('Only students can bookmark job openings!');
      return;
    }
    const isSaved = profile?.savedJobs?.some(savedJob => (savedJob._id || savedJob) === id);
    try {
      const endpoint = isSaved ? `/jobs/${id}/unsave` : `/jobs/${id}/save`;
      const res = await API.post(endpoint);
      if (res.data.success) {
        toast.success(isSaved ? 'Bookmark removed' : 'Job bookmarked successfully! 🔖');
        refreshUser();
      }
    } catch (err) {
      toast.error('Error bookmarking job');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Job details link copied to clipboard! 🔗');
  };

  if (loading) return <Loader fullPage />;
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold">Job opening not found or has been removed.</h2>
        <Link to="/jobs" className="mt-4 inline-block text-primary hover:underline">Return to Search</Link>
      </div>
    );
  }

  const isSaved = profile?.savedJobs?.some(savedJob => (savedJob._id || savedJob) === id);
  const companyLogo = job.company?.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=100';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <FiArrowLeft className="mr-2" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Job Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Box */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-100 dark:border-slate-700/60 rounded-3xl smooth-shadow p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center space-x-5">
                  <img
                  src={companyLogo}
                  alt={job.company?.companyName || 'Platform'}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-700"
                />
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">{job.title}</h1>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {job.company ? (
                      <Link to={`/companies/${job.company._id}`} className="hover:underline">
                        {job.company.companyName}
                      </Link>
                    ) : (
                      <span>Platform</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Utility Action Buttons */}
              <div className="flex space-x-3 w-full md:w-auto">
                <button
                  onClick={handleSaveToggle}
                  className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                    isSaved
                      ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-550 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <FiBookmark className={isSaved ? 'fill-current' : ''} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-550 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center justify-center"
                  aria-label="Share Job Link"
                >
                  <FiLink />
                </button>
              </div>
            </div>

            {/* Content Details Box */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl smooth-shadow p-6 md:p-8 space-y-6">
              
              {/* Job Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-2xl text-xs text-slate-500">
                <div className="space-y-1">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block">Job Type</span>
                  <span className="text-slate-800 dark:text-white font-semibold text-sm flex items-center">
                    <FiBriefcase className="mr-1.5 text-primary" /> {job.jobType}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block">Location Mode</span>
                  <span className="text-slate-800 dark:text-white font-semibold text-sm flex items-center">
                    <FiMapPin className="mr-1.5 text-secondary" /> {job.workMode}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block">Experience</span>
                  <span className="text-slate-800 dark:text-white font-semibold text-sm flex items-center">
                    <FiClock className="mr-1.5 text-success" /> {job.experienceRequired}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block">Salary Package</span>
                  <span className="text-slate-800 dark:text-white font-semibold text-sm flex items-center">
                    <span className="mr-1.5 text-warning font-bold">₹</span>
                    {job.salary?.min 
                      ? `${((job.salary.min * 12) / 100000).toFixed(1).replace('.0', '')} LPA - ${((job.salary.max * 12) / 100000).toFixed(1).replace('.0', '')} LPA`
                      : 'Unspecified'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Job Description</h3>
                <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-350 whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Minimum Qualifications</h3>
                  <ul className="list-disc pl-5 text-sm leading-relaxed text-slate-650 dark:text-slate-350 space-y-1">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">What We Offer (Benefits)</h3>
                  <ul className="list-disc pl-5 text-sm leading-relaxed text-slate-650 dark:text-slate-350 space-y-1">
                    {job.benefits.map((ben, idx) => (
                      <li key={idx}>{ben}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills required */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <h3 className="text-xs font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider">Required Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-650 dark:text-slate-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Google Maps Location Mock */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Location Map</h3>
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-sky-200/40 dark:bg-slate-850/60">
                  {/* Grid Lines styling mapping mock grid map */}
                  <div className="w-full h-full bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
                </div>
                <div className="z-10 flex flex-col items-center text-center">
                  <FiMapPin className="w-8 h-8 text-primary animate-bounce mb-2" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{job.location}</h4>
                  <p className="text-[10px] text-slate-500">Google Maps coordinates initialized</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Company & Application Form */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Company Profile Brief */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-slate-700/60 pb-3">About Employer</h3>
              <div className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {job.company?.description || 'No description provided.'}
                </p>
                <div className="space-y-2 text-xs text-slate-500 pt-2">
                  {job.company?.website && (
                    <div className="flex items-center">
                      <FiGlobe className="mr-2 text-slate-400" />
                      <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {job.company.website}
                      </a>
                    </div>
                  )}
                  {job.company?.location && (
                    <div className="flex items-center">
                      <FiMapPin className="mr-2 text-slate-400" />
                      <span>Based in {job.company.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Application Submission Form */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-slate-700/60 pb-3">Submit Application</h3>
              
              {applied ? (
                <div className="text-center py-6 space-y-3">
                  <FiCheckCircle className="w-12 h-12 text-success mx-auto" />
                  <h4 className="text-sm font-bold text-slate-850 dark:text-white">Already Applied!</h4>
                  <p className="text-xs text-slate-400">
                    You submitted your application for this position. Monitor its progress under your student dashboard.
                  </p>
                  <Link
                    to="/student-dashboard/applications"
                    className="inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    Track Status
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attached Resume</label>
                    {user?.role === 'student' ? (
                      profile?.resume?.url ? (
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-650 dark:text-slate-350">
                          <span className="font-semibold truncate max-w-[200px]" title={profile.resume.filename}>
                            {profile.resume.filename || 'resume.pdf'}
                          </span>
                          <span className="text-[10px] text-success font-bold flex items-center flex-shrink-0">
                            <FiCheckCircle className="mr-1" /> Ready
                          </span>
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs space-y-3">
                          <p className="text-slate-450">No resume uploaded to your account profile.</p>
                          {uploadingResume ? (
                            <div className="space-y-1">
                              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                              </div>
                              <p className="text-[10px] font-semibold text-slate-400 animate-pulse">Uploading... {uploadProgress}%</p>
                            </div>
                          ) : (
                            <label className="inline-block cursor-pointer px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-95 transition-opacity">
                              Upload Resume PDF
                              <input type="file" onChange={handleDirectResumeUpload} accept=".pdf" className="hidden" />
                            </label>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 rounded-xl text-center text-xs text-slate-450">
                        Please log in as a student to attach a resume and apply.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Letter / Pitch</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows="4"
                      placeholder="Pitch why you are the best match for this role..."
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying || !profile?.resume?.url}
                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend />
                    <span>{applying ? 'Submitting...' : 'Apply for this Job'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;
