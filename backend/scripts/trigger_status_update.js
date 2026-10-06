const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_portal');
    console.log('Connected to MongoDB.');

    // Find the application
    const application = await Application.findOne().populate({
      path: 'student',
      populate: { path: 'user', select: 'email' }
    });

    if (!application) {
      console.error('No application found to update.');
      process.exit(1);
    }

    console.log(`Found application ID: ${application._id} for Student: ${application.student.name}`);

    // Since we want to trigger the HTTP route to fully test the API, let's use fetch.
    // We'll first login to get the JWT token.
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'techcorp@portal.com',
        password: 'companypassword'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.error('Login failed:', loginData);
      process.exit(1);
    }

    const token = loginData.token;
    console.log('Login successful, received JWT token.');

    // Trigger status update to 'Shortlisted'
    console.log("Sending PATCH request to update status to 'Shortlisted'...");
    const updateResponse = await fetch(`http://localhost:5000/api/applications/${application._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'Shortlisted'
      })
    });

    const updateData = await updateResponse.json();
    console.log('Update response data:', updateData);

    if (updateData.success) {
      console.log('Successfully updated status to Shortlisted.');
    } else {
      console.error('Failed to update status:', updateData);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error triggering status update:', error);
    process.exit(1);
  }
};

run();
