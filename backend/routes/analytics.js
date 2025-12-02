const express = require('express');
const router = express.Router();
const {
  getStudentProgress,
  getInstructorAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/progress', getStudentProgress);
router.get('/instructor', authorize('INSTRUCTOR', 'ADMIN'), getInstructorAnalytics);

module.exports = router;

