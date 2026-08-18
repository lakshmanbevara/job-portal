const Job = require('../models/Job');
const Company = require('../models/Company');
const Student = require('../models/Student');
const Category = require('../models/Category');

// @desc    Post a new job opening
// @route   POST /api/jobs
// @access  Private (Company)
exports.createJob = async (req, res, next) => {
  try {
    const { title, location, minSalary, maxSalary, currency, experienceRequired, skillsRequired, category, jobType, workMode, description, requirements, benefits, companyId } = req.body;

    let targetCompany = null;

    if (req.user && req.user.role === 'admin') {
      // Admin can post for a specific company or as the platform
      if (companyId) {
        targetCompany = companyId;
      }
    } else if (req.company) {
      targetCompany = req.company._id;
    } else {
      return res.status(400).json({ success: false, message: 'Only registered companies can post jobs. Please complete your company profile.' });
    }

    const jobData = {
      title,
      location,
      salary: { min: minSalary, max: maxSalary, currency },
      experienceRequired,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim()),
      category,
      jobType,
      workMode,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split('\n').filter(r => r.trim() !== ''),
      benefits: Array.isArray(benefits) ? benefits : benefits.split('\n').filter(b => b.trim() !== '')
    };

    if (targetCompany) {
      jobData.company = targetCompany;
    }

    const job = await Job.create(jobData);

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing job opening
// @route   PUT /api/jobs/:id
// @access  Private (Company)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Verify ownership
    if (job.company.toString() !== req.company._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job post' });
    }

    const { title, location, minSalary, maxSalary, currency, experienceRequired, skillsRequired, category, jobType, workMode, description, requirements, benefits, status } = req.body;

    const fieldsToUpdate = {
      title,
      location,
      experienceRequired,
      category,
      jobType,
      workMode,
      description,
      status
    };

    if (minSalary !== undefined || maxSalary !== undefined) {
      fieldsToUpdate.salary = {
        min: minSalary !== undefined ? minSalary : job.salary.min,
        max: maxSalary !== undefined ? maxSalary : job.salary.max,
        currency: currency || job.salary.currency
      };
    }

    if (skillsRequired) {
      fieldsToUpdate.skillsRequired = Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim());
    }

    if (requirements) {
      fieldsToUpdate.requirements = Array.isArray(requirements) ? requirements : requirements.split('\n').filter(r => r.trim() !== '');
    }

    if (benefits) {
      fieldsToUpdate.benefits = Array.isArray(benefits) ? benefits : benefits.split('\n').filter(b => b.trim() !== '');
    }

    job = await Job.findByIdAndUpdate(req.params.id, { $set: fieldsToUpdate }, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job opening
// @route   DELETE /api/jobs/:id
// @access  Private (Company / Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Authorize deletion: Admin or the posting Company
    const isCompanyOwner = req.company && job.company.toString() === req.company._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCompanyOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get / search all active jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { search, category, jobType, workMode, experienceRequired, location, minSalary, sort, page = 1, limit = 10 } = req.query;

    const query = { status: 'active' };

    // Search query matches title, description, or skills
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skillsRequired: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    if (workMode) query.workMode = workMode;
    if (experienceRequired) query.experienceRequired = experienceRequired;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minSalary) query['salary.max'] = { $gte: Number(minSalary) };

    // Set sorting options
    let sortBy = '-createdAt';
    if (sort === 'salary_desc') sortBy = '-salary.max';
    if (sort === 'salary_asc') sortBy = 'salary.min';
    if (sort === 'oldest') sortBy = 'createdAt';

    // Pagination values
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .populate('company')
      .populate('category')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      },
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job details by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobDetails = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('category');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark/Save a job
// @route   POST /api/jobs/:id/save
// @access  Private (Student)
exports.saveJob = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (student.savedJobs.includes(job._id)) {
      return res.status(400).json({ success: false, message: 'Job is already saved' });
    }

    student.savedJobs.push(job._id);
    await student.save();

    res.status(200).json({ success: true, message: 'Job bookmarked successfully', savedJobs: student.savedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave/Remove bookmarked job
// @route   POST /api/jobs/:id/unsave
// @access  Private (Student)
exports.unsaveJob = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    student.savedJobs = student.savedJobs.filter(id => id.toString() !== req.params.id);
    await student.save();

    res.status(200).json({ success: true, message: 'Job removed from bookmarks', savedJobs: student.savedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by the logged-in company
// @route   GET /api/jobs/company/posted
// @access  Private (Company)
exports.getCompanyJobs = async (req, res, next) => {
  try {
    if (!req.company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    const jobs = await Job.find({ company: req.company._id }).populate('category').sort('-createdAt');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};
