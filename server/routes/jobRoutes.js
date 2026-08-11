const express = require('express');
const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
  getJobDetails,
  saveJob,
  unsaveJob,
  getCompanyJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/detail/:id', getJobDetails);

// Company-specific routes
router.get('/company/posted', protect, authorize('company'), getCompanyJobs);
router.post('/', protect, authorize('company'), createJob);
router.put('/:id', protect, authorize('company'), updateJob);
router.delete('/:id', protect, authorize('company', 'admin'), deleteJob);

// Student bookmark/save routes
router.post('/:id/save', protect, authorize('student'), saveJob);
router.post('/:id/unsave', protect, authorize('student'), unsaveJob);

module.exports = router;
