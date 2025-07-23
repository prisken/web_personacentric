const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET /api/agents?in_matching_pool=true&status=active
router.get('/', async (req, res) => {
  try {
    // Fetch users with role='agent' since we temporarily removed Agent model
    const agents = await User.findAll({
      where: { role: 'agent' },
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'language_preference', 'points', 'created_at']
    });

    // Add placeholder data for agent profiles since we don't have Agent model data
    const agentsWithProfiles = agents.map(agent => {
      const agentData = agent.toJSON();
      
      // Add placeholder profile data based on the agent's name/email
      const agentProfiles = {
        'sarah.johnson@personacentric.com': {
          areas_of_expertise: ['Retirement', 'Tax'],
          certifications: 'CFP, CPA',
          experience_years: 15,
          languages: ['English', 'Mandarin'],
          preferred_client_types: ['Retirees', 'Families'],
          communication_modes: ['Video', 'Phone'],
          availability: 'Mon-Fri 9am-5pm',
          location: 'Hong Kong',
          bio: 'Expert in retirement and tax planning for families.',
          commission_rate: 0.10,
          status: 'active',
          in_matching_pool: true
        },
        'michael.chen@personacentric.com': {
          areas_of_expertise: ['Investment', 'Wealth Management'],
          certifications: 'CFA',
          experience_years: 12,
          languages: ['Mandarin', 'English'],
          preferred_client_types: ['Young Professionals', 'Entrepreneurs'],
          communication_modes: ['In-person', 'Video'],
          availability: 'Tue-Sat 10am-6pm',
          location: 'Taipei',
          bio: 'Specializes in growth-oriented investment strategies.',
          commission_rate: 0.12,
          status: 'active',
          in_matching_pool: true
        },
        'emily.rodriguez@personacentric.com': {
          areas_of_expertise: ['Tax', 'Estate Planning'],
          certifications: 'CPA',
          experience_years: 10,
          languages: ['English', 'Spanish'],
          preferred_client_types: ['Families', 'Business Owners'],
          communication_modes: ['Phone', 'Digital'],
          availability: 'Mon-Fri 8am-4pm',
          location: 'Macau',
          bio: 'Tax optimization and estate planning expert.',
          commission_rate: 0.11,
          status: 'active',
          in_matching_pool: true
        },
        'kenji.tanaka@personacentric.com': {
          areas_of_expertise: ['Insurance', 'Risk Management'],
          certifications: 'CLU',
          experience_years: 8,
          languages: ['Japanese', 'English'],
          preferred_client_types: ['Families', 'SMEs'],
          communication_modes: ['In-person', 'Phone'],
          availability: 'Wed-Sun 11am-7pm',
          location: 'Tokyo',
          bio: 'Insurance and risk management for families and businesses.',
          commission_rate: 0.13,
          status: 'active',
          in_matching_pool: true
        },
        'lucy.wong@personacentric.com': {
          areas_of_expertise: ['Retirement', 'Investment'],
          certifications: 'CFP',
          experience_years: 9,
          languages: ['Cantonese', 'Mandarin'],
          preferred_client_types: ['Retirees', 'Women'],
          communication_modes: ['Video', 'Digital'],
          availability: 'Mon-Fri 10am-6pm',
          location: 'Hong Kong',
          bio: 'Retirement and investment planning for women.',
          commission_rate: 0.10,
          status: 'active',
          in_matching_pool: true
        },
        'alexander.smith@personacentric.com': {
          areas_of_expertise: ['Wealth Management', 'Tax'],
          certifications: 'CFA, CPA',
          experience_years: 14,
          languages: ['English'],
          preferred_client_types: ['High Net Worth', 'Entrepreneurs'],
          communication_modes: ['In-person', 'Video'],
          availability: 'Mon-Thu 9am-5pm',
          location: 'Singapore',
          bio: 'Wealth management for high net worth individuals.',
          commission_rate: 0.09,
          status: 'active',
          in_matching_pool: true
        },
        'mei.lin@personacentric.com': {
          areas_of_expertise: ['Investment', 'Insurance'],
          certifications: 'CFP',
          experience_years: 7,
          languages: ['Mandarin', 'Cantonese'],
          preferred_client_types: ['Young Professionals', 'Families'],
          communication_modes: ['Digital', 'Phone'],
          availability: 'Mon-Sat 9am-7pm',
          location: 'Taipei',
          bio: 'Investment and insurance for young professionals.',
          commission_rate: 0.11,
          status: 'active',
          in_matching_pool: true
        }
      };

      // Default profile for Chinese agents
      const defaultProfile = {
        areas_of_expertise: ['Investment', 'Financial Planning'],
        certifications: 'CFP, CFA',
        experience_years: 8,
        languages: ['Mandarin', 'Cantonese', 'English'],
        preferred_client_types: ['Families', 'Young Professionals'],
        communication_modes: ['Video', 'Phone'],
        availability: 'Mon-Fri 9am-6pm',
        location: 'Hong Kong',
        bio: '專業投資顧問，提供全面的財務規劃服務。',
        commission_rate: 0.12,
        status: 'active',
        in_matching_pool: true
      };

      const profile = agentProfiles[agentData.email] || defaultProfile;
      
      return {
        ...agentData,
        ...profile,
        name: `${agentData.first_name} ${agentData.last_name}`
      };
    });

    res.json({ success: true, data: agentsWithProfiles });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch agents' });
  }
});

module.exports = router; 