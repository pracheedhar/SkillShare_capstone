const prisma = require('../config/database');

// @desc    Get all subscriptions for user
// @route   GET /api/subscriptions
// @access  Private
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message
    });
  }
};

// @desc    Check subscription status
// @route   GET /api/subscriptions/status
// @access  Private
const checkSubscriptionStatus = async (req, res) => {
  try {
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        isActive: true,
        endDate: {
          gte: new Date()
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: {
        hasActiveSubscription: !!activeSubscription,
        subscription: activeSubscription
      }
    });
  } catch (error) {
    console.error('Check subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking subscription status',
      error: error.message
    });
  }
};

// @desc    Create a new subscription
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res) => {
  try {
    const { plan, paymentId } = req.body;

    if (!plan || !['MONTHLY', 'YEARLY'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Valid subscription plan (MONTHLY or YEARLY) is required'
      });
    }

    // Cancel existing active subscriptions
    await prisma.subscription.updateMany({
      where: {
        userId: req.user.id,
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    if (plan === 'MONTHLY') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user.id,
        plan,
        startDate,
        endDate,
        isActive: true,
        paymentId: paymentId || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
};

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private
const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (subscription.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this subscription'
      });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: updatedSubscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

module.exports = {
  getSubscriptions,
  createSubscription,
  cancelSubscription,
  checkSubscriptionStatus
};

