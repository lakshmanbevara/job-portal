const express = require('express');
const {
  applyJob,
  getCompanyApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/apply/:jobId', authorize('student'), applyJob);
router.get('/company', authorize('company'), getCompanyApplications);
router.put('/:id/status', authorize('company'), updateApplicationStatus);

module.exports = router;
