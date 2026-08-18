const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get admin statistics and analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const studentsCount = await Student.countDocuments();
    const companiesCount = await Company.countDocuments();
    const jobsCount = await Job.countDocuments();
    const applicationsCount = await Application.countDocuments();

    // Group users by month registered for growth chart data
    const registrationStats = await User.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format stats for Chart.js
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growthChartData = Array(12).fill(0);
    registrationStats.forEach(stat => {
      if (stat._id >= 1 && stat._id <= 12) {
        growthChartData[stat._id - 1] = stat.count;
      }
    });

    // Mock revenue growth chart data for a premium dashboard look
    const mockRevenue = [12000, 19000, 32000, 50000, 48000, 65000, 80000, 95000, 110000, 130000, 150000, 185000];

    res.status(200).json({
      success: true,
      stats: {
        students: studentsCount,
        companies: companiesCount,
        jobs: jobsCount,
        applications: applicationsCount
      },
      growth: {
        labels: months,
        users: growthChartData,
        revenue: mockRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().populate('user');
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private (Admin)
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('user');
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate('company').populate('category');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle company verification status
// @route   PUT /api/admin/companies/:id/verify
// @access  Private (Admin)
exports.verifyCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    company.isVerified = !company.isVerified;
    await company.save();

    res.status(200).json({ success: true, verified: company.isVerified, data: company });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user and all related profiles
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete role-specific data
    if (user.role === 'student') {
      const student = await Student.findOne({ user: user._id });
      if (student) {
        // Delete student's applications
        await Application.deleteMany({ student: student._id });
        await student.deleteOne();
      }
    } else if (user.role === 'company') {
      const company = await Company.findOne({ user: user._id });
      if (company) {
        // Delete all jobs posted by the company
        const jobs = await Job.find({ company: company._id });
        const jobIds = jobs.map(j => j._id);
        await Application.deleteMany({ job: { $in: jobIds } });
        await Job.deleteMany({ company: company._id });
        await company.deleteOne();
      }
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User and all related records deleted' });
  } catch (error) {
    next(error);
  }
};
// @desc    Admin registers a new company account
// @route   POST /api/admin/companies/register
// @access  Private (Admin)
exports.registerCompanyByAdmin = async (req, res, next) => {
  try {
    const { 
      companyName, email, password, 
      location, website, industry, description,
      employeeCount, logoUrl
    } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Company name, email and password are required' });
    }

    // Check if email already taken
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Create the user account
    const user = await User.create({
      name: companyName,
      email: email.toLowerCase(),
      password,
      role: 'company',
      isVerified: true
    });

    // Create the company profile with all fields
    const company = await Company.create({
      user: user._id,
      companyName,
      location: location || 'Not specified',
      website: website || '',
      industry: industry || 'General',
      description: description || `${companyName} is a registered company on the platform.`,
      employeeCount: employeeCount ? Number(employeeCount) : 1,
      logo: logoUrl || '',
      isVerified: true   // admin-created companies are auto-verified
    });

    res.status(201).json({
      success: true,
      message: `Company "${companyName}" registered successfully`,
      data: { user: { id: user._id, email: user.email }, company }
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Admin updates a company profile (name, logo, etc.)
// @route   PUT /api/admin/companies/:id
// @access  Private (Admin)
exports.updateCompanyByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyName, logoUrl, location, website, industry, description, employeeCount } = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (companyName) {
      company.companyName = companyName;
      // Optionally update the associated User record name as well
      await User.findByIdAndUpdate(company.user, { name: companyName });
    }
    
    if (logoUrl !== undefined) {
      company.logo = logoUrl;
    }
    if (location !== undefined) company.location = location;
    if (website !== undefined) company.website = website;
    if (industry !== undefined) company.industry = industry;
    if (description !== undefined) company.description = description;
    if (employeeCount !== undefined) company.employeeCount = Number(employeeCount);

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};
