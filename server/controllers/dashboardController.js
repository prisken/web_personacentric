const { User } = require('../models');

class DashboardController {
  // Get dashboard data based on user role
  async getDashboard(req, res) {
    try {
      const { user } = req;
      const userId = user.userId;
      const userRole = user.role;

      // Get user data
      const userData = await User.findByPk(userId);
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
          points: userData.points,
          subscription_status: userData.subscription_status
        },
        statistics: {},
        notifications: [],
        recent_point_transactions: []
      };

      // Role-specific data
      switch (userRole) {
        case 'admin':
          dashboardData.statistics = {
            total_users: 5,
            total_agents: 2,
            monthly_revenue: 2000,
            pending_upgrades: 1,
            pending_contests: 0
          };
          dashboardData.recent_users = [
            {
              id: '1',
              first_name: '張',
              last_name: '顧問',
              email: 'agent1@personacentric.com',
              role: 'agent',
              created_at: new Date('2024-01-15')
            },
            {
              id: '2',
              first_name: '王',
              last_name: '客戶',
              email: 'client1@personacentric.com',
              role: 'client',
              created_at: new Date('2024-01-20')
            }
          ];
          dashboardData.recent_payments = [
            {
              id: '1',
              amount: 10.00,
              status: 'completed',
              user: {
                first_name: '張',
                last_name: '顧問'
              },
              created_at: new Date('2024-01-25')
            }
          ];
          break;

        case 'agent':
          dashboardData.statistics = {
            total_commission: 1500.00,
            active_clients: 3,
            hosted_events: 2,
            points_balance: 1500
          };
          dashboardData.client_relationships = [
            {
              id: '1',
              client: {
                first_name: '王',
                last_name: '客戶',
                email: 'client1@personacentric.com'
              },
              status: 'active',
              total_commission: 1500.00,
              created_at: new Date('2024-01-01')
            }
          ];
          dashboardData.recent_events = [
            {
              id: '1',
              title: '投資策略研討會',
              description: '學習最新的投資策略和市場分析',
              start_date: new Date('2024-02-15'),
              status: 'upcoming'
            }
          ];
          dashboardData.recent_point_transactions = [
            {
              id: '1',
              transaction_type: 'earned',
              points_amount: 500,
              description: '付款獎勵 - 月費訂閱',
              created_at: new Date('2024-01-25')
            }
          ];
          break;

        case 'client':
          dashboardData.statistics = {
            total_events_attended: 2,
            total_points_earned: 800,
            points_balance: 800,
            contests_participated: 1
          };
          dashboardData.registered_events = [
            {
              id: '1',
              event: {
                title: '投資策略研討會',
                description: '學習最新的投資策略和市場分析',
                start_date: new Date('2024-02-15')
              },
              status: 'registered'
            }
          ];
          dashboardData.available_events = [
            {
              id: '2',
              title: '退休規劃工作坊',
              description: '為您的退休生活做好準備',
              start_date: new Date('2024-02-20')
            }
          ];
          dashboardData.recent_point_transactions = [
            {
              id: '1',
              transaction_type: 'earned',
              points_amount: 300,
              description: '活動參與獎勵',
              created_at: new Date('2024-01-15')
            }
          ];
          dashboardData.contest_participations = [
            {
              id: '1',
              contest: {
                title: '2024年1月內容競賽'
              },
              title: '我的投資心得',
              content_type: 'blog_article',
              status: 'approved',
              created_at: new Date('2024-01-10')
            }
          ];
          break;

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid user role'
          });
      }

      // Add notifications
      dashboardData.notifications = [
        {
          id: '1',
          type: 'payment_reward',
          title: '付款獎勵',
          message: '您已獲得500積分作為付款獎勵',
          created_at: new Date('2024-01-25')
        },
        {
          id: '2',
          type: 'event_reminder',
          title: '活動提醒',
          message: '投資策略研討會將於明天舉行',
          created_at: new Date('2024-01-24')
        }
      ];

      res.json({
        success: true,
        data: dashboardData
      });

    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
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

      res.json({
        success: true,
        data: {
          points: userData.points,
          role: userData.role,
          subscription_status: userData.subscription_status
        }
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