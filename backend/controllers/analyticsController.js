const prisma = require('../config/database');

// @desc    Get student progress analytics
// @route   GET /api/analytics/progress
// @access  Private
const getStudentProgress = async (req, res) => {
  try {
    const { courseId, date } = req.query;

    const where = {
      studentId: req.user.id
    };

    if (courseId) {
      where.courseId = courseId;
    }

    // Get enrollments with progress
    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      }
    });

    // Get quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });

    // Calculate statistics
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.completed).length;
    const averageProgress = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
      : 0;

    const totalQuizzes = quizAttempts.length;
    const averageQuizScore = quizAttempts.length > 0
      ? quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length
      : 0;

    res.json({
      success: true,
      data: {
        enrollments,
        quizAttempts,
        statistics: {
          totalCourses,
          completedCourses,
          averageProgress: averageProgress.toFixed(2),
          totalQuizzes,
          averageQuizScore: averageQuizScore.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Get student progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student progress',
      error: error.message
    });
  }
};

// @desc    Get instructor analytics
// @route   GET /api/analytics/instructor
// @access  Private (Instructor/Admin)
const getInstructorAnalytics = async (req, res) => {
  try {
    const { date, sortBy } = req.query;

    // Get instructor's courses
    const courses = await prisma.course.findMany({
      where: {
        instructorId: req.user.id
      },
      include: {
        enrollments: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            quizzes: true
          }
        }
      }
    });

    // Calculate statistics
    const totalCourses = courses.length;
    const totalEnrollments = courses.reduce((sum, c) => sum + c._count.enrollments, 0);
    const totalStudents = new Set(
      courses.flatMap(c => c.enrollments.map(e => e.studentId))
    ).size;

    // Calculate earnings (simplified - based on course price * enrollments)
    const totalEarnings = courses.reduce((sum, c) => {
      return sum + (c.price * c._count.enrollments);
    }, 0);

    // Get recent enrollments
    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: req.user.id
        }
      },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' },
      take: 10
    });

    // Course performance
    const coursePerformance = courses.map(course => ({
      id: course.id,
      title: course.title,
      enrollments: course._count.enrollments,
      lessons: course._count.lessons,
      quizzes: course._count.quizzes,
      rating: course.rating,
      earnings: course.price * course._count.enrollments
    }));

    // Sort if requested
    if (sortBy === 'revenue') {
      coursePerformance.sort((a, b) => b.earnings - a.earnings);
    } else if (sortBy === 'enrollments') {
      coursePerformance.sort((a, b) => b.enrollments - a.enrollments);
    }

    res.json({
      success: true,
      data: {
        statistics: {
          totalCourses,
          totalEnrollments,
          totalStudents,
          totalEarnings: totalEarnings.toFixed(2)
        },
        courses: coursePerformance,
        recentEnrollments
      }
    });
  } catch (error) {
    console.error('Get instructor analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor analytics',
      error: error.message
    });
  }
};

module.exports = {
  getStudentProgress,
  getInstructorAnalytics
};

