const express = require('express');
const router = express.Router();
const { Quiz, QuizAttempt, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all quizzes (admin)
router.get('/admin', authenticateToken, async (req, res) => {
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
router.get('/active', authenticateToken, async (req, res) => {
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
router.get('/:id', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, async (req, res) => {
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
      scoring_rules,
      quiz_type,
      external_quiz_url,
      external_quiz_id,
      point_calculation_method,
      min_score_for_points
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
      created_by: req.user.id,
      quiz_type: quiz_type || 'internal',
      external_quiz_url,
      external_quiz_id,
      point_calculation_method: point_calculation_method || 'percentage',
      min_score_for_points: parseInt(min_score_for_points) || 70
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
router.put('/:id', authenticateToken, async (req, res) => {
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
      is_active,
      quiz_type,
      external_quiz_url,
      external_quiz_id,
      point_calculation_method,
      min_score_for_points
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
      is_active,
      quiz_type: quiz_type || 'internal',
      external_quiz_url,
      external_quiz_id,
      point_calculation_method: point_calculation_method || 'percentage',
      min_score_for_points: parseInt(min_score_for_points) || 70
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
router.delete('/:id', authenticateToken, async (req, res) => {
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
router.post('/:id/attempt', authenticateToken, async (req, res) => {
  try {
    console.log('Quiz attempt submission started for quiz:', req.params.id);
    console.log('User ID:', req.user.id);
    
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz || !quiz.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found or inactive'
      });
    }

    console.log('Quiz found:', quiz.title);
    console.log('Quiz questions count:', quiz.questions?.length || 0);

    const { answers, time_taken } = req.body;
    console.log('Received answers:', answers);
    console.log('Time taken:', time_taken);

    // Calculate score based on answers and scoring rules
    let score = 0;
    let max_score = 0;

    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      console.error('Quiz questions not found or invalid:', quiz.questions);
      return res.status(500).json({
        success: false,
        message: 'Quiz questions not found'
      });
    }

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct_answer;
      
      max_score += question.points || 1;
      
      if (userAnswer === correctAnswer) {
        score += question.points || 1;
      }
    });

    const percentage = (score / max_score) * 100;
    console.log('Calculated score:', score, 'max_score:', max_score, 'percentage:', percentage);
    
    // Calculate points earned based on percentage and max_points
    let points_earned = 0;
    if (percentage >= quiz.passing_score) {
      points_earned = Math.round((percentage / 100) * quiz.max_points);
    }
    console.log('Points earned:', points_earned);

    console.log('Creating quiz attempt...');
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
    console.log('Quiz attempt created successfully:', attempt.id);

    // Add points to user if earned
    if (points_earned > 0) {
      console.log('Adding points to user...');
      await User.increment('points', { 
        where: { id: req.user.id },
        by: points_earned 
      });
      
      // Create point transaction record
      await PointTransaction.create({
        user_id: req.user.id,
        transaction_type: 'earned',
        points_amount: points_earned,
        quiz_id: quiz.id,
        description: `完成測驗: ${quiz.title}`,
        metadata: {
          quiz_attempt_id: attempt.id,
          score_percentage: percentage,
          source: 'internal_quiz'
        }
      });
      console.log('Point transaction created successfully');
    }

    console.log('Quiz attempt submission completed successfully');
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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz attempt',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get user's quiz attempts
router.get('/user/attempts', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching user attempts for user ID:', req.user.id);
    
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

    console.log('Found attempts:', attempts.length);
    res.json({
      success: true,
      attempts
    });
  } catch (error) {
    console.error('Get user attempts error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attempts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get quiz statistics (admin)
router.get('/:id/stats', authenticateToken, async (req, res) => {
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