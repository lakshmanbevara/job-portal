const Company = require('../models/Company');
const Job = require('../models/Job');
const Review = require('../models/Review');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get current company profile
// @route   GET /api/companies/profile
// @access  Private (Company)
exports.getCompanyProfile = async (req, res, next) => {
  try {
    const company = await Company.findOne({ user: req.user.id }).populate('user');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/profile
// @access  Private (Company)
exports.updateCompanyProfile = async (req, res, next) => {
  try {
    const { companyName, website, description, location, industry, employeeCount } = req.body;

    const fieldsToUpdate = {};
    if (companyName) fieldsToUpdate.companyName = companyName;
    if (website !== undefined) fieldsToUpdate.website = website;
    if (description !== undefined) fieldsToUpdate.description = description;
    if (location !== undefined) fieldsToUpdate.location = location;
    if (industry !== undefined) fieldsToUpdate.industry = industry;
    if (employeeCount !== undefined) fieldsToUpdate.employeeCount = employeeCount;

    const company = await Company.findOneAndUpdate(
      { user: req.user.id },
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload company logo
// @route   POST /api/companies/logo
// @access  Private (Company)
exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a logo image file' });
    }

    const uploadResult = await uploadToCloudinary(req.file.path, 'studentjobportal/logos');

    const company = await Company.findOneAndUpdate(
      { user: req.user.id },
      { $set: { logo: uploadResult.url } },
      { new: true }
    );

    res.status(200).json({ success: true, logo: company.logo });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies (with search & filters)
// @route   GET /api/companies
// @access  Public
exports.getAllCompanies = async (req, res, next) => {
  try {
    const { search, industry, location } = req.query;

    const query = {};
    if (search) {
      query.companyName = { $regex: search, $options: 'i' };
    }
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const companies = await Company.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company details by ID
// @route   GET /api/companies/:id
// @access  Public
exports.getCompanyDetails = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('user');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Get open jobs
    const jobs = await Job.find({ company: company._id, status: 'active' }).populate('category');

    // Get company reviews
    const reviews = await Review.find({ company: company._id }).populate({
      path: 'reviewer',
      populate: { path: 'user', select: 'name' }
    });

    res.status(200).json({
      success: true,
      data: {
        company,
        jobs,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};
