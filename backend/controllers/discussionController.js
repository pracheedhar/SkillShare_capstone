const prisma = require('../config/database');

// @desc    Get all discussions for a course
// @route   GET /api/discussions
// @access  Private
const getDiscussions = async (req, res) => {
  try {
    const { courseId, page = 1, limit = 10 } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [discussions, total] = await Promise.all([
      prisma.discussion.findMany({
        where: { courseId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          course: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.discussion.count({ where: { courseId } })
    ]);

    res.json({
      success: true,
      data: discussions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discussions',
      error: error.message
    });
  }
};

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private
const createDiscussion = async (req, res) => {
  try {
    const { courseId, title, content } = req.body;

    if (!courseId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Course ID, title, and content are required'
      });
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const discussion = await prisma.discussion.create({
      data: {
        courseId,
        userId: req.user.id,
        title,
        content,
        replies: []
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      data: discussion
    });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating discussion',
      error: error.message
    });
  }
};

// @desc    Add reply to discussion
// @route   POST /api/discussions/:id/reply
// @access  Private
const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }

    const discussion = await prisma.discussion.findUnique({
      where: { id }
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const replies = Array.isArray(discussion.replies) ? discussion.replies : [];
    const newReply = {
      id: Date.now().toString(),
      userId: req.user.id,
      userName: req.user.name,
      content,
      createdAt: new Date().toISOString()
    };

    replies.push(newReply);

    const updatedDiscussion = await prisma.discussion.update({
      where: { id },
      data: { replies },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: updatedDiscussion
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reply',
      error: error.message
    });
  }
};

// @desc    Update discussion
// @route   PUT /api/discussions/:id
// @access  Private
const updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const discussion = await prisma.discussion.findUnique({
      where: { id }
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    if (discussion.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this discussion'
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    const updatedDiscussion = await prisma.discussion.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Discussion updated successfully',
      data: updatedDiscussion
    });
  } catch (error) {
    console.error('Update discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating discussion',
      error: error.message
    });
  }
};

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private
const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;

    const discussion = await prisma.discussion.findUnique({
      where: { id }
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    if (discussion.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion'
      });
    }

    await prisma.discussion.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting discussion',
      error: error.message
    });
  }
};

module.exports = {
  getDiscussions,
  createDiscussion,
  addReply,
  updateDiscussion,
  deleteDiscussion
};

