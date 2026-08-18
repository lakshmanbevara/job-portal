const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Category = require('./models/Category');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const dns = require('dns');

const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8","1.1.1.1"]);
    const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentjobportal';
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const addDefaultJobs = async () => {
  try {
    await connectDB();

    // 1. Get or create a default category
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({ name: 'Software Development', description: 'Tech jobs' });
      await Category.create({ name: 'Marketing', description: 'Marketing jobs' });
      await Category.create({ name: 'Design', description: 'Design jobs' });
    }

    const categories = await Category.find();

    // 2. Get all existing companies
    const companies = await Company.find();
    console.log(`Found ${companies.length} existing companies.`);

    const jobTitles = ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Product Manager', 'Data Analyst', 'Marketing Specialist', 'DevOps Engineer', 'QA Tester'];
    
    let jobsAdded = 0;

    // 3. Add jobs for each existing company
    for (const company of companies) {
      // Check if company already has jobs
      const existingJobsCount = await Job.countDocuments({ company: company._id });
      if (existingJobsCount < 2) {
        // Add 2 random jobs
        for (let i = 0; i < 2; i++) {
          const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
          const randomCategory = categories[Math.floor(Math.random() * categories.length)];
          
          await Job.create({
            title: `${randomTitle}`,
            company: company._id,
            location: company.location || 'Remote',
            salary: { min: 40000, max: 80000, currency: 'INR' },
            experienceRequired: '1-3 Years',
            skillsRequired: ['JavaScript', 'React', 'Node.js', 'Problem Solving'],
            category: randomCategory._id,
            jobType: 'Full Time',
            workMode: 'Hybrid',
            description: `We are looking for a talented ${randomTitle} to join our team at ${company.companyName}. You will be responsible for building highly scalable software solutions and working with cross-functional teams.`,
            requirements: ["Bachelor's degree in Computer Science or related field", 'Experience with modern frameworks', 'Strong analytical skills'],
            benefits: ['Health Insurance', 'Flexible working hours', 'Performance Bonus'],
            status: 'active'
          });
          jobsAdded++;
        }
      }
    }

    // 4. Add some platform-wide "default jobs" (without a company)
    const platformJobsCount = await Job.countDocuments({ company: { $exists: false } });
    if (platformJobsCount < 3) {
      for (let i = 0; i < 3; i++) {
        const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        await Job.create({
          title: `[Platform] ${randomTitle} Opportunity`,
          location: 'Global / Remote',
          salary: { min: 30000, max: 90000, currency: 'INR' },
          experienceRequired: '0-1 Years',
          skillsRequired: ['Communication', 'Teamwork', 'Agile', 'Eagerness to learn'],
          category: randomCategory._id,
          jobType: 'Internship',
          workMode: 'Remote',
          description: `This is a platform-wide opportunity for a ${randomTitle}. Join a fast-growing environment and learn from the best in the industry.`,
          requirements: ['Eagerness to learn', 'Good communication skills', 'Basic understanding of the role'],
          benefits: ['Mentorship programs', 'Remote work', 'Certificate of Completion'],
          status: 'active'
        });
        jobsAdded++;
      }
    }

    console.log(`Successfully added ${jobsAdded} new jobs!`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

addDefaultJobs();
