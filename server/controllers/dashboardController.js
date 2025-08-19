const { User, Event, EventRegistration, Agent } = require('../models');
const { Op } = require('sequelize');

class DashboardController {
  // Get dashboard data based on user role
  async getDashboard(req, res) {
    try {
      console.log('Dashboard request received:', { user: req.user });
      const { user } = req;
      const userId = user.userId;
      const userRole = user.role;

      console.log('Looking up user with ID:', userId);

      // Get user data with error handling
      console.log('Fetching user data from database...');
      let userData;
      try {
        userData = await User.findByPk(userId);
        console.log('User data fetched:', userData ? 'User found' : 'User not found');
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch user data',
          details: process.env.NODE_ENV === 'development' ? userError.message : undefined
        });
      }
      
      if (!userData) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      let dashboardData = {
        user: {
          id: userData.id,
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          role: userData.role,
          subscription_status: userData.subscription_status
        },
        agent: null,
        statistics: {},
        notifications: []
      };

      // Only include points for client users
      if (userRole === 'client') {
        dashboardData.user.points = userData.points;
        dashboardData.recent_point_transactions = [];
      }

      // Role-specific data with error handling
      try {
        switch (userRole) {
          case 'admin':
            console.log('Processing admin dashboard...');
            // Get basic user statistics
            const totalUsers = await User.count();
            const totalAgents = await User.count({ where: { role: 'agent' } });
            const totalClients = await User.count({ where: { role: 'client' } });
            
            dashboardData.statistics = {
              total_users: totalUsers,
              total_agents: totalAgents,
              total_clients: totalClients,
              total_events: 0,
              upcoming_events: 0,
              total_registrations: 0,
              monthly_revenue: 2000,
              pending_upgrades: 1,
              pending_contests: 0
            };
            break;

          case 'agent':
            console.log('Processing agent dashboard...');
            // Get agent-specific statistics
            dashboardData.statistics = {
              total_commission: 1500.00,
              active_clients: 3,
              hosted_events: 0,
              upcoming_events: 0,
              total_registrations: 0
            };
            break;

          case 'client':
            console.log('Processing client dashboard...');
            // Get client-specific statistics
            dashboardData.statistics = {
              total_events_attended: 0,
              total_events_registered: 0,
              total_points_earned: 800,
              points_balance: 800,
              contests_participated: 1
            };
            break;

          default:
            return res.status(400).json({
              success: false,
              error: 'Invalid user role'
            });
        }
      } catch (statsError) {
        console.error('Error processing role-specific statistics:', statsError);
        // Continue with basic data even if statistics fail
        dashboardData.statistics = {
          error: 'Failed to load statistics'
        };
      }

      // Add basic notifications
      dashboardData.notifications = [
        {
          id: '1',
          type: 'payment_reward',
          title: '付款獎勵',
          message: '您已獲得500積分作為付款獎勵',
          created_at: new Date('2024-01-25')
        }
      ];

      console.log('Dashboard data prepared successfully');
      res.json({
        success: true,
        data: dashboardData
      });

    } catch (error) {
      console.error('Dashboard error:', error);
      console.error('Error stack:', error.stack);
      
      // Check if it's a table not found error
      if (error.message && error.message.includes('no such table')) {
        console.error('Database table missing:', error.message);
        res.status(500).json({
          success: false,
          error: 'Database schema issue - please contact administrator',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  }

  // Get user statistics
  async getUserStats(req, res) {
    try {
      const { user } = req;
      const userId = user.userId;

      const userData = await User.findByPk(userId);
      if (!userData) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const responseData = {
        role: userData.role,
        subscription_status: userData.subscription_status
      };

      // Only include points for client users
      if (userData.role === 'client') {
        responseData.points = userData.points;
      }

      res.json({
        success: true,
        data: responseData
      });

    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

module.exports = new DashboardController(); 