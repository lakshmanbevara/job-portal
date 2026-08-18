const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number },
  grade: { type: String }
});

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  technologies: [{ type: String }]
});

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  issueDate: { type: Date },
  expirationDate: { type: Date },
  credentialId: { type: String }
});

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    resume: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      filename: { type: String, default: '' }
    },
    skills: [{ type: String }],
    education: [EducationSchema],
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
      }
    ],
    portfolio: { type: String, default: '' },
    linkedIn: { type: String, default: '' },
    gitHub: { type: String, default: '' },
    languages: [{ type: String }],
    achievements: [{ type: String }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', StudentSchema);
