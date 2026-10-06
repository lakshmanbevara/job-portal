const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Admin = require('../models/Admin');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_portal');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await Admin.deleteMany();
    console.log('Cleared existing database records.');

    // 1. Create Admins
    const adminUser = await User.create({
      email: 'admin@portal.com',
      password: 'adminpassword', // Will be hashed via pre-save hook
      role: 'admin'
    });
    await Admin.create({
      user: adminUser._id,
      name: 'System Admin',
      phone: '9876543210'
    });
    console.log('Created Admin account.');

    // 2. Create Companies
    const company1User = await User.create({
      email: 'techcorp@portal.com',
      password: 'companypassword',
      role: 'company'
    });
    const company1 = await Company.create({
      user: company1User._id,
      name: 'TechCorp Solutions',
      description: 'A global leader in next-generation digital services and consulting.',
      website: 'https://techcorp.example.com',
      location: 'Bangalore, India',
      industry: 'Information Technology',
      contactEmail: 'hr@techcorp.example.com',
      contactPhone: '080-1234567'
    });

    const company2User = await User.create({
      email: 'innovatelabs@portal.com',
      password: 'companypassword',
      role: 'company'
    });
    const company2 = await Company.create({
      user: company2User._id,
      name: 'Innovate Labs',
      description: 'Developing cutting-edge healthcare tech systems and AI diagnostic suites.',
      website: 'https://innovate.example.com',
      location: 'Pune, India',
      industry: 'Biotech & HealthTech',
      contactEmail: 'careers@innovate.example.com',
      contactPhone: '020-7654321'
    });
    console.log('Created Company accounts & profiles.');

    // 3. Create Students
    const student1User = await User.create({
      email: 'rahul@portal.com',
      password: 'studentpassword',
      role: 'student',
      rollNumber: 'CS2301'
    });
    await Student.create({
      user: student1User._id,
      name: 'Rahul Sharma',
      rollNumber: 'CS2301',
      phone: '9812345678',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Python'],
      education: [
        {
          school: 'IIT Bangalore',
          degree: 'B.Tech',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: '2023',
          endYear: '2027',
          gpa: '8.9/10'
        }
      ],
      experience: [
        {
          company: 'Coding Ninjas',
          role: 'Web Development Intern',
          duration: '3 Months',
          description: 'Assisted in building UI mockups using React and writing unit tests for backend APIs.'
        }
      ],
      contactDetails: {
        address: 'Electronic City, Bangalore',
        linkedin: 'https://linkedin.com/in/rahulsharma',
        github: 'https://github.com/rahulsharma',
        portfolio: 'https://rahulsharma.example.com'
      },
      resume: '' // Starts with empty resume
    });

    const student2User = await User.create({
      email: 'priya@portal.com',
      password: 'studentpassword',
      role: 'student',
      rollNumber: 'IT2302'
    });
    await Student.create({
      user: student2User._id,
      name: 'Priya Patel',
      rollNumber: 'IT2302',
      phone: '9712345678',
      skills: ['Java', 'Spring Boot', 'SQL', 'C++', 'Data Structures', 'Git'],
      education: [
        {
          school: 'COEP Pune',
          degree: 'B.E.',
          fieldOfStudy: 'Information Technology',
          startYear: '2023',
          endYear: '2027',
          gpa: '9.2/10'
        }
      ],
      experience: [],
      contactDetails: {
        address: 'Shivajinagar, Pune',
        linkedin: 'https://linkedin.com/in/priyapatel',
        github: 'https://github.com/priyapatel',
        portfolio: ''
      },
      resume: ''
    });
    console.log('Created Student accounts & profiles.');

    // 4. Create Jobs (Approved)
    const job1 = await Job.create({
      company: company1._id,
      title: 'Full Stack Developer Intern',
      description: 'We are looking for a motivated Full Stack Developer Intern to work with our core React-Node product engineering team. You will be responsible for building UI features and setting up REST endpoints.',
      skillsRequired: ['React', 'Node.js', 'Express', 'MongoDB'],
      salaryOrStipend: '₹25,000 / month',
      location: 'Bangalore / Remote',
      jobType: 'Internship',
      eligibility: 'B.Tech/B.E./MCA, 3rd or 4th year students',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isApproved: true
    });

    const job2 = await Job.create({
      company: company1._id,
      title: 'Associate Software Engineer',
      description: 'Full time role for graduating students. You will participate in development, testing, and deployment of cloud-based microservices using Node.js and AWS.',
      skillsRequired: ['Node.js', 'REST APIs', 'SQL', 'Docker'],
      salaryOrStipend: '₹8,00,000 / annum',
      location: 'Bangalore, India',
      jobType: 'Full-time',
      eligibility: '2026/2027 graduating batch (CS/IT/ECE)',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      isApproved: true
    });

    const job3 = await Job.create({
      company: company2._id,
      title: 'Backend Engineering Intern (Java)',
      description: 'Looking for a Java backend developer who is passionate about building scalable microservices. You will work on database integrations and optimization of service endpoints.',
      skillsRequired: ['Java', 'Spring Boot', 'MySQL'],
      salaryOrStipend: '₹20,000 / month',
      location: 'Pune (In-office)',
      jobType: 'Internship',
      eligibility: 'Candidates with strong concepts of OOPs and DBMS',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      isApproved: true
    });

    // 5. Create Jobs (Pending Approval for Admin dashboard testing)
    await Job.create({
      company: company2._id,
      title: 'UI/UX Design Intern',
      description: 'Create user journeys, wireframes, high fidelity prototypes and sleek designs for our upcoming mobile and web app versions.',
      skillsRequired: ['Figma', 'Adobe XD', 'Prototyping'],
      salaryOrStipend: '₹15,000 / month',
      location: 'Remote',
      jobType: 'Internship',
      eligibility: 'Open to all design enthusiasts with a solid portfolio',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      isApproved: false // Needs admin approval!
    });

    console.log('Created Job postings (Approved and Pending).');
    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
