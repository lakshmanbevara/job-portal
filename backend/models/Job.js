const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: false
    },
    location: {
      type: String,
      required: [true, 'Please add a location']
    },
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    experienceRequired: {
      type: String,
      required: [true, 'Please add experience requirement'],
      enum: ['No Experience', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years']
    },
    skillsRequired: [{
      type: String,
      required: true
    }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Internship', 'Walk-in', 'Government Jobs'],
      default: 'Full Time'
    },
    workMode: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'On-site'
    },
    description: {
      type: String,
      required: [true, 'Please add job description']
    },
    requirements: [{
      type: String
    }],
    benefits: [{
      type: String
    }],
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Job', JobSchema);
