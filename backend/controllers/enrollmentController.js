const prisma = require('../config/database');

// @desc    Get all enrollments for logged-in student
// @route   GET /api/enrollments
// @access  Private (Student)
const getEnrollments = async (req, res) => {
  try {
    const {
      progress,
      completed,
      sortBy = 'enrolledAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      studentId: req.user.id
    };

    if (progress !== undefined) {
      where.progress = parseFloat(progress);
    }

    if (completed !== undefined) {
      where.completed = completed === 'true';
    }

    let orderBy = {};
    switch (sortBy) {
      case 'enrolledAt':
        orderBy = { enrolledAt: sortOrder };
        break;
      case 'progress':
        orderBy = { progress: sortOrder };
        break;
      default:
        orderBy = { enrolledAt: 'desc' };
    }

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        include: {
          course: {
            include: {
              instructor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              },
              _count: {
                select: {
                  lessons: true
                }
              }
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.enrollment.count({ where })
    ]);

    res.json({
      success: true,
      data: enrollments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
};

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private (Student)
const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: req.user.id,
          courseId: courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // TODO: Check subscription or payment here
    // For now, allow enrollment

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: req.user.id,
        courseId: courseId
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    // Update course enrollment count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        enrolledCount: {
          increment: 1
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Enrolled in course successfully',
      data: enrollment
    });
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private (Student)
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, completed } = req.body;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment'
      });
    }

    const updateData = {};
    if (progress !== undefined) {
      updateData.progress = Math.min(100, Math.max(0, parseFloat(progress)));
    }
    if (completed !== undefined) {
      updateData.completed = completed === true;
      if (completed && !enrollment.completedAt) {
        updateData.completedAt = new Date();
      }
    }

    const updatedEnrollment = await prisma.enrollment.update({
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
      message: 'Progress updated successfully',
      data: updatedEnrollment
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

module.exports = {
  getEnrollments,
  createEnrollment,
  updateProgress
};

