const express = require('express');
const router = express.Router();
const { Quiz, QuizAttempt, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all quizzes (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes'
    });
  }
});

// Get active quizzes for clients
router.get('/active', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: {
        is_active: true
      },
      attributes: [
        'id', 'title', 'description', 'category', 'max_points', 
        'time_limit', 'difficulty', 'image_url', 'instructions'
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error('Get active quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes'
    });
  }
});

// Get quiz by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz'
    });
  }
});

// Create new quiz (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      title,
      description,
      category,
      max_points,
      time_limit,
      difficulty,
      image_url,
      instructions,
      passing_score,
      questions,
      scoring_rules
    } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      category,
      max_points: parseInt(max_points),
      time_limit: time_limit ? parseInt(time_limit) : null,
      difficulty,
      image_url,
      instructions,
      passing_score: parseInt(passing_score),
      questions,
      scoring_rules,
      created_by: req.user.id
    });

    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create quiz'
    });
  }
});

// Update quiz (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const {
      title,
      description,
      category,
      max_points,
      time_limit,
      difficulty,
      image_url,
      instructions,
      passing_score,
      questions,
      scoring_rules,
      is_active
    } = req.body;

    await quiz.update({
      title,
      description,
      category,
      max_points: parseInt(max_points),
      time_limit: time_limit ? parseInt(time_limit) : null,
      difficulty,
      image_url,
      instructions,
      passing_score: parseInt(passing_score),
      questions,
      scoring_rules,
      is_active
    });

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quiz'
    });
  }
});

// Delete quiz (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await quiz.destroy();

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz'
    });
  }
});

// Submit quiz attempt
router.post('/:id/attempt', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz || !quiz.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found or inactive'
      });
    }

    const { answers, time_taken } = req.body;

    // Calculate score based on answers and scoring rules
    let score = 0;
    let max_score = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct_answer;
      
      max_score += question.points || 1;
      
      if (userAnswer === correctAnswer) {
        score += question.points || 1;
      }
    });

    const percentage = (score / max_score) * 100;
    
    // Calculate points earned based on percentage and max_points
    let points_earned = 0;
    if (percentage >= quiz.passing_score) {
      points_earned = Math.round((percentage / 100) * quiz.max_points);
    }

    const attempt = await QuizAttempt.create({
      user_id: req.user.id,
      quiz_id: quiz.id,
      score,
      max_score,
      percentage,
      points_earned,
      answers,
      time_taken,
      completed: true,
      completed_at: new Date()
    });

    // Add points to user if earned
    if (points_earned > 0) {
      // You'll need to implement point addition logic here
      // This could involve updating the user's points or creating a point transaction
    }

    res.json({
      success: true,
      attempt,
      score,
      max_score,
      percentage,
      points_earned
    });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz attempt'
    });
  }
});

// Get user's quiz attempts
router.get('/user/attempts', auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: {
        user_id: req.user.id
      },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'category', 'max_points']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      attempts
    });
  } catch (error) {
    console.error('Get user attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attempts'
    });
  }
});

// Get quiz statistics (admin)
router.get('/:id/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const attempts = await QuizAttempt.findAll({
      where: {
        quiz_id: req.params.id
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const totalAttempts = attempts.length;
    const completedAttempts = attempts.filter(a => a.completed).length;
    const averageScore = attempts.length > 0 
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length 
      : 0;
    const totalPointsEarned = attempts.reduce((sum, a) => sum + a.points_earned, 0);

    res.json({
      success: true,
      stats: {
        totalAttempts,
        completedAttempts,
        averageScore: Math.round(averageScore * 100) / 100,
        totalPointsEarned,
        attempts
      }
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz statistics'
    });
  }
});

module.exports = router; 