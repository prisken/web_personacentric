const express = require('express');
const router = express.Router();
const { Agent, User } = require('../models');

// GET /api/agents?in_matching_pool=true&status=active
router.get('/', async (req, res) => {
  try {
    const { in_matching_pool, status } = req.query;
    const where = {};
    if (typeof in_matching_pool !== 'undefined') {
      where.in_matching_pool = in_matching_pool === 'true';
    }
    if (status) {
      where.status = status;
    }
    const agents = await Agent.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'phone', 'language_preference'] }]
    });

    // Flatten user fields into agent object
    const agentsWithUser = agents.map(agent => {
      const agentData = agent.toJSON();
      if (agentData.user) {
        agentData.first_name = agentData.user.first_name;
        agentData.last_name = agentData.user.last_name;
        agentData.email = agentData.user.email;
        agentData.phone = agentData.user.phone;
        agentData.language_preference = agentData.user.language_preference;
        agentData.name = `${agentData.user.first_name} ${agentData.user.last_name}`;
      }
      delete agentData.user;
      return agentData;
    });

    res.json({ success: true, data: agentsWithUser });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch agents' });
  }
});

module.exports = router; 