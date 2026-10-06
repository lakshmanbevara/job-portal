import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import JobCard from '../components/JobCard';
import API from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiUser, FiFileText, FiBookmark, FiPlus, FiTrash2, 
  FiUpload, FiBriefcase, FiMapPin, FiCalendar, FiBookOpen, 
  FiCpu, FiSend, FiMessageSquare, FiTrendingUp, FiPlusCircle,
  FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';

const StudentDashboard = () => {
  const { user, profile, refreshUser, loading: authLoading } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'profile' | 'applications' | 'saved' | 'messages'
  const [loading, setLoading] = useState(false);

  // Resume Upload state
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Skill Add state
  const [newSkill, setNewSkill] = useState('');

  // Experience form states
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDesc, setExpDesc] = useState('');
  const [showExpForm, setShowExpForm] = useState(false);

  // Education form states
  const [eduSchool, setEduSchool] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStartYear, setEduStartYear] = useState('');
  const [eduEndYear, setEduEndYear] = useState('');
  const [eduGrade, setEduGrade] = useState('');
  const [showEduForm, setShowEduForm] = useState(false);

  // Project form states
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projLink, setProjLink] = useState('');
  const [projTech, setProjTech] = useState('');
  const [showProjForm, setShowProjForm] = useState(false);

  // Direct Message states
  const [chats, setChats] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Loaded applications / saved jobs / notifications / latest jobs
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);

  // Safe fallback for student profile fields to prevent type errors
  const safeProfile = profile || {
    skills: [],
    education: [],
    experience: [],
    projects: [],
    resume: { url: '', filename: '' },
    profilePhoto: ''
  };

  // Sync activeTab with URL pathname
  useEffect(() => {
    if (location.pathname.includes('/applications')) {
      setActiveTab('applications');
    } else if (location.pathname.includes('/saved-jobs')) {
      setActiveTab('saved');
    } else if (location.pathname.includes('/messages')) {
      setActiveTab('messages');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Load dashboard, jobs and notifications
  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [appRes, meRes, notifRes, jobsRes] = await Promise.all([
        API.get('/students/applications').catch(() => ({ data: { success: false } })),
        API.get('/auth/me').catch(() => ({ data: { success: false } })),
        API.get('/notifications').catch(() => ({ data: { success: false } })),
        API.get('/jobs?limit=3').catch(() => ({ data: { success: false } }))
      ]);

      if (appRes.data.success) {
        setAppliedJobs(appRes.data.data);
      }
      if (meRes.data.success && meRes.data.profile) {
        setSavedJobs(meRes.data.profile.savedJobs || []);
      }
      if (notifRes.data.success) {
        setNotifications(notifRes.data.data);
      }
      if (jobsRes.data.success) {
        setLatestJobs(jobsRes.data.data);
      }
    } catch (err) {
      console.error('Error loading student dashboard details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.id, activeTab]);

  // Load chat conversations if messages tab is selected
  useEffect(() => {
    const fetchChats = async () => {
      if (activeTab !== 'messages') return;
      try {
        const res = await API.get('/messages/recent/chats');
        if (res.data.success) {
          setChats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching chat directories:', err);
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
      console.error('Error loading messaging thread:', err);
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

  // Upload Resume handler
  const handleResumeUpload = async (e) => {
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

  // Add Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const updatedSkills = [...(safeProfile.skills || []), newSkill.trim()];
    try {
      const res = await API.put('/students/profile', { skills: updatedSkills });
      if (res.data.success) {
        toast.success('Skill added');
        setNewSkill('');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to add skill');
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (skillToDelete) => {
    const updatedSkills = (safeProfile.skills || []).filter(s => s !== skillToDelete);
    try {
      const res = await API.put('/students/profile', { skills: updatedSkills });
      if (res.data.success) {
        toast.success('Skill removed');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to remove skill');
    }
  };

  // Add Experience
  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (!expCompany || !expRole || !expStartDate) {
      toast.warn('Please fill in required fields');
      return;
    }

    try {
      const res = await API.post('/students/experience', {
        company: expCompany,
        role: expRole,
        startDate: expStartDate,
        endDate: expCurrent ? null : expEndDate,
        current: expCurrent,
        description: expDesc
      });
      if (res.data.success) {
        toast.success('Experience entry added! 💼');
        setShowExpForm(false);
        setExpCompany('');
        setExpRole('');
        setExpStartDate('');
        setExpEndDate('');
        setExpCurrent(false);
        setExpDesc('');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to add experience');
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      const res = await API.delete(`/students/experience/${id}`);
      if (res.data.success) {
        toast.success('Experience deleted');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to delete experience');
    }
  };

  // Add Education
  const handleAddEducation = async (e) => {
    e.preventDefault();
    if (!eduSchool || !eduDegree || !eduField || !eduStartYear) {
      toast.warn('Please fill in required education fields');
      return;
    }

    try {
      const res = await API.post('/students/education', {
        school: eduSchool,
        degree: eduDegree,
        fieldOfStudy: eduField,
        startYear: eduStartYear,
        endYear: eduEndYear,
        grade: eduGrade
      });
      if (res.data.success) {
        toast.success('Education entry added! 🎓');
        setShowEduForm(false);
        setEduSchool('');
        setEduDegree('');
        setEduField('');
        setEduStartYear('');
        setEduEndYear('');
        setEduGrade('');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to add education');
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      const res = await API.delete(`/students/education/${id}`);
      if (res.data.success) {
        toast.success('Education entry removed');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to delete education');
    }
  };

  // Add Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projTitle || !projDesc) {
      toast.warn('Please fill in project title & description');
      return;
    }

    try {
      const res = await API.post('/students/projects', {
        title: projTitle,
        description: projDesc,
        link: projLink,
        technologies: projTech.split(',').map(t => t.trim()).filter(Boolean)
      });
      if (res.data.success) {
        toast.success('Project added! 🚀');
        setShowProjForm(false);
        setProjTitle('');
        setProjDesc('');
        setProjLink('');
        setProjTech('');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to add project');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await API.delete(`/students/projects/${id}`);
      if (res.data.success) {
        toast.success('Project removed');
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  // Calculate Profile Completion Percentage (Score out of 100)
  const calculateProfileCompletion = () => {
    let score = 0;
    if (safeProfile.resume?.url) score += 20;
    if (safeProfile.skills?.length > 0) score += 20;
    if (safeProfile.education?.length > 0) score += 20;
    if (safeProfile.experience?.length > 0) score += 20;
    if (safeProfile.projects?.length > 0) score += 20;
    return score;
  };

  const completionScore = calculateProfileCompletion();

  if (authLoading) return <Loader fullPage />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Dashboard Sidebar */}
      <Sidebar role="student" />

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Profile Card Header */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow flex flex-col sm:flex-row items-center gap-6">
          <img
            src={safeProfile.profilePhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-primary"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200';
            }}
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">{user?.name || 'Student Candidate'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{user?.email}</p>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase mt-1">
              University Student
            </span>
          </div>
        </div>

        {/* Dashboard Tabs Selector */}
        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold overflow-x-auto pb-1">
          {[
            { id: 'dashboard', name: 'Dashboard Overview' },
            { id: 'profile', name: 'Profile & Credentials' },
            { id: 'applications', name: 'Applied Internships' },
            { id: 'saved', name: 'Bookmarks' },
            { id: 'messages', name: 'Chats' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 relative transition-colors whitespace-nowrap ${
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

        {/* Tab 0: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 smooth-shadow flex items-center space-x-4">
                <div className="p-3.5 bg-primary/10 rounded-xl text-primary">
                  <FiFileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{appliedJobs.length}</h4>
                  <p className="text-xs text-slate-400 font-semibold">Total Applications</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 smooth-shadow flex items-center space-x-4">
                <div className="p-3.5 bg-secondary/10 rounded-xl text-secondary">
                  <FiBookmark className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{savedJobs.length}</h4>
                  <p className="text-xs text-slate-400 font-semibold">Saved Jobs</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 smooth-shadow flex items-center space-x-4">
                <div className="p-3.5 bg-warning/10 rounded-xl text-warning">
                  <FiCalendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {appliedJobs.filter(a => a.status === 'Interview Scheduled').length}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold">Interviews Slated</p>
                </div>
              </div>
            </div>

            {/* Profile Completion Progress Bar */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 smooth-shadow space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-655 dark:text-slate-355">
                <span>Profile Progress Check</span>
                <span className="text-primary">{completionScore}% Complete</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${completionScore}%` }}
                ></div>
              </div>
            </div>

            {/* Grid Layout: Main Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Recent Applications & Latest Jobs */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Recent Applications Card */}
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center">
                    <FiTrendingUp className="mr-2 text-primary" /> Recent Applications
                  </h3>
                  
                  {appliedJobs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No submissions yet. Build your resume and start applying!</p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-750">
                      {appliedJobs.slice(0, 3).map((app) => (
                        <div key={app._id} className="py-3 flex justify-between items-center text-xs">
                          <div>
                            <Link to={`/jobs/detail/${app.job?._id}`} className="font-bold text-slate-800 dark:text-slate-100 hover:text-primary hover:underline">
                              {app.job?.title || 'Job Opening'}
                            </Link>
                            <p className="text-slate-450 mt-0.5">{app.job?.company?.companyName || 'Anonymous'}</p>
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
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested Latest Openings */}
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center">
                      <FiBriefcase className="mr-2 text-secondary" /> Latest Internships & Jobs
                    </h3>
                    <Link to="/jobs" className="text-xs font-semibold text-primary hover:underline">Browse All</Link>
                  </div>
                  
                  {latestJobs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No jobs active at this moment.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {latestJobs.map((job) => (
                        <JobCard key={job._id} job={job} saved={savedJobs.some(j => (j._id || j) === job._id)} />
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Quick Actions & Notifications */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Profile Completion Checklist */}
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Completion Checklist</h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { label: 'Upload PDF Resume', done: !!safeProfile.resume?.url },
                      { label: 'Specify Key Skills', done: safeProfile.skills?.length > 0 },
                      { label: 'Add Academic Projects', done: safeProfile.projects?.length > 0 },
                      { label: 'Add Education Entries', done: safeProfile.education?.length > 0 },
                      { label: 'Add Experience Records', done: safeProfile.experience?.length > 0 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between font-semibold">
                        <span className={item.done ? 'text-slate-400 line-through' : 'text-slate-655 dark:text-slate-355'}>{item.label}</span>
                        {item.done ? (
                          <FiCheckCircle className="text-success w-4.5 h-4.5 flex-shrink-0" />
                        ) : (
                          <FiAlertCircle className="text-warning w-4.5 h-4.5 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Quick Actions</h3>
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => setActiveTab('profile')} 
                      className="w-full text-left py-2.5 px-3.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-primary/5 dark:hover:bg-slate-755 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      📄 Manage PDF Resume
                    </button>
                    <Link 
                      to="/jobs" 
                      className="w-full text-left py-2.5 px-3.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-primary/5 dark:hover:bg-slate-755 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 transition-colors block"
                    >
                      🔍 Search Internships
                    </Link>
                    <button 
                      onClick={() => setActiveTab('messages')} 
                      className="w-full text-left py-2.5 px-3.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-primary/5 dark:hover:bg-slate-755 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      💬 Open Recruiter Chats
                    </button>
                  </div>
                </div>

                {/* Recent Notifications Card */}
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">In-App Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-3 text-center">No notifications at the moment.</p>
                  ) : (
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {notifications.slice(0, 4).map((notif) => (
                        <div key={notif._id} className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-855 rounded-xl text-[10px] space-y-1">
                          <p className="font-semibold text-slate-755 dark:text-slate-200 leading-normal">{notif.message}</p>
                          <span className="block text-[8px] text-slate-400 text-right">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab 1: Profile & Credentials */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            {/* Resume Upload Container */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center">
                <FiFileText className="mr-2 text-primary" />
                Resume Upload (PDF)
              </h3>
              
              {safeProfile.resume?.url ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-655 dark:text-slate-355">
                  <div className="flex items-center space-x-3">
                    <FiFileText className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-855 dark:text-slate-100 truncate max-w-[250px]">{safeProfile.resume.filename || 'Uploaded_CV.pdf'}</h4>
                      <a href={safeProfile.resume.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold block mt-0.5">
                        Download / View PDF
                      </a>
                    </div>
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-650 text-slate-700 dark:text-white rounded-xl text-xs font-semibold transition-colors">
                    {uploadingResume ? 'Uploading...' : 'Replace PDF'}
                    <input type="file" onChange={handleResumeUpload} accept=".pdf" className="hidden" disabled={uploadingResume} />
                  </label>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3">
                  <FiUpload className="w-10 h-10 text-slate-400 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-855 dark:text-white">Upload Your Professional CV</h4>
                    <p className="text-xs text-slate-455 mt-1">Please upload in PDF format (Max size: 5MB)</p>
                  </div>
                  {uploadingResume ? (
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400">Uploading... {uploadProgress}%</p>
                    </div>
                  ) : (
                    <label className="inline-block cursor-pointer px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-xs font-semibold transition-opacity hover:opacity-95 shadow-md">
                      Select File
                      <input type="file" onChange={handleResumeUpload} accept=".pdf" className="hidden" />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Skills Container */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center">
                <FiCpu className="mr-2 text-secondary" />
                Key Skills & Technologies
              </h3>
              <form onSubmit={handleAddSkill} className="flex gap-3 max-w-md">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. Figma, React, Python"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary"
                />
                <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl flex items-center space-x-1 shadow-sm">
                  <FiPlus /> <span>Add</span>
                </button>
              </form>
              <div className="flex flex-wrap gap-2 pt-2">
                {(safeProfile.skills || []).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-655 dark:text-slate-200 rounded-full"
                  >
                    <span>{skill}</span>
                    <button onClick={() => handleDeleteSkill(skill)} className="ml-1.5 text-danger hover:text-red-700">
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Panel */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center">
                  <FiBriefcase className="mr-2 text-success" />
                  Work Experience
                </h3>
                <button
                  onClick={() => setShowExpForm(!showExpForm)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                >
                  <FiPlus /> <span>Add Entry</span>
                </button>
              </div>

              {showExpForm && (
                <form onSubmit={handleAddExperience} className="p-4 border border-slate-150 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Company Name *"
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      required
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Job/Intern Role *"
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      required
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">Start Date *</label>
                      <input
                        type="date"
                        value={expStartDate}
                        onChange={(e) => setExpStartDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">End Date</label>
                      <input
                        type="date"
                        value={expEndDate}
                        onChange={(e) => setExpEndDate(e.target.value)}
                        disabled={expCurrent}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-655">
                    <input
                      type="checkbox"
                      checked={expCurrent}
                      onChange={(e) => setExpCurrent(e.target.checked)}
                      className="rounded text-primary"
                    />
                    <span>I currently work here</span>
                  </label>
                  <textarea
                    placeholder="Brief description of your roles & projects..."
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                  />
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">Save</button>
                    <button type="button" onClick={() => setShowExpForm(false)} className="px-5 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {(safeProfile.experience || []).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No experience entries added.</p>
                ) : (
                  (safeProfile.experience || []).map((exp) => (
                    <div key={exp._id} className="flex justify-between items-start p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10 rounded-2xl">
                      <div className="space-y-1.5 text-xs text-slate-500">
                        <h4 className="text-sm font-bold text-slate-855 dark:text-white">{exp.role}</h4>
                        <div className="flex items-center space-x-3 text-[11px] font-semibold text-slate-455">
                          <span className="flex items-center"><FiBriefcase className="mr-1" /> {exp.company}</span>
                          <span className="flex items-center"><FiCalendar className="mr-1" /> 
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Current' : new Date(exp.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        {exp.description && <p className="pt-2 leading-relaxed">{exp.description}</p>}
                      </div>
                      <button onClick={() => handleDeleteExperience(exp._id)} className="p-1.5 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Education Panel */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center">
                  <FiBookOpen className="mr-2 text-warning" />
                  Education Credentials
                </h3>
                <button
                  onClick={() => setShowEduForm(!showEduForm)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                >
                  <FiPlus /> <span>Add Entry</span>
                </button>
              </div>

              {showEduForm && (
                <form onSubmit={handleAddEducation} className="p-4 border border-slate-150 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="School/College Name *"
                      value={eduSchool}
                      onChange={(e) => setEduSchool(e.target.value)}
                      required
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Degree (e.g. B.Tech) *"
                      value={eduDegree}
                      onChange={(e) => setEduDegree(e.target.value)}
                      required
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study (e.g. Computer Science) *"
                      value={eduField}
                      onChange={(e) => setEduField(e.target.value)}
                      required
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Grade/CGPA (e.g. 9.0 CGPA)"
                      value={eduGrade}
                      onChange={(e) => setEduGrade(e.target.value)}
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <input
                      type="number"
                      placeholder="Start Year (YYYY) *"
                      value={eduStartYear}
                      onChange={(e) => setEduStartYear(e.target.value)}
                      required
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <input
                      type="number"
                      placeholder="End Year (YYYY)"
                      value={eduEndYear}
                      onChange={(e) => setEduEndYear(e.target.value)}
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">Save</button>
                    <button type="button" onClick={() => setShowEduForm(false)} className="px-5 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {(safeProfile.education || []).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No education entries added.</p>
                ) : (
                  (safeProfile.education || []).map((edu) => (
                    <div key={edu._id} className="flex justify-between items-start p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10 rounded-2xl">
                      <div className="space-y-1.5 text-xs text-slate-500">
                        <h4 className="text-sm font-bold text-slate-855 dark:text-white">{edu.degree} in {edu.fieldOfStudy}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-455">
                          <span>School: {edu.school}</span>
                          <span>Duration: {edu.startYear} - {edu.endYear || 'Present'}</span>
                          {edu.grade && <span className="text-primary font-bold">Grade: {edu.grade}</span>}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteEducation(edu._id)} className="p-1.5 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Projects Panel */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center">
                  <FiPlusCircle className="mr-2 text-primary" />
                  Academic / Side Projects
                </h3>
                <button
                  onClick={() => setShowProjForm(!showProjForm)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                >
                  <FiPlus /> <span>Add Project</span>
                </button>
              </div>

              {showProjForm && (
                <form onSubmit={handleAddProject} className="p-4 border border-slate-150 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Project Title *"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      required
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <input
                      type="url"
                      placeholder="Live Link / GitHub URL"
                      value={projLink}
                      onChange={(e) => setProjLink(e.target.value)}
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Technologies (comma-separated, e.g. React, Mui)"
                      value={projTech}
                      onChange={(e) => setProjTech(e.target.value)}
                      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl sm:col-span-2"
                    />
                  </div>
                  <textarea
                    placeholder="Describe project outcomes & engineering details *"
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    rows="3"
                    required
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
                  />
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">Save</button>
                    <button type="button" onClick={() => setShowProjForm(false)} className="px-5 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {(safeProfile.projects || []).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No projects listed.</p>
                ) : (
                  (safeProfile.projects || []).map((proj) => (
                    <div key={proj._id} className="flex justify-between items-start p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10 rounded-2xl">
                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-bold text-slate-855 dark:text-white">{proj.title}</h4>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center font-bold">
                              Live Demo
                            </a>
                          )}
                        </div>
                        <p className="leading-relaxed">{proj.description}</p>
                        {proj.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {proj.technologies.map((t, i) => (
                              <span key={i} className="px-2 py-0.5 text-[9px] font-semibold bg-slate-100 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-350">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleDeleteProject(proj._id)} className="p-1.5 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg">
                        <FiTrash2 />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Applied Internships */}
        {activeTab === 'applications' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b pb-3 flex items-center">
              <FiFileText className="mr-2 text-primary" /> Track Applications
            </h3>

            {appliedJobs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">You have not submitted any applications yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Job Title</th>
                      <th className="py-3 px-4">Employer</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Interview Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliedJobs.map((app) => (
                      <tr key={app._id} className="border-b border-slate-50 dark:border-slate-700/35 hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-white">
                          <Link to={`/jobs/detail/${app.job?._id}`} className="hover:text-primary hover:underline">
                            {app.job?.title || 'Job Opening'}
                          </Link>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-655 dark:text-slate-355">
                          {app.job?.company?.companyName || 'Anonymous'}
                        </td>
                        <td className="py-4 px-4 text-slate-450">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            app.status === 'Accepted' ? 'bg-success/15 text-success' :
                            app.status === 'Rejected' ? 'bg-danger/15 text-danger' :
                            app.status === 'Interview Scheduled' ? 'bg-warning/15 text-warning' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-[200px]">
                          {app.status === 'Interview Scheduled' && app.interviewDate ? (
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {new Date(app.interviewDate).toLocaleString()}
                              </span>
                              {app.interviewDetails && <p className="text-[10px] text-slate-400 truncate" title={app.interviewDetails}>{app.interviewDetails}</p>}
                            </div>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Bookmarks */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center border-b pb-3">
                <FiBookmark className="mr-2 text-primary" /> Bookmarked Openings
              </h3>
              
              {savedJobs.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">You have no saved jobs currently.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {savedJobs.map((job) => (
                    <JobCard 
                      key={job._id} 
                      job={job} 
                      saved={true} 
                      onSaveToggle={(id, isSaved) => {
                        if (!isSaved) {
                          setSavedJobs(prev => prev.filter(j => j._id !== id));
                        }
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Chats / Messages */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl smooth-shadow h-[500px] flex overflow-hidden">
            
            {/* Chats Sidebar */}
            <div className="w-1/3 border-r border-slate-100 dark:border-slate-700/60 overflow-y-auto">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700/65 font-bold text-sm">
                Conversations
              </div>
              <div>
                {chats.length === 0 ? (
                  <p className="text-center text-xs text-slate-450 py-10">No chats yet</p>
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
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/20 dark:bg-slate-900/10 font-bold text-sm">
                    {selectedChatUser.name}
                  </div>

                  {/* Message feed */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-900/10 text-xs">
                    {messages.length === 0 ? (
                      <p className="text-center text-slate-400 py-10">No message logs. Say Hello!</p>
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

                  {/* Message input */}
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
                  <p className="text-xs">Select a contact conversation to start messaging.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default StudentDashboard;
