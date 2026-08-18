const express = require('express');
const {
  getStudentProfile,
  updateStudentProfile,
  uploadPhoto,
  uploadResume,
  addEducation,
  deleteEducation,
  addExperience,
  deleteExperience,
  addProject,
  deleteProject,
  addCertification,
  deleteCertification,
  getAppliedJobs
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Require protection for all routes
router.use(protect);
router.use(authorize('student'));

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.post('/photo', upload.single('profilePhoto'), uploadPhoto);
router.post('/resume', upload.single('resume'), uploadResume);

router.post('/education', addEducation);
router.delete('/education/:eduId', deleteEducation);

router.post('/experience', addExperience);
router.delete('/experience/:expId', deleteExperience);

router.post('/projects', addProject);
router.delete('/projects/:projId', deleteProject);

router.post('/certifications', addCertification);
router.delete('/certifications/:certId', deleteCertification);

router.get('/applications', getAppliedJobs);

module.exports = router;
