const express = require('express');
const router = express.Router();
const {
  getDiscussions,
  createDiscussion,
  addReply,
  updateDiscussion,
  deleteDiscussion
} = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getDiscussions);
router.post('/', createDiscussion);
router.post('/:id/reply', addReply);
router.put('/:id', updateDiscussion);
router.delete('/:id', deleteDiscussion);

module.exports = router;

