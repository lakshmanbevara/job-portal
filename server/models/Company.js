const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true
    },
    logo: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a company description']
    },
    location: {
      type: String,
      required: [true, 'Please add a location']
    },
    industry: {
      type: String,
      required: [true, 'Please add an industry']
    },
    employeeCount: {
      type: Number,
      default: 1
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Company', CompanySchema);
