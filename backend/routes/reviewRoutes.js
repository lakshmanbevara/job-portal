const express = require('express');
const { addReview, getCompanyReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:companyId', getCompanyReviews);
router.post('/:companyId', protect, authorize('student'), addReview);

module.exports = router;
