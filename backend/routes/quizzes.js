const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  submitQuiz
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/', protect, authorize('INSTRUCTOR', 'ADMIN'), createQuiz);
router.put('/:id', protect, authorize('INSTRUCTOR', 'ADMIN'), updateQuiz);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;

