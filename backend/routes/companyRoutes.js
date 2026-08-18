const express = require('express');
const {
  getCompanyProfile,
  updateCompanyProfile,
  uploadLogo,
  getAllCompanies,
  getCompanyDetails
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getAllCompanies);
router.get('/:id', getCompanyDetails);

// Protected routes (Company only)
router.get('/company/profile', protect, authorize('company'), getCompanyProfile);
router.put('/company/profile', protect, authorize('company'), updateCompanyProfile);
router.post('/company/logo', protect, authorize('company', 'admin'), upload.single('logo'), uploadLogo);

module.exports = router;
