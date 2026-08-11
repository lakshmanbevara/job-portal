const express = require('express');
const {
  getDashboardStats,
  getStudents,
  getCompanies,
  getJobs,
  verifyCompany,
  deleteUser,
  registerCompanyByAdmin,
  updateCompanyByAdmin
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/students', getStudents);
router.get('/companies', getCompanies);
router.get('/jobs', getJobs);
router.put('/companies/:id/verify', verifyCompany);
router.put('/companies/:id', updateCompanyByAdmin);
router.delete('/users/:id', deleteUser);
router.post('/companies/register', registerCompanyByAdmin);

module.exports = router;
