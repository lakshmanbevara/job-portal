const Review = require('../models/Review');
const Company = require('../models/Company');
const Student = require('../models/Student');

// @desc    Add a review for a company
// @route   POST /api/reviews/:companyId
// @access  Private (Student)
exports.addReview = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const { rating, reviewText } = req.body;

    const review = await Review.create({
      company: company._id,
      reviewer: student._id,
      rating,
      reviewText
    });

    // Update Company Review Averages
    const companyReviews = await Review.find({ company: company._id });
    const count = companyReviews.length;
    const avgRating = companyReviews.reduce((sum, r) => sum + r.rating, 0) / count;

    company.reviewsCount = count;
    company.rating = Math.round(avgRating * 10) / 10;
    await company.save();

    res.status(201).json({ success: true, data: review, companyRating: company.rating, companyReviewsCount: company.reviewsCount });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this company' });
    }
    next(error);
  }
};

// @desc    Get all reviews for a company
// @route   GET /api/reviews/:companyId
// @access  Public
exports.getCompanyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ company: req.params.companyId })
      .populate({
        path: 'reviewer',
        populate: { path: 'user', select: 'name' }
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};
