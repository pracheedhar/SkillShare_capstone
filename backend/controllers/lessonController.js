const prisma = require('../config/database');

// @desc    Get all lessons with filtering and sorting
// @route   GET /api/lessons
// @access  Private
const getLessons = async (req, res) => {
  try {
    const {
      search,
      courseId,
      sortBy = 'order',
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ];
    }

    if (courseId) {
      where.courseId = courseId;
    }

    let orderBy = {};
    switch (sortBy) {
      case 'order':
        orderBy = { order: sortOrder };
        break;
      case 'createdAt':
        orderBy = { createdAt: sortOrder };
        break;
      case 'duration':
        orderBy = { duration: sortOrder };
        break;
      default:
        orderBy = { order: 'asc' };
    }

    const [lessons, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.lesson.count({ where })
    ]);

    res.json({
      success: true,
      data: lessons,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lessons',
      error: error.message
    });
  }
};

// @desc    Create a new lesson
// @route   POST /api/lessons
// @access  Private (Instructor/Admin)
const createLesson = async (req, res) => {
  try {
    const { title, content, videoUrl, duration, order, courseId } = req.body;

    if (!title || !content || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and courseId are required'
      });
    }

    // Verify course exists and user is the instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        duration: parseInt(duration) || 0,
        order: parseInt(order) || 0,
        courseId
      },
      include: {
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
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lesson',
      error: error.message
    });
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Instructor/Admin)
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, videoUrl, duration, order } = req.body;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: { course: true }
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    if (existingLesson.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (videoUrl) updateData.videoUrl = videoUrl;
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (order !== undefined) updateData.order = parseInt(order);

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lesson',
      error: error.message
    });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Instructor/Admin)
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: { course: true }
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    if (existingLesson.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson'
      });
    }

    await prisma.lesson.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lesson',
      error: error.message
    });
  }
};

module.exports = {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson
};

