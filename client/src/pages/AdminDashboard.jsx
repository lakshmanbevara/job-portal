import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { LineChart, BarChart } from '../components/Charts';
import API from '../services/api';
import { toast } from 'react-toastify';
import { useTheme, ACCENT_THEMES } from '../context/ThemeContext';
import { 
  FiUsers, FiGrid, FiBriefcase, FiFileText, FiCheck, FiX, 
  FiTrash2, FiActivity, FiDollarSign, FiSettings, FiSun, FiMoon,
  FiImage, FiRefreshCw, FiLock, FiShield, FiKey, FiCheckCircle, FiEdit
} from 'react-icons/fi';

// Admin login credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@adminpanel.com',
  password: 'admin#18',
  role: 'System Administrator'
};

const AdminDashboard = () => {
  const location = useLocation();
  const { darkMode, toggleTheme, accentTheme, changeAccent } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Sync activeTab with URL pathname
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/students')) setActiveTab('students');
    else if (path.includes('/companies')) setActiveTab('companies');
    else if (path.includes('/jobs')) setActiveTab('jobs');
    else if (path.includes('/settings')) setActiveTab('settings');
    else if (path.includes('/add-company')) setActiveTab('add-company');
    else setActiveTab('overview');
  }, [location.pathname]);

  // Add Company form state (dedicated tab)
  const [regCompanyName, setRegCompanyName]   = useState('');
  const [regEmail, setRegEmail]               = useState('');
  const [regPassword, setRegPassword]         = useState('');
  const [regLocation, setRegLocation]         = useState('');
  const [regWebsite, setRegWebsite]           = useState('');
  const [regIndustry, setRegIndustry]         = useState('');
  const [regDesc, setRegDesc]                 = useState('');
  const [regEmployeeCount, setRegEmployeeCount] = useState('');
  const [regLogoPreview, setRegLogoPreview]   = useState('');
  const [regLogoUrl, setRegLogoUrl]           = useState('');
  const [registering, setRegistering]         = useState(false);
  const [showPassword, setShowPassword]       = useState(false);
  const regLogoRef = useRef(null);

  // Statistics & Charts
  const [stats, setStats] = useState({ students: 0, companies: 0, jobs: 0, applications: 0 });
  const [growthData, setGrowthData] = useState({ labels: [], users: [], revenue: [] });

  // Data lists
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Edit Company state
  const [editingCompany, setEditingCompany] = useState(null);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editLogoPreview, setEditLogoPreview] = useState('');
  const [savingCompany, setSavingCompany] = useState(false);
  const editLogoRef = useRef(null);

  // Site branding state (localStorage-persisted)
  const [siteName, setSiteName] = useState(() => localStorage.getItem('siteName') || 'StudentJobPortal');
  const [siteTagline, setSiteTagline] = useState(() => localStorage.getItem('siteTagline') || 'Premium Jobs & Internships for Students');
  const [heroBannerUrl, setHeroBannerUrl] = useState(() => localStorage.getItem('heroBannerUrl') || '');
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('logoUrl') || '');
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, companiesRes, jobsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/students'),
        API.get('/admin/companies'),
        API.get('/admin/jobs')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setGrowthData(statsRes.data.growth);
      }
      if (studentsRes.data.success) setStudents(studentsRes.data.data);
      if (companiesRes.data.success) setCompanies(companiesRes.data.data);
      if (jobsRes.data.success) setJobs(jobsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin dashboard records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const handleVerifyCompany = async (companyId) => {
    try {
      const res = await API.put(`/admin/companies/${companyId}/verify`);
      if (res.data.success) {
        toast.success(res.data.verified ? 'Company verified!' : 'Company verification removed');
        loadAdminData();
      }
    } catch (err) {
      toast.error('Error updating verification status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
    try {
      const res = await API.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        toast.success('User deleted successfully');
        loadAdminData();
      }
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job opening?')) return;
    try {
      const res = await API.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        toast.success('Job posting deleted');
        loadAdminData();
      }
    } catch (err) {
      toast.error('Failed to delete job posting');
    }
  };

  // Edit company modal handlers
  const openEditCompanyModal = (company) => {
    setEditingCompany(company);
    setEditCompanyName(company.companyName);
    setEditLogoUrl(company.logo || '');
    setEditLogoPreview(company.logo || '');
  };

  const handleEditLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditLogoPreview(ev.target.result);
      setEditLogoUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCompanyEdit = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    try {
      const res = await API.put(`/admin/companies/${editingCompany._id}`, {
        companyName: editCompanyName,
        logoUrl: editLogoUrl
      });
      if (res.data.success) {
        toast.success('Company updated successfully!');
        setEditingCompany(null);
        loadAdminData();
      }
    } catch (err) {
      toast.error('Failed to update company');
    } finally {
      setSavingCompany(false);
    }
  };

  // Add Company (admin action) — sends all fields to backend
  const handleRegisterCompany = async (e) => {
    e.preventDefault();
    if (!regCompanyName || !regEmail || !regPassword) {
      toast.warn('Company Name, Login Email and Password are required');
      return;
    }
    setRegistering(true);
    try {
      const res = await API.post('/admin/companies/register', {
        companyName:   regCompanyName,
        email:         regEmail,
        password:      regPassword,
        location:      regLocation,
        website:       regWebsite,
        industry:      regIndustry,
        description:   regDesc,
        employeeCount: regEmployeeCount,
        logoUrl:       regLogoUrl
      });
      if (res.data.success) {
        toast.success(`🏢 "${regCompanyName}" registered! Login: ${regEmail}`);
        // Reset all fields
        setRegCompanyName(''); setRegEmail(''); setRegPassword('');
        setRegLocation('');    setRegWebsite(''); setRegIndustry('');
        setRegDesc('');        setRegEmployeeCount(''); 
        setRegLogoPreview(''); setRegLogoUrl('');
        loadAdminData();
        setActiveTab('companies'); // jump to companies list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register company');
    } finally {
      setRegistering(false);
    }
  };

  // Logo file → base64 preview
  const handleRegLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRegLogoPreview(ev.target.result);
      setRegLogoUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ──────── SITE SETTINGS HANDLERS ────────
  const saveBranding = () => {
    localStorage.setItem('siteName', siteName);
    localStorage.setItem('siteTagline', siteTagline);
    toast.success('Site branding saved! ✅');
    // Force refresh so Navbar picks it up
    window.dispatchEvent(new Event('storage'));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image'); return; }
    setUploadingBanner(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      setHeroBannerUrl(url);
      localStorage.setItem('heroBannerUrl', url);
      setUploadingBanner(false);
      toast.success('Hero banner updated! 🖼️');
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image'); return; }
    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      setLogoUrl(url);
      localStorage.setItem('logoUrl', url);
      setUploadingLogo(false);
      toast.success('Site logo updated! 🏷️');
    };
    reader.readAsDataURL(file);
  };

  const resetBanner = () => {
    setHeroBannerUrl('');
    localStorage.removeItem('heroBannerUrl');
    toast.info('Banner reset to default');
  };

  const resetLogo = () => {
    setLogoUrl('');
    localStorage.removeItem('logoUrl');
    toast.info('Logo reset to default');
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Admin Header */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">System Administrator</h2>
            <p className="text-xs text-slate-400 font-medium">Manage students, companies, analytics, and site settings.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
              title="Toggle dark/light mode"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
              title="Site Settings"
            >
              <FiSettings className="w-5 h-5" />
            </button>
            <span className="p-3 bg-primary/10 text-primary rounded-2xl">
              <FiActivity className="w-6 h-6 animate-pulse" />
            </span>
          </div>
        </div>

        {/* Tabs selector */}
        <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-700 text-sm font-semibold overflow-x-auto">
          {[
            { id: 'overview',     name: '📊 Overview' },
            { id: 'students',     name: `👥 Students (${students.length})` },
            { id: 'companies',    name: `🏢 Companies (${companies.length})` },
            { id: 'add-company',  name: '➕ Add Company' },
            { id: 'jobs',         name: `💼 Jobs (${jobs.length})` },
            { id: 'settings',     name: '⚙️ Site Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 relative whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-primary' : 'text-slate-450 hover:text-slate-750 dark:text-slate-400'
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ─────── Tab 1: Overview ─────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/50 text-center">
                <FiUsers className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Students</span>
                <h4 className="text-2xl font-extrabold mt-1 text-slate-850 dark:text-white font-heading">{stats.students}</h4>
              </div>
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/50 text-center">
                <FiGrid className="w-6 h-6 text-secondary mx-auto mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Companies</span>
                <h4 className="text-2xl font-extrabold mt-1 text-slate-850 dark:text-white font-heading">{stats.companies}</h4>
              </div>
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/50 text-center">
                <FiBriefcase className="w-6 h-6 text-success mx-auto mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jobs Posted</span>
                <h4 className="text-2xl font-extrabold mt-1 text-slate-850 dark:text-white font-heading">{stats.jobs}</h4>
              </div>
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/50 text-center">
                <FiFileText className="w-6 h-6 text-warning mx-auto mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applications</span>
                <h4 className="text-2xl font-extrabold mt-1 text-slate-850 dark:text-white font-heading">{stats.applications}</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/50 space-y-4">
                <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center">
                  <FiUsers className="mr-1.5" /> User Signup Growth
                </h3>
                <LineChart labels={growthData.labels} dataValues={growthData.users} labelName="New Users" color="#2563EB" />
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl smooth-shadow border border-slate-100 dark:border-slate-700/50 space-y-4">
                <h3 className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider flex items-center">
                  <FiDollarSign className="mr-1" /> Revenue (INR)
                </h3>
                <BarChart labels={growthData.labels} dataValues={growthData.revenue} labelName="Subscriptions" color="#7C3AED" />
              </div>
            </div>
          </div>
        )}

        {/* ─────── Tab 2: Students ─────── */}
        {activeTab === 'students' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b pb-3 flex items-center mb-6">
              <FiUsers className="mr-2 text-primary" /> Manage Students
            </h3>
            {students.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No students registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Skills</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} className="border-b border-slate-50 dark:border-slate-700/35 hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-white">{student.user?.name || 'N/A'}</td>
                        <td className="py-4 px-4 text-slate-550 dark:text-slate-350">{student.user?.email || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {student.skills?.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-slate-150 dark:bg-slate-700 text-[10px] font-semibold text-slate-550 dark:text-slate-300">{s}</span>
                            ))}
                            {student.skills?.length > 3 && <span className="text-[10px] text-slate-400">+{student.skills.length - 3}</span>}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <button onClick={() => handleDeleteUser(student.user?._id)} className="p-1.5 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg" title="Delete Student">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─────── Tab 3: Companies ─────── */}
        {activeTab === 'companies' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b pb-3 flex items-center mb-6">
              <FiGrid className="mr-2 text-primary" /> Verify & Moderate Companies
            </h3>
            {companies.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No companies registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Verify</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company._id} className="border-b border-slate-50 dark:border-slate-700/35 hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-white">
                          <Link to={`/companies/${company._id}`} className="hover:text-primary hover:underline">{company.companyName}</Link>
                        </td>
                        <td className="py-4 px-4 text-slate-550 dark:text-slate-350">{company.location}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${company.isVerified ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                            {company.isVerified ? 'Verified ✓' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button onClick={() => handleVerifyCompany(company._id)} className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-colors ${company.isVerified ? 'bg-warning/10 border-warning text-warning hover:bg-warning/20' : 'bg-success/10 border-success text-success hover:bg-success/20'}`}>
                            {company.isVerified ? 'Revoke' : 'Verify'}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-center space-x-2">
                          <button onClick={() => openEditCompanyModal(company)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg" title="Edit Company">
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteUser(company.user?._id)} className="p-1.5 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg" title="Delete Company">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─────── Tab 4: Jobs ─────── */}
        {activeTab === 'jobs' && (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading border-b pb-3 flex items-center mb-6">
              <FiBriefcase className="mr-2 text-primary" /> Active Job Listings
            </h3>
            {jobs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No jobs on the platform.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Job Title</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id} className="border-b border-slate-50 dark:border-slate-700/35 hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-white">
                          <Link to={`/jobs/detail/${job._id}`} className="hover:text-primary hover:underline">{job.title}</Link>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-600 dark:text-slate-350">{job.company?.companyName || 'Anonymous'}</td>
                        <td className="py-4 px-4 text-slate-450">{job.location}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${job.status === 'active' ? 'bg-success/15 text-success' : 'bg-slate-100 text-slate-400'}`}>{job.status}</span>
                        </td>
                        <td className="py-4 px-4">
                          <button onClick={() => handleDeleteJob(job._id)} className="p-1.5 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─────── Tab: Add Company ─────── */}
        {activeTab === 'add-company' && (
          <div className="space-y-6">

            {/* Header Banner */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold font-heading flex items-center gap-2">
                  <FiGrid className="w-6 h-6" /> Add New Company
                </h3>
                <p className="text-emerald-100 text-sm">
                  Fill in the company details. An account will be created and the company can immediately log in to the Recruiter Portal.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-center gap-1 bg-white/15 rounded-2xl px-5 py-3">
                <FiCheckCircle className="w-7 h-7" />
                <span className="text-xs font-bold">Auto Verified</span>
              </div>
            </div>

            <form onSubmit={handleRegisterCompany}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 md:p-8 smooth-shadow space-y-6">

              {/* ── Logo Upload ── */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-700 cursor-pointer hover:border-emerald-400 transition"
                    onClick={() => regLogoRef.current.click()}
                  >
                    {regLogoPreview
                      ? <img src={regLogoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      : <div className="text-center text-slate-400 text-xs p-2">
                          <FiImage className="w-6 h-6 mx-auto mb-1" />
                          Logo
                        </div>
                    }
                  </div>
                  <input ref={regLogoRef} type="file" accept="image/*" className="hidden" onChange={handleRegLogoChange} />
                  <button type="button" onClick={() => regLogoRef.current.click()}
                    className="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline w-full text-center">
                    {regLogoPreview ? 'Change Logo' : 'Upload Logo'}
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Company Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={regCompanyName}
                      onChange={e => setRegCompanyName(e.target.value)}
                      required
                      placeholder="e.g. Infosys Technologies Pvt. Ltd."
                      className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry / Sector</label>
                    <input
                      type="text"
                      value={regIndustry}
                      onChange={e => setRegIndustry(e.target.value)}
                      placeholder="e.g. Information Technology, Finance, Healthcare"
                      className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* ── Grid Fields ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Login Email <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      required
                      placeholder="hr@company.com"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Login Password <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      required
                      placeholder="Set a strong password"
                      className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-emerald-500">
                      {showPassword ? <FiLock className="w-4 h-4" /> : <FiKey className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Headquarters / Location
                  </label>
                  <input
                    type="text"
                    value={regLocation}
                    onChange={e => setRegLocation(e.target.value)}
                    placeholder="e.g. Bangalore, India"
                    className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Employee Count
                  </label>
                  <input
                    type="number"
                    value={regEmployeeCount}
                    onChange={e => setRegEmployeeCount(e.target.value)}
                    placeholder="e.g. 5000"
                    min="1"
                    className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={regWebsite}
                    onChange={e => setRegWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* ── Description ── */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Company Description
                </label>
                <textarea
                  value={regDesc}
                  onChange={e => setRegDesc(e.target.value)}
                  rows="5"
                  placeholder="Describe the company — what they do, their culture, mission, and what kinds of internships or jobs they offer to students..."
                  className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>

              {/* ── Submit ── */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="submit"
                  disabled={registering}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg hover:opacity-95 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <FiGrid className="w-4 h-4" />
                  {registering ? 'Creating Company Account...' : 'Register Company & Create Login'}
                </button>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                  <p className="flex items-center gap-1.5"><FiCheckCircle className="text-emerald-500 w-3.5 h-3.5" /> Company will be <strong>auto-verified</strong> immediately</p>
                  <p className="flex items-center gap-1.5"><FiCheckCircle className="text-emerald-500 w-3.5 h-3.5" /> Company can log in right away at <strong>/login</strong></p>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* ─────── Tab 5: Site Settings ─────── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">

            {/* Admin Credentials Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <FiShield className="w-6 h-6" />
                <h3 className="text-lg font-extrabold font-heading">Admin Login Credentials</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/15 rounded-2xl p-4 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Email Address</p>
                  <p className="font-mono text-sm font-bold">{ADMIN_CREDENTIALS.email}</p>
                </div>
                <div className="bg-white/15 rounded-2xl p-4 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Password</p>
                  <p className="font-mono text-sm font-bold">{ADMIN_CREDENTIALS.password}</p>
                </div>
                <div className="bg-white/15 rounded-2xl p-4 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Role</p>
                  <p className="text-sm font-bold">{ADMIN_CREDENTIALS.role}</p>
                </div>
              </div>
              <p className="text-xs text-purple-200 mt-4 flex items-center gap-1.5">
                <FiLock className="w-3.5 h-3.5" /> Keep these credentials secure. Change them in the server .env file and seeder.
              </p>
            </div>

            {/* ── Register New Company ── */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/50">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <FiGrid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Register New Company</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Create a company account. They will receive login credentials to access the Recruiter Portal.</p>
                </div>
              </div>

              <form onSubmit={handleRegisterCompany} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name *</label>
                    <input
                      type="text"
                      value={regCompanyName}
                      onChange={e => setRegCompanyName(e.target.value)}
                      required
                      placeholder="e.g. TechCorp Pvt. Ltd."
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Login Email *</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      required
                      placeholder="hr@techcorp.com"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Login Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        required
                        placeholder="Set a secure password"
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-primary text-xs"
                      >
                        {showPassword ? <FiLock className="w-4 h-4" /> : <FiKey className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                    <input
                      type="text"
                      value={regIndustry}
                      onChange={e => setRegIndustry(e.target.value)}
                      placeholder="e.g. Information Technology"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location / City</label>
                    <input
                      type="text"
                      value={regLocation}
                      onChange={e => setRegLocation(e.target.value)}
                      placeholder="e.g. Bangalore, India"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
                    <input
                      type="url"
                      value={regWebsite}
                      onChange={e => setRegWebsite(e.target.value)}
                      placeholder="https://techcorp.com"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Description</label>
                  <textarea
                    value={regDesc}
                    onChange={e => setRegDesc(e.target.value)}
                    rows="3"
                    placeholder="Brief description of what the company does, culture, and opportunities..."
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={registering}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold rounded-xl shadow hover:opacity-95 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    {registering ? 'Creating Account...' : 'Register Company'}
                  </button>
                  <p className="text-xs text-slate-400">✅ Auto-verified &amp; ready to log in immediately</p>
                </div>
              </form>
            </div>



            {/* Dark / Light Mode Toggle */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                {darkMode ? <FiMoon className="text-indigo-400" /> : <FiSun className="text-amber-500" />}
                Display Mode
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => !darkMode && toggleTheme()}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 font-semibold text-sm transition-all ${darkMode ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
                >
                  <FiMoon className="w-6 h-6" />
                  Dark Mode
                  {darkMode && <FiCheckCircle className="w-4 h-4 text-primary" />}
                </button>
                <button
                  onClick={() => darkMode && toggleTheme()}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 font-semibold text-sm transition-all ${!darkMode ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'}`}
                >
                  <FiSun className="w-6 h-6" />
                  Light Mode
                  {!darkMode && <FiCheckCircle className="w-4 h-4 text-primary" />}
                </button>
              </div>
            </div>

            {/* Color Accent Theme Picker */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                🎨 Site Color Theme
              </h3>
              <p className="text-xs text-slate-500">Changes the primary accent color across the entire site in real-time.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ACCENT_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      changeAccent(theme.id);
                      toast.success(`Theme changed to "${theme.label}" 🎨`);
                    }}
                    className={`relative p-3 rounded-2xl border-2 text-left transition-all hover:scale-105 ${accentTheme === theme.id ? 'border-slate-900 dark:border-white shadow-lg' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
                  >
                    {/* Color preview swatch */}
                    <div className="flex gap-1 mb-2">
                      <div className="w-6 h-6 rounded-lg shadow-sm" style={{ background: theme.preview[0] }} />
                      <div className="w-6 h-6 rounded-lg shadow-sm" style={{ background: theme.preview[1] }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{theme.label}</span>
                    {accentTheme === theme.id && (
                      <div className="absolute top-2 right-2">
                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Branding Settings */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                🏷️ Site Branding
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Site Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={siteTagline}
                    onChange={e => setSiteTagline(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                onClick={saveBranding}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold rounded-xl shadow hover:opacity-95 transition"
              >
                Save Branding
              </button>
            </div>

            {/* Image Uploads */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 smooth-shadow space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <FiImage /> Site Images
              </h3>

              {/* Hero Banner */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hero Banner Image</label>
                  {heroBannerUrl && (
                    <button onClick={resetBanner} className="text-xs text-danger font-semibold flex items-center gap-1 hover:underline">
                      <FiRefreshCw className="w-3 h-3" /> Reset to Default
                    </button>
                  )}
                </div>
                {heroBannerUrl ? (
                  <img src={heroBannerUrl} alt="Hero Banner" className="w-full h-40 object-cover rounded-2xl border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    No custom banner — using default gradient
                  </div>
                )}
                <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                <button
                  onClick={() => bannerInputRef.current.click()}
                  disabled={uploadingBanner}
                  className="px-5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-primary/10 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
                >
                  <FiImage className="w-4 h-4" />
                  {uploadingBanner ? 'Uploading...' : 'Upload Hero Banner'}
                </button>
              </div>

              {/* Site Logo */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Site Logo / Icon</label>
                  {logoUrl && (
                    <button onClick={resetLogo} className="text-xs text-danger font-semibold flex items-center gap-1 hover:underline">
                      <FiRefreshCw className="w-3 h-3" /> Reset to Default
                    </button>
                  )}
                </div>
                {logoUrl ? (
                  <img src={logoUrl} alt="Site Logo" className="w-24 h-24 object-contain rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-2" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-[10px] text-center p-2">
                    No logo
                  </div>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <button
                  onClick={() => logoInputRef.current.click()}
                  disabled={uploadingLogo}
                  className="px-5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-primary/10 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
                >
                  <FiImage className="w-4 h-4" />
                  {uploadingLogo ? 'Uploading...' : 'Upload Site Logo'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Company Modal ── */}
        {editingCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <FiEdit className="text-primary" /> Edit Company Profile
                </h3>
                <button onClick={() => setEditingCompany(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveCompanyEdit} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    value={editCompanyName}
                    onChange={e => setEditCompanyName(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-primary transition"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Logo</label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-700 cursor-pointer hover:border-primary transition flex-shrink-0"
                      onClick={() => editLogoRef.current.click()}
                    >
                      {editLogoPreview ? (
                        <img src={editLogoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      ) : (
                        <FiImage className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <input ref={editLogoRef} type="file" accept="image/*" className="hidden" onChange={handleEditLogoChange} />
                    <div className="text-xs text-slate-500">
                      Click the box to upload a new logo.<br /> Recommended size: 200x200px.
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setEditingCompany(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={savingCompany} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow hover:opacity-95 transition disabled:opacity-50 flex items-center gap-2">
                    {savingCompany ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
