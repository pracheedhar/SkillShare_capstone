const express = require('express');
const router = express.Router();
const {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getLessons);
router.post('/', protect, authorize('INSTRUCTOR', 'ADMIN'), createLesson);
router.put('/:id', protect, authorize('INSTRUCTOR', 'ADMIN'), updateLesson);
router.delete('/:id', protect, authorize('INSTRUCTOR', 'ADMIN'), deleteLesson);

module.exports = router;

