const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);
router.post('/', protect, authorize('INSTRUCTOR', 'ADMIN'), createCourse);
router.put('/:id', protect, authorize('INSTRUCTOR', 'ADMIN'), updateCourse);
router.delete('/:id', protect, authorize('INSTRUCTOR', 'ADMIN'), deleteCourse);

module.exports = router;

