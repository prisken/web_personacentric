const { User, Event, EventRegistration, Agent } = require('../models');

class DashboardController {
  // Get dashboard data based on user role
  async getDashboard(req, res) {
    try {
      const { user } = req;
      const userId = user.userId;
      const userRole = user.role;

      // Get user data
      const userData = await User.findByPk(userId, { include: [{ model: Agent, as: 'agent' }] });
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
          // Get real user statistics
          const totalUsers = await User.count();
          const totalAgents = await User.count({ where: { role: 'agent' } });
          const totalClients = await User.count({ where: { role: 'client' } });
          
          // Get recent users (last 10)
          const recentUsers = await User.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at'],
            order: [['created_at', 'DESC']],
            limit: 10
          });

          // Get event statistics
          const totalEvents = await Event.count();
          const upcomingEvents = await Event.count({
            where: {
              start_date: { [require('sequelize').Op.gt]: new Date() },
              status: 'published'
            }
          });
          const totalRegistrations = await EventRegistration.count({
            where: { status: 'registered' }
          });

          dashboardData.statistics = {
            total_users: totalUsers,
            total_agents: totalAgents,
            total_clients: totalClients,
            total_events: totalEvents,
            upcoming_events: upcomingEvents,
            total_registrations: totalRegistrations,
            monthly_revenue: 2000, // This would need to be calculated from actual payments
            pending_upgrades: 1,
            pending_contests: 0
          };
          dashboardData.recent_users = recentUsers;
          dashboardData.recent_events = await Event.findAll({
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['first_name', 'last_name']
              }
            ],
            order: [['created_at', 'DESC']],
            limit: 5
          });
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
          // Get agent-specific statistics
          const agentEvents = await Event.count({
            where: { agent_id: userData.agent?.id }
          });
          const agentUpcomingEvents = await Event.count({
            where: {
              agent_id: userData.agent?.id,
              start_date: { [require('sequelize').Op.gt]: new Date() },
              status: 'published'
            }
          });
          const agentTotalRegistrations = await EventRegistration.count({
            include: [
              {
                model: Event,
                as: 'event',
                where: { agent_id: userData.agent?.id }
              }
            ],
            where: { status: 'registered' }
          });

          dashboardData.statistics = {
            total_commission: 1500.00,
            active_clients: 3,
            hosted_events: agentEvents,
            upcoming_events: agentUpcomingEvents,
            total_registrations: agentTotalRegistrations,
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
          dashboardData.recent_events = await Event.findAll({
            where: { agent_id: userData.agent?.id },
            include: [
              {
                model: EventRegistration,
                as: 'registrations',
                include: [
                  {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name', 'email']
                  }
                ]
              }
            ],
            order: [['start_date', 'ASC']],
            limit: 5
          });
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
          // Get client-specific statistics
          const clientRegistrations = await EventRegistration.count({
            where: { user_id: userId, status: 'registered' }
          });
          const clientAttendedEvents = await EventRegistration.count({
            where: { user_id: userId, status: 'attended' }
          });

          dashboardData.statistics = {
            total_events_attended: clientAttendedEvents,
            total_events_registered: clientRegistrations,
            total_points_earned: 800,
            points_balance: 800,
            contests_participated: 1
          };
          dashboardData.registered_events = await EventRegistration.findAll({
            where: { user_id: userId, status: 'registered' },
            include: [
              {
                model: Event,
                as: 'event',
                attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'location']
              }
            ],
            order: [['created_at', 'DESC']],
            limit: 5
          });
          dashboardData.available_events = await Event.findAll({
            where: {
              start_date: { [require('sequelize').Op.gt]: new Date() },
              status: 'published'
            },
            order: [['start_date', 'ASC']],
            limit: 5
          });
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