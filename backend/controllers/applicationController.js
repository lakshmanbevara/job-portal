const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student)
exports.applyJob = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Verify student has uploaded a resume
    if (!student.resume || !student.resume.url) {
      return res.status(400).json({ success: false, message: 'Please upload your resume before applying' });
    }

    const job = await Job.findById(req.params.jobId).populate({
      path: 'company',
      populate: { path: 'user' }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This job posting has been closed' });
    }

    const { coverLetter } = req.body;

    // Explicitly check for duplicate applications to prevent multiple entries
    const existingApplication = await Application.findOne({ job: job._id, student: student._id });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job opportunity' });
    }

    // Create the job application
    const application = await Application.create({
      job: job._id,
      student: student._id,
      resume: {
        url: student.resume.url,
        filename: student.resume.filename
      },
      coverLetter
    });

    // Create notifications for the company user
    await Notification.create({
      recipient: job.company.user._id,
      sender: req.user.id,
      title: 'New Job Application',
      message: `${student.user.name} applied for your opening: "${job.title}"`,
      type: 'info'
    });

    // Send email to the company user
    const companyEmailMessage = `Hello ${job.company.companyName},\n\nYou have received a new application from ${student.user.name} for the position: "${job.title}".\n\nPlease log in to your dashboard to review their resume and status.`;
    await sendEmail({
      email: job.company.user.email,
      subject: `New Application: ${job.title}`,
      message: companyEmailMessage
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job opportunity' });
    }
    next(error);
  }
};

// @desc    Get all applications received by the logged-in company
// @route   GET /api/applications/company
// @access  Private (Company)
exports.getCompanyApplications = async (req, res, next) => {
  try {
    if (!req.company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    // Find jobs posted by company
    const jobs = await Job.find({ company: req.company._id });
    const jobIds = jobs.map(j => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job')
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Accept, Reject, Review, Schedule Interview)
// @route   PUT /api/applications/:id/status
// @access  Private (Company)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, interviewDate, interviewDetails } = req.body;

    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        populate: { path: 'company' }
      })
      .populate({
        path: 'student',
        populate: { path: 'user' }
      });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify company authorization
    if (application.job.company._id.toString() !== req.company._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this application' });
    }

    application.status = status;
    if (status === 'Interview Scheduled') {
      application.interviewDate = interviewDate;
      application.interviewDetails = interviewDetails;
    }

    await application.save();

    // Create notifications for the student user
    let notificationTitle = 'Application Update';
    let notificationMsg = `Your application status for "${application.job.title}" at "${application.job.company.companyName}" has been updated to "${status}".`;
    let notifType = 'info';

    if (status === 'Accepted') {
      notifType = 'success';
      notificationTitle = 'Application Accepted! 🎉';
    } else if (status === 'Rejected') {
      notifType = 'danger';
    } else if (status === 'Interview Scheduled') {
      notifType = 'warning';
      notificationTitle = 'Interview Scheduled! 📅';
      notificationMsg += ` Interview scheduled for: ${new Date(interviewDate).toLocaleString()}. Details: ${interviewDetails || 'N/A'}`;
    }

    await Notification.create({
      recipient: application.student.user._id,
      sender: req.user.id,
      title: notificationTitle,
      message: notificationMsg,
      type: notifType
    });

    // Send email notification to student
    const emailSubject = `Application Update: ${application.job.title} at ${application.job.company.companyName}`;
    const emailMessage = `Hello ${application.student.user.name},\n\nWe wanted to let you know that your job application status for "${application.job.title}" at "${application.job.company.companyName}" has been updated to: "${status}".\n\n${
      status === 'Interview Scheduled' 
        ? `Interview details:\nDate: ${new Date(interviewDate).toLocaleString()}\nDetails: ${interviewDetails || 'N/A'}`
        : ''
    }\n\nLog in to StudentJobPortal to view the dashboard.`;

    await sendEmail({
      email: application.student.user.email,
      subject: emailSubject,
      message: emailMessage
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
