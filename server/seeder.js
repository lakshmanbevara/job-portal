const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Category = require('./models/Category');
const Application = require('./models/Application');
const Admin = require('./models/Admin');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentjobportal';
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional, but good for fresh seed)
    await User.deleteMany();
    await Student.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Category.deleteMany();
    await Application.deleteMany();
    await Admin.deleteMany();

    // 1. Create Categories
    const categories = await Category.insertMany([
      { name: 'Software Development', description: 'Programming and Software Engineering' },
      { name: 'Data Science', description: 'Data Analysis and Machine Learning' },
      { name: 'Marketing', description: 'Digital Marketing and SEO' }
    ]);

    // 2. Create Admin
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@admin.com',
      password: 'admin#18',
      role: 'admin',
      isVerified: true
    });
    await Admin.create({ user: adminUser._id, permissions: ['all'] });

    // 3. Create Companies (Colleges/Companies)
    const companiesList = [];
    for (let i = 1; i <= 10; i++) {
      const companyUser = await User.create({
        name: `Company ${i}`,
        email: `hr${i}@company.com`,
        password: 'password123',
        role: 'company',
        isVerified: true
      });
      const company = await Company.create({
        user: companyUser._id,
        companyName: `Company ${i}`,
        website: `https://company${i}.com`,
        description: `This is company ${i}.`,
        location: 'Remote',
        industry: i % 2 === 0 ? 'IT' : 'Education'
      });
      companiesList.push(company);
    }
    const company1 = companiesList[0];
    const company2 = companiesList[1];

    // 4. Create Students
    const studentsList = [];
    for (let i = 1; i <= 10; i++) {
      const studentUser = await User.create({
        name: `Student ${i}`,
        email: `student${i}@student.com`,
        password: 'password123',
        role: 'student',
        isVerified: true
      });
      const student = await Student.create({
        user: studentUser._id,
        skills: ['JavaScript', 'React', 'Node.js'],
        education: [],
        experience: [],
        projects: [],
        certifications: []
      });
      studentsList.push(student);
    }
    const student1 = studentsList[0];
    const student2 = studentsList[1];

    // 5. Create Jobs (Internships / Full Time)
    const job1 = await Job.create({
      title: 'Frontend Developer Internship',
      company: company1._id,
      location: 'Remote',
      salary: { min: 10000, max: 20000, currency: 'INR' },
      experienceRequired: '0-1 Years',
      skillsRequired: ['React', 'CSS'],
      category: categories[0]._id,
      jobType: 'Internship',
      workMode: 'Remote',
      description: 'Looking for a passionate frontend intern.',
      requirements: ['Basic knowledge of React'],
      benefits: ['Flexible hours'],
      isFeatured: true
    });

    const job2 = await Job.create({
      title: 'Data Analyst Full Time',
      company: company2._id,
      location: 'Hyderabad, India',
      salary: { min: 50000, max: 80000, currency: 'INR' },
      experienceRequired: '1-3 Years',
      skillsRequired: ['Python', 'SQL'],
      category: categories[1]._id,
      jobType: 'Full Time',
      workMode: 'On-site',
      description: 'Data analyst for our university research.',
      requirements: ['Strong SQL skills'],
      benefits: ['Health Insurance'],
      isFeatured: false
    });

    // 6. Create Applications
    await Application.create({
      job: job1._id,
      student: student1._id,
      resume: { url: 'https://example.com/resume1.pdf', filename: 'resume1.pdf' },
      status: 'Applied'
    });

    await Application.create({
      job: job2._id,
      student: student2._id,
      resume: { url: 'https://example.com/resume2.pdf', filename: 'resume2.pdf' },
      status: 'Reviewing'
    });

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
