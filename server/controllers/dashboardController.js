const { User, Event, EventRegistration, Agent, ClientRelationship } = require('../models');
const { Op } = require('sequelize');

class DashboardController {
  // Get dashboard data based on user role
  async getDashboard(req, res) {
    try {
      console.log('Dashboard request received:', { user: req.user });
      const { user } = req;
      const userId = user.id;
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
            
            // Get event statistics
            const totalEvents = await Event.count();
            const upcomingEvents = await Event.count({
              where: {
                start_date: { [Op.gte]: new Date() },
                status: 'published'
              }
            });
            
            // Get registration statistics
            const totalRegistrations = await EventRegistration.count();
            const clientRegistrationsCount = await EventRegistration.count({
              include: [{
                model: User,
                as: 'user',
                where: { role: 'client' }
              }]
            });
            const agentRegistrationsCount = await EventRegistration.count({
              include: [{
                model: User,
                as: 'user',
                where: { role: 'agent' }
              }]
            });
            
            dashboardData.statistics = {
              total_users: totalUsers,
              total_agents: totalAgents,
              total_clients: totalClients,
              total_events: totalEvents,
              upcoming_events: upcomingEvents,
              total_registrations: totalRegistrations,
              total_clients_registered: clientRegistrationsCount,
              total_agents_registered: agentRegistrationsCount,
              monthly_revenue: 2000,
              pending_upgrades: 1,
              pending_contests: 0
            };

            // Get all events with registration data
            const allEvents = await Event.findAll({
              include: [
                {
                  model: User,
                  as: 'creator',
                  attributes: ['id', 'first_name', 'last_name', 'email']
                },
                {
                  model: EventRegistration,
                  as: 'registrations',
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: ['id', 'first_name', 'last_name', 'email', 'role']
                    }
                  ]
                }
              ],
              order: [['start_date', 'ASC']]
            });

            dashboardData.all_events = allEvents.map(event => {
              const eventData = event.toJSON();
              const registrations = eventData.registrations || [];
              return {
                ...eventData,
                registrations: {
                  total: registrations.length,
                  clients: registrations.filter(r => r.user.role === 'client').length,
                  agents: registrations.filter(r => r.user.role === 'agent').length,
                  pending: registrations.filter(r => r.status === 'registered').length,
                  confirmed: registrations.filter(r => r.status === 'attended').length
                }
              };
            });

            // Get all event registrations for admin view
            const allRegistrations = await EventRegistration.findAll({
              include: [
                {
                  model: Event,
                  as: 'event',
                  attributes: ['id', 'title', 'start_date', 'location']
                },
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'first_name', 'last_name', 'email', 'role']
                }
              ],
              order: [['created_at', 'DESC']]
            });

            dashboardData.event_registrations = allRegistrations;
            break;

          case 'agent':
            console.log('Processing agent dashboard...');
            // Get agent-specific statistics
            const clientRelationships = await ClientRelationship.findAll({
              where: { agent_id: userId },
              include: [
                {
                  model: User,
                  as: 'client',
                  attributes: ['id', 'first_name', 'last_name', 'email']
                }
              ]
            });

            const totalCommission = clientRelationships.reduce((sum, rel) => sum + parseFloat(rel.total_commission || 0), 0);
            const activeClients = clientRelationships.filter(rel => rel.status === 'active').length;

            // Get agent's event registrations
            const agentRegistrations = await EventRegistration.findAll({
              where: { user_id: userId },
              include: [
                {
                  model: Event,
                  as: 'event',
                  attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'location', 'event_type', 'image']
                }
              ],
              order: [['created_at', 'DESC']]
            });

            // Get events where agent's clients are registered
            const clientIds = clientRelationships.map(rel => rel.client_id);
            const clientRegistrations = await EventRegistration.findAll({
              where: { 
                user_id: { [Op.in]: clientIds }
              },
              include: [
                {
                  model: Event,
                  as: 'event',
                  attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'location', 'event_type', 'image']
                },
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'first_name', 'last_name', 'email']
                }
              ],
              order: [['created_at', 'DESC']]
            });

            // Get available events for registration
            const availableEvents = await Event.findAll({
              where: {
                status: 'published',
                start_date: { [Op.gte]: new Date() }
              },
              include: [
                {
                  model: User,
                  as: 'creator',
                  attributes: ['id', 'first_name', 'last_name']
                }
              ],
              order: [['start_date', 'ASC']]
            });

            // Mark events where agent is already registered
            const availableEventsWithRegistration = availableEvents.map(event => {
              const eventData = event.toJSON();
              const isRegistered = agentRegistrations.some(reg => reg.event_id === event.id);
              return {
                ...eventData,
                is_registered: isRegistered,
                can_register: !isRegistered
              };
            });

            dashboardData.statistics = {
              total_commission: totalCommission,
              active_clients: activeClients,
              hosted_events: 0,
              upcoming_events: availableEventsWithRegistration.length,
              total_registrations: agentRegistrations.length,
              total_clients_registered: clientRegistrations.length
            };

            // Add event data
            dashboardData.available_events = availableEventsWithRegistration;
            dashboardData.my_registrations = agentRegistrations;
            dashboardData.my_clients_registrations = clientRegistrations;
            dashboardData.client_relationships = clientRelationships;
            break;

          case 'client':
            console.log('Processing client dashboard...');
            // Get client's event registrations
            const clientEventRegistrations = await EventRegistration.findAll({
              where: { user_id: userId },
              include: [
                {
                  model: Event,
                  as: 'event',
                  attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'location', 'event_type', 'image', 'points_reward']
                }
              ],
              order: [['created_at', 'DESC']]
            });

            // Get available events for registration
            const clientAvailableEvents = await Event.findAll({
              where: {
                status: 'published',
                start_date: { [Op.gte]: new Date() }
              },
              include: [
                {
                  model: User,
                  as: 'creator',
                  attributes: ['id', 'first_name', 'last_name']
                }
              ],
              order: [['start_date', 'ASC']]
            });

            // Mark events where client is already registered
            const clientAvailableEventsWithRegistration = clientAvailableEvents.map(event => {
              const eventData = event.toJSON();
              const registration = clientEventRegistrations.find(reg => reg.event_id === event.id);
              return {
                ...eventData,
                is_registered: !!registration,
                registration_status: registration ? registration.status : null,
                can_register: !registration
              };
            });

            // Calculate statistics
            const attendedEvents = clientEventRegistrations.filter(reg => reg.status === 'attended').length;
            const registeredEvents = clientEventRegistrations.filter(reg => reg.status === 'registered').length;
            const upcomingEventsCount = clientEventRegistrations.filter(reg => 
              reg.status === 'registered' && new Date(reg.event.start_date) > new Date()
            ).length;

            dashboardData.statistics = {
              total_events_attended: attendedEvents,
              total_events_registered: registeredEvents,
              upcoming_events: upcomingEventsCount,
              total_points_earned: 800,
              points_balance: 800,
              contests_participated: 1
            };

            // Add event data
            dashboardData.available_events = clientAvailableEventsWithRegistration;
            dashboardData.registered_events = clientEventRegistrations;
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
      const userId = user.id;

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