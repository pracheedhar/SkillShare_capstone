const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  createSubscription,
  cancelSubscription,
  checkSubscriptionStatus
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSubscriptions);
router.get('/status', checkSubscriptionStatus);
router.post('/', createSubscription);
router.put('/:id/cancel', cancelSubscription);

module.exports = router;

