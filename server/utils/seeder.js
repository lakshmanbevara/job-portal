const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load models
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Message = require('../models/Message');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentjobportal';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB for seeding...');

    // Clear all existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    await Application.deleteMany();
    await Notification.deleteMany();
    await Message.deleteMany();
    console.log('Cleared existing data.');

    // 1. Create Categories
    const categories = await Category.insertMany([
      { name: 'Software Development', description: 'Web, mobile, and system programming internships', icon: 'Code' },
      { name: 'UI/UX Design', description: 'User interface and product design listings', icon: 'Brush' },
      { name: 'Digital Marketing', description: 'SEO, SEM, social media, and product marketing', icon: 'TrendingUp' },
      { name: 'Data Science & AI', description: 'Machine learning, analytics, and business intelligence', icon: 'BarChart' },
      { name: 'Finance & Accounts', description: 'Investment banking, auditing, and corporate finance', icon: 'AttachMoney' }
    ]);
    console.log('Seeded Categories.');

    // 2. Create Admin User
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@adminpanel.com',
      password: 'admin#18',
      role: 'admin',
      isVerified: true
    });
    console.log('Seeded Admin User.');

    // 3. Create Companies
    const companyData = [
      {
        user: { name: 'Google Talent team', email: 'google@company.com', password: 'password123', role: 'company', isVerified: true },
        profile: { companyName: 'Google', website: 'https://careers.google.com', description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful.', location: 'Bangalore, India', industry: 'Technology', employeeCount: 150000, isVerified: true, rating: 4.8, reviewsCount: 1, logo: 'https://logo.clearbit.com/google.com' }
      },
      {
        user: { name: 'Netflix Careers', email: 'netflix@company.com', password: 'password123', role: 'company', isVerified: true },
        profile: { companyName: 'Netflix', website: 'https://jobs.netflix.com', description: 'Netflix is the world\'s leading streaming entertainment service with over 200 million paid memberships.', location: 'Mumbai, India', industry: 'Entertainment & Tech', employeeCount: 12000, isVerified: true, rating: 4.5, reviewsCount: 0, logo: 'https://logo.clearbit.com/netflix.com' }
      },
      {
        user: { name: 'Microsoft Recruiting', email: 'microsoft@company.com', password: 'password123', role: 'company', isVerified: true },
        profile: { companyName: 'Microsoft', website: 'https://careers.microsoft.com', description: 'Our mission is to empower every person and every organization on the planet to achieve more.', location: 'Hyderabad, India', industry: 'Technology', employeeCount: 220000, isVerified: true, rating: 4.7, reviewsCount: 5, logo: 'https://logo.clearbit.com/microsoft.com' }
      },
      {
        user: { name: 'Amazon Jobs', email: 'amazon@company.com', password: 'password123', role: 'company', isVerified: true },
        profile: { companyName: 'Amazon', website: 'https://amazon.jobs', description: 'Earth\'s most customer-centric company, where customers can find and discover anything they might want to buy online.', location: 'Bangalore, India', industry: 'E-Commerce', employeeCount: 1500000, isVerified: true, rating: 4.3, reviewsCount: 12, logo: 'https://logo.clearbit.com/amazon.com' }
      },
      {
        user: { name: 'Meta Careers', email: 'meta@company.com', password: 'password123', role: 'company', isVerified: true },
        profile: { companyName: 'Meta', website: 'https://metacareers.com', description: 'Giving people the power to build community and bring the world closer together.', location: 'Gurugram, India', industry: 'Social Media', employeeCount: 86000, isVerified: true, rating: 4.4, reviewsCount: 8, logo: 'https://logo.clearbit.com/meta.com' }
      },
      {
        user: { name: 'Spotify HR', email: 'spotify@company.com', password: 'password123', role: 'company', isVerified: true },
        profile: { companyName: 'Spotify', website: 'https://lifeatspotify.com', description: 'Unlocking the potential of human creativity—by giving a million creative artists the opportunity to live off their art.', location: 'Mumbai, India', industry: 'Audio Streaming', employeeCount: 9000, isVerified: true, rating: 4.6, reviewsCount: 3, logo: 'https://logo.clearbit.com/spotify.com' }
      }
    ];

    const companyDocs = [];
    for (const c of companyData) {
      const u = await User.create(c.user);
      const profileData = { ...c.profile, user: u._id };
      const comp = await Company.create(profileData);
      companyDocs.push(comp);
    }
    
    // For ease of use in job creation
    const company1 = companyDocs[0];
    const company2 = companyDocs[1];
    const company3 = companyDocs[2];
    const company4 = companyDocs[3];
    const company5 = companyDocs[4];
    const company6 = companyDocs[5];

    console.log('Seeded Companies.');

    // 4. Create Students
    const student1User = await User.create({
      name: 'Alex Johnson',
      email: 'student@gmail.com',
      password: 'student#',
      role: 'student',
      isVerified: true
    });
    const student1 = await Student.create({
      user: student1User._id,
      profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      resume: {
        url: '/uploads/sample-resume.pdf',
        filename: 'Alex_Johnson_CV.pdf'
      },
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML5', 'CSS3'],
      portfolio: 'https://alexj.dev',
      linkedIn: 'https://linkedin.com/in/alexjohnson',
      gitHub: 'https://github.com/alexjohnson',
      languages: ['English', 'Spanish'],
      achievements: ['Won 1st place in University Hackathon 2025', 'Google Summer of Code 2025 contributor'],
      education: [
        {
          school: 'Tech Institute of Technology',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: 2023,
          endYear: 2027,
          grade: '9.2 CGPA'
        }
      ],
      experience: [
        {
          company: 'InnoTech Solutions',
          role: 'Frontend Intern',
          location: 'Remote',
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-07-31'),
          current: false,
          description: 'Developed interactive dashboards using React and Material UI. Improved loading performance by 25%.'
        }
      ],
      projects: [
        {
          title: 'Developer Connect Platform',
          description: 'A social networking site for developers using MERN stack with JWT authentication and direct messaging features.',
          link: 'https://devconnect.example.com',
          technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB']
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Cloud Practitioner',
          organization: 'Amazon Web Services',
          issueDate: new Date('2025-01-15'),
          credentialId: 'AWS-12345'
        }
      ]
    });

    const student2User = await User.create({
      name: 'Emma Watson',
      email: 'johndoe@student.com',
      password: 'password123',
      role: 'student',
      isVerified: true
    });
    const student2 = await Student.create({
      user: student2User._id,
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      resume: {
        url: '',
        filename: ''
      },
      skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML', 'CSS', 'User Research'],
      portfolio: 'https://emmaw.design',
      linkedIn: 'https://linkedin.com/in/emmaw-design',
      gitHub: '',
      languages: ['English', 'French'],
      education: [
        {
          school: 'State Design School',
          degree: 'Bachelor of Design',
          fieldOfStudy: 'Interaction Design',
          startYear: 2022,
          endYear: 2026,
          grade: 'A+'
        }
      ]
    });
    console.log('Seeded Students.');

    // 5. Create Jobs
    const jobs = await Job.insertMany([
      {
        title: 'Software Engineer Intern (React/Node)',
        company: company1._id, // Google
        location: 'Bangalore, India',
        salary: { min: 25000, max: 40000, currency: 'INR' },
        experienceRequired: '0-1 Years',
        skillsRequired: ['React', 'Node.js', 'Express', 'MongoDB'],
        category: categories[0]._id, // Software
        jobType: 'Internship',
        workMode: 'Hybrid',
        description: 'Google is looking for software engineering interns to join our Cloud team. You will work on scalable web applications and gain hands-on experience under senior guidance.',
        requirements: ['Pursuing a Bachelor\'s degree in Computer Science or related fields.', 'Solid understanding of HTML, CSS, JavaScript, and database concepts.', 'Familiarity with REST APIs and Node.js backend concepts.'],
        benefits: ['Work alongside top-tier Google engineers.', 'Free meals and transport facilities.', 'Potential pre-placement offer (PPO) based on performance.'],
        isFeatured: true,
        status: 'active'
      },
      {
        title: 'Full Stack Developer Intern',
        company: company2._id, // Netflix
        location: 'Mumbai, India',
        salary: { min: 30000, max: 45000, currency: 'INR' },
        experienceRequired: '0-1 Years',
        skillsRequired: ['React', 'Node.js', 'Tailwind CSS', 'PostgreSQL'],
        category: categories[0]._id, // Software
        jobType: 'Internship',
        workMode: 'Remote',
        description: 'Netflix seeks an energetic Full Stack Developer Intern for our Content Delivery Network (CDN) dashboards. Build visual analytic views that monitor traffic streams globally.',
        requirements: ['Strong command of JavaScript (ES6+).', 'Prior project experience using React and state management.', 'Knowledge of relational databases.'],
        benefits: ['100% remote workspace setup allowance.', 'Monthly Netflix subscription credit.', 'Mentorship under streaming platform specialists.'],
        isFeatured: true,
        status: 'active'
      },
      {
        title: 'Cloud Solutions Intern',
        company: company4._id, // Amazon
        location: 'Bangalore, India',
        salary: { min: 35000, max: 50000, currency: 'INR' },
        experienceRequired: '0-1 Years',
        skillsRequired: ['AWS', 'Python', 'Networking', 'Linux'],
        category: categories[0]._id, // Software
        jobType: 'Internship',
        workMode: 'Hybrid',
        description: 'Amazon Web Services (AWS) is hiring interns to help build, test, and deploy highly scalable cloud solutions for our global enterprise customers.',
        requirements: ['Basic understanding of cloud computing principles.', 'Strong programming skills in Python or Java.', 'Familiarity with Linux environments.'],
        benefits: ['Hands-on AWS certification training.', 'Mentorship from senior cloud architects.', 'Competitive stipend and relocation assistance.'],
        isFeatured: true,
        status: 'active'
      },
      {
        title: 'Product Design Intern',
        company: company6._id, // Spotify
        location: 'Remote',
        salary: { min: 25000, max: 35000, currency: 'INR' },
        experienceRequired: '0-1 Years',
        skillsRequired: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping'],
        category: categories[1]._id, // UI/UX Design
        jobType: 'Internship',
        workMode: 'Remote',
        description: 'Join Spotify’s design team as an intern and contribute to shaping the future of audio streaming experiences. You will assist in prototyping new app features.',
        requirements: ['Portfolio demonstrating UI/UX projects.', 'Proficiency in Figma and interactive prototyping.', 'Strong visual design sense and attention to detail.'],
        benefits: ['Fully remote internship.', 'Free Spotify Premium for life.', 'Collaborative and creative work culture.'],
        isFeatured: false,
        status: 'active'
      },
      {
        title: 'Data Science Trainee',
        company: company5._id, // Meta
        location: 'Gurugram, India',
        salary: { min: 40000, max: 60000, currency: 'INR' },
        experienceRequired: '0-1 Years',
        skillsRequired: ['Python', 'SQL', 'Machine Learning', 'Data Visualization'],
        category: categories[3]._id, // Data Science & AI
        jobType: 'Internship',
        workMode: 'On-site',
        description: 'Meta is looking for Data Science Trainees to analyze massive datasets and derive insights that shape the social experiences of billions of users.',
        requirements: ['Strong statistical and mathematical background.', 'Experience with Python, Pandas, and SQL.', 'Knowledge of basic ML algorithms.'],
        benefits: ['Access to cutting-edge AI research.', 'Comprehensive health wellness programs.', 'Pre-placement offer opportunity.'],
        isFeatured: true,
        status: 'active'
      },
      {
        title: 'AI Research Intern',
        company: company3._id, // Microsoft
        location: 'Hyderabad, India',
        salary: { min: 50000, max: 75000, currency: 'INR' },
        experienceRequired: '0-1 Years',
        skillsRequired: ['Deep Learning', 'PyTorch', 'NLP', 'Computer Vision'],
        category: categories[3]._id, // Data Science & AI
        jobType: 'Internship',
        workMode: 'Hybrid',
        description: 'Microsoft Research India is seeking ambitious interns to work on next-generation AI models, focusing on Natural Language Processing and generative AI solutions.',
        requirements: ['Enrolled in a Master’s or Ph.D. program in CS or AI.', 'Prior research experience or publications are a plus.', 'Proficiency in PyTorch or TensorFlow.'],
        benefits: ['Work with world-renowned AI researchers.', 'Housing and transportation allowance.', 'High stipend.'],
        isFeatured: true,
        status: 'active'
      },
      {
        title: 'Junior UX Designer',
        company: company1._id, // Google
        location: 'Bangalore, India',
        salary: { min: 45000, max: 60000, currency: 'INR' },
        experienceRequired: '1-3 Years',
        skillsRequired: ['Figma', 'User Research', 'Wireframing', 'Prototyping'],
        category: categories[1]._id, // UI/UX Design
        jobType: 'Full Time',
        workMode: 'On-site',
        description: 'Join the Google Maps UX team to design inclusive and delightful user journeys. You will conduct user research, create wireframes, prototypes, and collaborate with product engineers.',
        requirements: ['A strong design portfolio showcasing user-centric web/mobile design solutions.', 'Proficiency in industry design tools, particularly Figma.', 'Good understanding of design systems.'],
        benefits: ['Premium health insurance coverage.', 'Flexible learning budget.', 'State-of-the-art office workspace.'],
        isFeatured: false,
        status: 'active'
      }
    ]);
    console.log('Seeded Jobs.');

    // 6. Create Review
    await Review.create({
      company: company1._id,
      reviewer: student1._id,
      rating: 5,
      reviewText: 'Google offers an exceptional environment for university students. The mentorship is top-notch and the culture is highly collaborative.'
    });
    console.log('Seeded Reviews.');

    // 7. Seed Notification
    await Notification.create({
      recipient: student1User._id,
      title: 'Welcome to StudentJobPortal!',
      message: 'Explore active internships and jobs, upload your resume, and start applying today!',
      type: 'success',
      read: false
    });
    console.log('Seeded Notifications.');

    // 8. Create a dummy file for the resume so the application seeder doesn't fail
    const dummyResumePath = path.join(__dirname, '../uploads/sample-resume.pdf');
    const uploadsDir = path.dirname(dummyResumePath);
    if (!require('fs').existsSync(uploadsDir)) {
      require('fs').mkdirSync(uploadsDir, { recursive: true });
    }
    require('fs').writeFileSync(dummyResumePath, 'Dummy PDF Resume Content');
    console.log('Created dummy resume file.');

    console.log('Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
