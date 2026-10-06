const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_portal');
    console.log('Connected to MongoDB.');

    // Find student Rahul
    const studentUser = await User.findOne({ email: 'rahul@portal.com' });
    if (!studentUser) {
      console.error('Student user not found.');
      process.exit(1);
    }
    const student = await Student.findOne({ user: studentUser._id });
    if (!student) {
      console.error('Student profile not found.');
      process.exit(1);
    }

    // Set dummy resume for student
    student.resume = 'rahul_sharma_resume.pdf';
    await student.save();
    console.log('Updated student resume field.');

    // Find job "Full Stack Developer Intern"
    const job = await Job.findOne({ title: 'Full Stack Developer Intern' });
    if (!job) {
      console.error('Job posting not found.');
      process.exit(1);
    }

    // Delete any existing applications for this student and job
    await Application.deleteMany({ job: job._id, student: student._id });

    // Create a new application
    const application = await Application.create({
      job: job._id,
      student: student._id,
      resume: student.resume,
      coverLetter: 'I am highly motivated to join TechCorp as a Full Stack Intern. I have strong skills in React, Node.js, and MongoDB.',
      status: 'Pending'
    });

    console.log('Created test application successfully:', application);
    process.exit(0);
  } catch (error) {
    console.error('Error creating application:', error);
    process.exit(1);
  }
};

run();
