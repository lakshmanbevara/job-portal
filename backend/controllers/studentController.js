const Student = require('../models/Student');
const User = require('../models/User');
const Application = require('../models/Application');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get current student profile
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile details
// @route   PUT /api/students/profile
// @access  Private (Student)
exports.updateStudentProfile = async (req, res, next) => {
  try {
    const { skills, portfolio, linkedIn, gitHub, languages, achievements } = req.body;

    const fieldsToUpdate = {};
    if (skills) fieldsToUpdate.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (portfolio !== undefined) fieldsToUpdate.portfolio = portfolio;
    if (linkedIn !== undefined) fieldsToUpdate.linkedIn = linkedIn;
    if (gitHub !== undefined) fieldsToUpdate.gitHub = gitHub;
    if (languages) fieldsToUpdate.languages = Array.isArray(languages) ? languages : languages.split(',').map(l => l.trim());
    if (achievements) fieldsToUpdate.achievements = Array.isArray(achievements) ? achievements : achievements.split(',').map(a => a.trim());

    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile photo
// @route   POST /api/students/photo
// @access  Private (Student)
exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const uploadResult = await uploadToCloudinary(req.file.path, 'studentjobportal/photos');

    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      { $set: { profilePhoto: uploadResult.url } },
      { new: true }
    );

    res.status(200).json({ success: true, profilePhoto: student.profilePhoto });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload Resume (PDF)
// @route   POST /api/students/resume
// @access  Private (Student)
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const uploadResult = await uploadToCloudinary(req.file.path, 'studentjobportal/resumes');

    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          resume: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            filename: req.file.originalname
          }
        }
      },
      { new: true }
    );

    res.status(200).json({ success: true, resume: student.resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Add education entry
// @route   POST /api/students/education
// @access  Private (Student)
exports.addEducation = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.education.push(req.body);
    await student.save();
    res.status(200).json({ success: true, data: student.education });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete education entry
// @route   DELETE /api/students/education/:eduId
// @access  Private (Student)
exports.deleteEducation = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.education = student.education.filter(edu => edu._id.toString() !== req.params.eduId);
    await student.save();
    res.status(200).json({ success: true, data: student.education });
  } catch (error) {
    next(error);
  }
};

// @desc    Add experience entry
// @route   POST /api/students/experience
// @access  Private (Student)
exports.addExperience = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.experience.push(req.body);
    await student.save();
    res.status(200).json({ success: true, data: student.experience });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete experience entry
// @route   DELETE /api/students/experience/:expId
// @access  Private (Student)
exports.deleteExperience = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.experience = student.experience.filter(exp => exp._id.toString() !== req.params.expId);
    await student.save();
    res.status(200).json({ success: true, data: student.experience });
  } catch (error) {
    next(error);
  }
};

// @desc    Add project entry
// @route   POST /api/students/projects
// @access  Private (Student)
exports.addProject = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.projects.push(req.body);
    await student.save();
    res.status(200).json({ success: true, data: student.projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project entry
// @route   DELETE /api/students/projects/:projId
// @access  Private (Student)
exports.deleteProject = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.projects = student.projects.filter(proj => proj._id.toString() !== req.params.projId);
    await student.save();
    res.status(200).json({ success: true, data: student.projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Add certification entry
// @route   POST /api/students/certifications
// @access  Private (Student)
exports.addCertification = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.certifications.push(req.body);
    await student.save();
    res.status(200).json({ success: true, data: student.certifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certification entry
// @route   DELETE /api/students/certifications/:certId
// @access  Private (Student)
exports.deleteCertification = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.certifications = student.certifications.filter(cert => cert._id.toString() !== req.params.certId);
    await student.save();
    res.status(200).json({ success: true, data: student.certifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applied jobs list
// @route   GET /api/students/applications
// @access  Private (Student)
exports.getAppliedJobs = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'job',
        populate: { path: 'company' }
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};
