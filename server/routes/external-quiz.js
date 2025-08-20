const express = require('express');
const router = express.Router();
const { Quiz, QuizAttempt, User, PointTransaction } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// External quiz completion webhook
router.post('/webhook/quiz-completion', async (req, res) => {
  try {
    const {
      quiz_id,
      user_email,
      score_percentage,
      time_taken,
      answers,
      external_quiz_data
    } = req.body;

    // Validate webhook signature (implement security)
    // if (!validateWebhookSignature(req)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    // Find the quiz
    const quiz = await Quiz.findOne({
      where: { 
        external_quiz_id: quiz_id,
        quiz_type: 'external',
        is_active: true
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email: user_email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate points based on quiz configuration
    let points_earned = 0;
    if (score_percentage >= quiz.min_score_for_points) {
      switch (quiz.point_calculation_method) {
        case 'percentage':
          points_earned = Math.round((score_percentage / 100) * quiz.max_points);
          break;
        case 'fixed':
          points_earned = quiz.max_points;
          break;
        case 'custom':
          // Implement custom calculation logic
          points_earned = calculateCustomPoints(score_percentage, quiz);
          break;
      }
    }

    // Create quiz attempt record
    const attempt = await QuizAttempt.create({
      user_id: user.id,
      quiz_id: quiz.id,
      score: score_percentage,
      max_score: 100,
      percentage: score_percentage,
      points_earned,
      answers: answers || [],
      time_taken,
      completed: true,
      completed_at: new Date(),
      metadata: {
        external_quiz_data,
        webhook_received_at: new Date()
      }
    });

    // Add points to user if earned
    if (points_earned > 0) {
      await user.increment('points', { by: points_earned });
      
      // Create point transaction record
      await PointTransaction.create({
        user_id: user.id,
        transaction_type: 'earned',
        points_amount: points_earned,
        description: `完成測驗: ${quiz.title}`,
        metadata: {
          quiz_id: quiz.id,
          quiz_attempt_id: attempt.id,
          score_percentage,
          source: 'external_quiz'
        }
      });
    }

    res.json({
      success: true,
      points_earned,
      user_total_points: user.points + points_earned
    });

  } catch (error) {
    console.error('External quiz webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz configuration for external platforms
router.get('/quiz/:external_id/config', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { 
        external_quiz_id: req.params.external_id,
        quiz_type: 'external',
        is_active: true
      },
      attributes: ['id', 'title', 'description', 'max_points', 'min_score_for_points', 'point_calculation_method']
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      success: true,
      quiz_config: {
        quiz_id: quiz.external_quiz_id,
        title: quiz.title,
        description: quiz.description,
        max_points: quiz.max_points,
        min_score_for_points: quiz.min_score_for_points,
        point_calculation_method: quiz.point_calculation_method
      }
    });

  } catch (error) {
    console.error('Get quiz config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function for custom point calculation
function calculateCustomPoints(score_percentage, quiz) {
  // Default custom calculation: bonus points for high scores
  let points = Math.round((score_percentage / 100) * quiz.max_points);
  
  if (score_percentage >= 90) {
    points += Math.round(quiz.max_points * 0.1); // 10% bonus for 90%+
  } else if (score_percentage >= 80) {
    points += Math.round(quiz.max_points * 0.05); // 5% bonus for 80%+
  }
  
  return points;
}

module.exports = router; 