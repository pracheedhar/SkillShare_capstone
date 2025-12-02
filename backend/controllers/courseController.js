const prisma = require('../config/database');

// @desc    Get all courses with filtering, searching, and sorting
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      difficulty,
      instructorId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    // Build orderBy
    let orderBy = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: sortOrder };
        break;
      case 'popularity':
        orderBy = { enrolledCount: sortOrder };
        break;
      case 'newest':
        orderBy = { createdAt: sortOrder };
        break;
      case 'title':
        orderBy = { title: sortOrder };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    // Get courses
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          _count: {
            select: {
              lessons: true,
              enrollments: true
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.course.count({ where })
    ]);

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true
          }
        },
        lessons: {
          orderBy: { order: 'asc' }
        },
        quizzes: true,
        _count: {
          select: {
            enrollments: true,
            discussions: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      price,
      thumbnail
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        difficulty: difficulty || 'BEGINNER',
        price: parseFloat(price) || 0,
        thumbnail,
        instructorId: req.user.id
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      difficulty,
      price,
      thumbnail
    } = req.body;

    // Check if course exists and user is the owner
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (existingCourse.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (difficulty) updateData.difficulty = difficulty;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (thumbnail) updateData.thumbnail = thumbnail;

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists and user is the owner
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (existingCourse.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await prisma.course.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};

