const express = require('express');
const router = express.Router();
const {
  getEnrollments,
  createEnrollment,
  updateProgress
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('STUDENT'));

router.get('/', getEnrollments);
router.post('/', createEnrollment);
router.put('/:id/progress', updateProgress);

module.exports = router;

