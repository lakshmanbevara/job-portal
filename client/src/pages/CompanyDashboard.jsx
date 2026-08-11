import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { LineChart, BarChart } from '../components/Charts';
import API from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiBriefcase, FiPlusCircle, FiList, FiUsers, FiSend, 
  FiFileText, FiCalendar, FiClock, FiCheck, FiX, FiCheckCircle, 
  FiMessageSquare, FiUpload, FiGlobe, FiMapPin, FiCpu 
} from 'react-icons/fi';

const CompanyDashboard = () => {
  const { user, profile, refreshUser } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'post-job' | 'manage-jobs' | 'applicants' | 'messages'
  const [loading, setLoading] = useState(false);

  // Sync activeTab with URL pathname so sidebar NavLinks work
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/post-job')) setActiveTab('post-job');
    else if (path.includes('/jobs')) setActiveTab('manage-jobs');
    else if (path.includes('/applicants')) setActiveTab('applicants');
    else if (path.includes('/messages')) setActiveTab('messages');
    else if (path.includes('/profile')) setActiveTab('profile');
    else setActiveTab('analytics');
  }, [location.pathname]);

  // Logo upload state
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Statistics
  const [stats, setStats] = useState({ jobsPosted: 0, applicantsCount: 0 });
  const [chartData, setChartData] = useState({ labels: [], dataValues: [] });

  // Post Job Form States
  const [title, setTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [expRequired, setExpRequired] = useState('No Experience');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [jobType, setJobType] = useState('Full Time');
  const [workMode, setWorkMode] = useState('On-site');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [categories, setCategories] = useState([]);

  // Manage Jobs & Applicants
  const [postedJobs, setPostedJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  // Interview Scheduler Modal States
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewDetails, setInterviewDetails] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Chat/DMs States
  const [chats, setChats] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Load categories and posted jobs
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) setJobCategory(res.data.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const loadDashboardData = async () => {
    if (!profile) return;
    try {
      const [jobsRes, applicantsRes] = await Promise.all([
        API.get('/jobs/company/posted'),
        API.get('/applications/company')
      ]);

      if (jobsRes.data.success) {
        setPostedJobs(jobsRes.data.data);
        setStats(prev => ({ ...prev, jobsPosted: jobsRes.data.data.length }));
      }
      if (applicantsRes.data.success) {
        setApplicants(applicantsRes.data.data);
        setStats(prev => ({ ...prev, applicantsCount: applicantsRes.data.data.length }));

        // Map monthly application counts for line chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const values = Array(12).fill(0);
        applicantsRes.data.data.forEach(app => {
          const month = new Date(app.createdAt).getMonth();
          values[month] += 1;
        });
        setChartData({ labels: months, dataValues: values });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [profile?._id, activeTab]);

  // Load chat conversations if messages tab is active
  useEffect(() => {
    const fetchChats = async () => {
      if (activeTab !== 'messages') return;
      try {
        const res = await API.get('/messages/recent/chats');
        if (res.data.success) {
          setChats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchChats();
  }, [activeTab]);

  const loadConversation = async (otherUserId) => {
    try {
      const res = await API.get(`/messages/conversation/${otherUserId}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectChat = (chatItem) => {
    setSelectedChatUser(chatItem.user);
    loadConversation(chatItem.user._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedChatUser) return;

    try {
      const res = await API.post('/messages', {
        recipientId: selectedChatUser._id,
        messageText: newMessageText
      });
      if (res.data.success) {
        setNewMessageText('');
        loadConversation(selectedChatUser._id);
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  // Post Job submit
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!title || !jobLocation || !minSalary || !maxSalary || !description) {
      toast.warn('Please fill in required fields');
      return;
    }

    try {
      const res = await API.post('/jobs', {
        title,
        location: jobLocation,
        minSalary: Number(minSalary),
        maxSalary: Number(maxSalary),
        experienceRequired: expRequired,
        skillsRequired,
        category: jobCategory,
        jobType,
        workMode,
        description,
        requirements,
        benefits
      });

      if (res.data.success) {
        toast.success('Job posted successfully! 🚀');
        setActiveTab('manage-jobs');
        // Reset form
        setTitle('');
        setJobLocation('');
        setMinSalary('');
        setMaxSalary('');
        setSkillsRequired('');
        setDescription('');
        setRequirements('');
        setBenefits('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error posting job');
    }
  };

  // Delete posted job
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This will also remove any related applications.')) return;
    try {
      const res = await API.delete(`/jobs/${id}`);
      if (res.data.success) {
        toast.success('Job posting deleted');
        loadDashboardData();
      }
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  // Upload Logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image uploads are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    setUploadingLogo(true);
    try {
      const res = await API.post('/companies/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success('Company logo updated! 🏢');
        refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Update applicant status (Accept / Reject)
  const updateAppStatus = async (appId, status) => {
    setSubmittingStatus(true);
    try {
      const res = await API.put(`/applications/${appId}/status`, { status });
      if (res.data.success) {
        toast.success(`Application marked as ${status}`);
        loadDashboardData();
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setSubmittingStatus(false);
    }
  };

  // Schedule Interview
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewDate || !interviewDetails) {
      toast.warn('Please fill in date and meeting details');
      return;
    }

    setSubmittingStatus(true);
    try {
      const res = await API.put(`/applications/${selectedApp._id}/status`, {
        status: 'Interview Scheduled',
        interviewDate,
        interviewDetails
      });
      if (res.data.success) {
        toast.success('Interview scheduled and student notified! 📅');
        setSelectedApp(null);
        setInterviewDate('');
        setInterviewDetails('');
        loadDashboardData();
      }
    } catch (err) {
      toast.error('Failed to schedule interview');
    } finally {
      setSubmittingStatus(false);
    }
  };

  if (!profile) return <Loader fullPage />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sidebar */}
      <Sidebar role="company" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Company Header Card */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={profile.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=150'}
              alt={profile.companyName}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-100 dark:border-slate-750"
            />
            <label className="absolute inset-0 bg-black/40 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-semibold">
              <FiUpload className="mr-1" /> Change
              <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
            </label>
          </div>
          
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">{profile.companyName}</h2>
              {profile.isVerified && <span className="p-0.5 bg-success/15 text-success rounded-full"><FiCheck className="w-3 h-3" /></span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{user?.email}</p>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
              Corporate Account
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold">
          {[
            { id: 'analytics', name: 'Analytics Dashboard' },
            { id: 'post-job', name: 'Post Job' },
            { id: 'manage-jobs', name: 'Manage Openings' },
            { id: 'applicants', name: `Applicants (${applicants.length})` },
            { id: 'messages', name: 'Chats' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 relative transition-colors ${
                activeTab === tab.id ? 'text-primary' : 'text-slate-450 hover:text-slate-750'
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/50 text-center">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Jobs Posted</span>
                <h4 className="text-3xl font-extrabold text-primary font-heading mt-2">{stats.jobsPosted}</h4>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/50 text-center">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Applications</span>
                <h4 className="text-3xl font-extrabold text-secondary font-heading mt-2">{stats.applicantsCount}</h4>
              </div>
            </div>

            {/* Line Chart */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/60">
              <h3 className="text-sm font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-4">Application Trends</h3>
              <LineChart labels={chartData.labels} dataValues={chartData.dataValues} labelName="Applications Received" />
            </div>
          </div>
        )}

        {/* Tab 2: Post Job */}
        {activeTab === 'post-job' && (
          <form onSubmit={handlePostJob} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 smooth-shadow space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b pb-3 flex items-center">
              <FiPlusCircle className="mr-2 text-primary" /> Create New Job Opening
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Frontend Engineer Intern"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location *</label>
                <input
                  type="text"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  required
                  placeholder="e.g. Bangalore, India (or Remote)"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category Sector *</label>
                <select
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Schedule *</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Government Jobs">Government Jobs</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Work Mode *</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience Level *</label>
                <select
                  value={expRequired}
                  onChange={(e) => setExpRequired(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="No Experience">No Experience</option>
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Min Monthly Salary * {minSalary ? `(Equivalent to ₹${((Number(minSalary) * 12) / 100000).toFixed(1).replace('.0', '')} LPA)` : ''}
                </label>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  required
                  placeholder="e.g. 20000"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Max Monthly Salary * {maxSalary ? `(Equivalent to ₹${((Number(maxSalary) * 12) / 100000).toFixed(1).replace('.0', '')} LPA)` : ''}
                </label>
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  required
                  placeholder="e.g. 35000"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required Skills (Comma separated) *</label>
              <input
                type="text"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                required
                placeholder="React, Node.js, Redux, JavaScript"
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                placeholder="Describe role responsibilities, growth, and team alignment details..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minimum Requirements (One per line)</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows="3"
                placeholder="e.g. Enrolled in Computer Science B.Tech&#10;Familiarity with Git/GitHub"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Benefits & Perks (One per line)</label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                rows="3"
                placeholder="e.g. Free Meals & Snacks&#10;PPO opportunities"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-md"
            >
              Post Job Listing
            </button>
          </form>
        )}

        {/* Tab 3: Manage Jobs */}
        {activeTab === 'manage-jobs' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b pb-3 flex items-center">
              <FiList className="mr-2 text-primary" /> Active Job Postings
            </h3>
            
            {postedJobs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No jobs posted yet.</p>
            ) : (
              <div className="space-y-4">
                {postedJobs.map((job) => (
                  <div key={job._id} className="p-5 border border-slate-100 dark:border-slate-700/40 bg-slate-50/20 dark:bg-slate-800/10 rounded-2xl flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-850 dark:text-white">{job.title}</h4>
                      <p className="text-[10px] text-slate-450">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                      <div className="flex space-x-2 pt-1">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">{job.jobType}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-550 dark:text-slate-350 font-semibold">{job.workMode}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDeleteJob(job._id)} 
                        className="px-3.5 py-2 border border-danger text-danger hover:bg-danger/10 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Applicants */}
        {activeTab === 'applicants' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b pb-3 flex items-center">
              <FiUsers className="mr-2 text-primary" /> Track Candidates
            </h3>

            {applicants.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No students have applied to your postings yet.</p>
            ) : (
              <div className="space-y-6">
                {applicants.map((app) => (
                  <div key={app._id} className="p-6 border border-slate-100 dark:border-slate-700/40 rounded-2xl space-y-4 bg-slate-50/20 dark:bg-slate-800/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-slate-850 dark:text-white">
                          {app.student?.user?.name || 'Anonymous Student'}
                        </h4>
                        <p className="text-xs text-slate-450 mt-0.5">Applied for: <span className="font-bold text-slate-700 dark:text-slate-300">{app.job?.title}</span></p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        app.status === 'Accepted' ? 'bg-success/15 text-success' :
                        app.status === 'Rejected' ? 'bg-danger/15 text-danger' :
                        app.status === 'Interview Scheduled' ? 'bg-warning/15 text-warning' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    {app.coverLetter && (
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-800/60 p-4 border rounded-xl">
                        <span className="font-bold block text-slate-400 mb-1">Cover Letter:</span>
                        {app.coverLetter}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-750/30 text-xs">
                      {app.resume?.url ? (
                        <a 
                          href={app.resume.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center text-primary font-semibold hover:underline"
                        >
                          <FiFileText className="mr-1.5" /> View Student Resume PDF
                        </a>
                      ) : (
                        <span className="text-slate-400">No Resume Attached</span>
                      )}

                      {/* Evaluative buttons */}
                      {app.status === 'Applied' || app.status === 'Reviewing' ? (
                        <div className="flex space-x-2 w-full sm:w-auto">
                          <button
                            onClick={() => updateAppStatus(app._id, 'Reviewing')}
                            className="flex-1 sm:flex-none px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl font-bold transition-colors"
                          >
                            Mark Reviewing
                          </button>
                          
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="flex-1 sm:flex-none px-3.5 py-1.5 bg-warning text-white font-bold rounded-xl shadow-sm hover:opacity-95"
                          >
                            Schedule Interview
                          </button>
                          
                          <button
                            onClick={() => updateAppStatus(app._id, 'Accepted')}
                            className="p-2 border border-success text-success hover:bg-success/10 rounded-xl"
                            title="Accept Candidate"
                          >
                            <FiCheck />
                          </button>
                          
                          <button
                            onClick={() => updateAppStatus(app._id, 'Rejected')}
                            className="p-2 border border-danger text-danger hover:bg-danger/10 rounded-xl"
                            title="Reject Candidate"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : app.status === 'Interview Scheduled' ? (
                        <div className="flex space-x-2 w-full sm:w-auto">
                          <button
                            onClick={() => updateAppStatus(app._id, 'Accepted')}
                            className="flex-1 sm:flex-none px-4 py-1.5 bg-success text-white font-bold rounded-xl shadow-sm"
                          >
                            Hire Candidate
                          </button>
                          <button
                            onClick={() => updateAppStatus(app._id, 'Rejected')}
                            className="flex-1 sm:flex-none px-4 py-1.5 border border-danger text-danger hover:bg-danger/5 rounded-xl font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Chats / Messages */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl smooth-shadow h-[500px] flex overflow-hidden">
            
            {/* Chats Sidebar */}
            <div className="w-1/3 border-r border-slate-100 dark:border-slate-700/60 overflow-y-auto">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/65 font-bold text-sm">
                Conversations
              </div>
              <div>
                {chats.length === 0 ? (
                  <p className="text-center text-xs text-slate-455 py-10">No chats yet</p>
                ) : (
                  chats.map((c) => (
                    <button
                      key={c.user._id}
                      onClick={() => selectChat(c)}
                      className={`w-full p-4 text-left text-xs border-b border-slate-50 dark:border-slate-700/25 flex justify-between items-center hover:bg-slate-50/50 transition-colors ${
                        selectedChatUser?._id === c.user._id ? 'bg-primary/5 dark:bg-slate-800/80 font-bold' : ''
                      }`}
                    >
                      <div className="truncate pr-2">
                        <h4 className="font-bold text-slate-800 dark:text-white text-xs">{c.user.name}</h4>
                        <p className="text-slate-450 truncate text-[10px] mt-0.5">{c.lastMessage}</p>
                      </div>
                      {c.unread && <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Conversation Thread */}
            <div className="w-2/3 flex flex-col justify-between">
              {selectedChatUser ? (
                <>
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/20 dark:bg-slate-900/10 font-bold text-sm">
                    {selectedChatUser.name}
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-900/10 text-xs">
                    {messages.length === 0 ? (
                      <p className="text-center text-slate-400 py-10">No messages. Say Hello!</p>
                    ) : (
                      messages.map((m) => {
                        const isMe = m.sender._id === user.id;
                        return (
                          <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl border text-xs shadow-sm ${
                              isMe 
                                ? 'bg-primary border-primary text-white rounded-tr-none' 
                                : 'bg-white dark:bg-slate-800 border-slate-150 dark:border-slate-700 text-slate-800 dark:text-white rounded-tl-none'
                            }`}>
                              <p>{m.messageText}</p>
                              <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-700/60 flex gap-2">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                    />
                    <button type="submit" className="p-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm flex items-center justify-center">
                      <FiSend className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <FiMessageSquare className="w-10 h-10" />
                  <p className="text-xs">Select a student contact to initiate messaging.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Modal: Schedule Interview */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule Interview</h3>
              <button onClick={() => setSelectedApp(null)} className="p-1 text-slate-400 hover:text-slate-650"><FiX className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting details / link *</label>
                <textarea
                  required
                  rows="3"
                  value={interviewDetails}
                  onChange={(e) => setInterviewDetails(e.target.value)}
                  placeholder="e.g. Google Meet link, dress codes or preparation codes..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingStatus}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-md"
              >
                {submittingStatus ? 'Scheduling...' : 'Confirm Schedule'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default CompanyDashboard;
