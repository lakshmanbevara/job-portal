const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    resume: {
      url: { type: String, required: true },
      filename: { type: String, required: true }
    },
    coverLetter: {
      type: String
    },
    status: {
      type: String,
      enum: ['Applied', 'Reviewing', 'Interview Scheduled', 'Accepted', 'Rejected'],
      default: 'Applied'
    },
    interviewDate: {
      type: Date
    },
    interviewDetails: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Prevent a student from applying to the same job multiple times
ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
