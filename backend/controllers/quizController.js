const prisma = require('../config/database');

// @desc    Get all quizzes with filtering and sorting
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const {
      search,
      courseId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
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
        { description: { contains: search } }
      ];
    }

    if (courseId) {
      where.courseId = courseId;
    }

    let orderBy = {};
    switch (sortBy) {
      case 'createdAt':
        orderBy = { createdAt: sortOrder };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              title: true
            }
          },
          _count: {
            select: {
              attempts: true
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.quiz.count({ where })
    ]);

    res.json({
      success: true,
      data: quizzes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quizzes',
      error: error.message
    });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        },
        attempts: {
          where: { userId: req.user.id },
          orderBy: { completedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error.message
    });
  }
};

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Instructor/Admin)
const createQuiz = async (req, res) => {
  try {
    const { title, description, courseId, questions } = req.body;

    if (!title || !courseId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Title, courseId, and questions array are required'
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
        message: 'Not authorized to add quizzes to this course'
      });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || '',
        courseId,
        questions: questions
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
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Instructor/Admin)
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;

    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
      include: { course: true }
    });

    if (!existingQuiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (existingQuiz.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz'
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (questions) updateData.questions = questions;

    const quiz = await prisma.quiz.update({
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
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quiz',
      error: error.message
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Answers array is required'
      });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const questions = quiz.questions;
    let correctCount = 0;
    const totalQuestions = questions.length;

    // Calculate score
    answers.forEach((userAnswer, index) => {
      if (questions[index] && questions[index].correctAnswer === userAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / totalQuestions) * 100;

    // Save quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId: id,
        score,
        totalQuestions,
        answers: answers
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        attempt,
        score: score.toFixed(2),
        correctCount,
        totalQuestions
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz',
      error: error.message
    });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  submitQuiz
};

