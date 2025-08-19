const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET /api/agents?in_matching_pool=true&status=active
router.get('/', async (req, res) => {
  try {
    // Fetch users with role='agent' since we temporarily removed Agent model
    const agents = await User.findAll({
      where: { role: 'agent' },
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'language_preference', 'created_at']
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

// POST /api/agents/match - Agent-client matching based on quiz answers
router.post('/match', async (req, res) => {
  try {
    const { 
      primary_goal, 
      investment_timeline, 
      risk_tolerance, 
      financial_situation, 
      communication_pref, 
      language_preference,
      location 
    } = req.body;

    // Fetch all agents in the matching pool
    const agents = await User.findAll({
      where: { role: 'agent' },
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'language_preference', 'created_at']
    });

    // Add placeholder profiles (same as above)
    const agentsWithProfiles = agents.map(agent => {
      const agentData = agent.toJSON();
      
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

    // Matching algorithm with weighted scoring
    const weights = {
      primary_goal: 0.30,        // 30% - Most important
      communication_pref: 0.20,  // 20% - Communication compatibility
      language_preference: 0.20, // 20% - Language compatibility
      location: 0.15,            // 15% - Geographic proximity
      risk_tolerance: 0.10,      // 10% - Risk profile match
      financial_situation: 0.05  // 5% - Experience level match
    };

    const scoredAgents = agentsWithProfiles.map(agent => {
      let totalScore = 0;
      let matchDetails = {};

      // 1. Primary Goal Match (30%)
      if (agent.areas_of_expertise && agent.areas_of_expertise.length > 0) {
        const goalMatch = agent.areas_of_expertise.some(expertise => 
          expertise.toLowerCase().includes(primary_goal.toLowerCase()) ||
          primary_goal.toLowerCase().includes(expertise.toLowerCase())
        );
        if (goalMatch) {
          totalScore += weights.primary_goal;
          matchDetails.primary_goal = 'Perfect match';
        } else {
          // Partial match for related areas
          const relatedGoals = {
            'retirement': ['investment', 'financial planning'],
            'investment': ['wealth management', 'financial planning'],
            'tax': ['estate planning', 'financial planning'],
            'debt': ['financial planning', 'investment']
          };
          const related = relatedGoals[primary_goal] || [];
          const partialMatch = agent.areas_of_expertise.some(expertise =>
            related.some(rel => expertise.toLowerCase().includes(rel))
          );
          if (partialMatch) {
            totalScore += weights.primary_goal * 0.5;
            matchDetails.primary_goal = 'Good match';
          }
        }
      }

      // 2. Communication Preference Match (20%)
      if (agent.communication_modes && agent.communication_modes.length > 0) {
        const commMatch = agent.communication_modes.some(mode =>
          mode.toLowerCase().includes(communication_pref.toLowerCase())
        );
        if (commMatch) {
          totalScore += weights.communication_pref;
          matchDetails.communication_pref = 'Perfect match';
        }
      }

      // 3. Language Preference Match (20%)
      if (agent.languages && agent.languages.length > 0) {
        const languageMap = {
          'en': ['english'],
          'zh-TW': ['mandarin', 'cantonese', 'chinese'],
          'zh-CN': ['mandarin', 'chinese'],
          'ja': ['japanese'],
          'es': ['spanish']
        };
        const clientLanguages = languageMap[language_preference] || [language_preference];
        const langMatch = agent.languages.some(agentLang =>
          clientLanguages.some(clientLang => 
            agentLang.toLowerCase().includes(clientLang.toLowerCase())
          )
        );
        if (langMatch) {
          totalScore += weights.language_preference;
          matchDetails.language_preference = 'Perfect match';
        }
      }

      // 4. Location Match (15%)
      if (location && agent.location) {
        const locationMatch = agent.location.toLowerCase().includes(location.toLowerCase()) ||
                             location.toLowerCase().includes(agent.location.toLowerCase());
        if (locationMatch) {
          totalScore += weights.location;
          matchDetails.location = 'Same location';
        } else {
          // Partial score for same region
          const regions = {
            'hong kong': ['hong kong', 'hk'],
            'taipei': ['taipei', 'taiwan'],
            'singapore': ['singapore', 'sg'],
            'tokyo': ['tokyo', 'japan'],
            'macau': ['macau', 'mo']
          };
          const agentRegion = regions[agent.location.toLowerCase()] || [agent.location.toLowerCase()];
          const clientRegion = regions[location.toLowerCase()] || [location.toLowerCase()];
          const regionMatch = agentRegion.some(agentReg =>
            clientRegion.some(clientReg => agentReg.includes(clientReg) || clientReg.includes(agentReg))
          );
          if (regionMatch) {
            totalScore += weights.location * 0.5;
            matchDetails.location = 'Same region';
          }
        }
      }

      // 5. Risk Tolerance Match (10%)
      const riskMap = {
        'conservative': ['retirees', 'families'],
        'moderate': ['young professionals', 'families'],
        'aggressive': ['entrepreneurs', 'young professionals'],
        'unsure': ['families', 'young professionals']
      };
      const clientRiskProfile = riskMap[risk_tolerance] || [];
      const riskMatch = agent.preferred_client_types && agent.preferred_client_types.some(type =>
        clientRiskProfile.some(profile => type.toLowerCase().includes(profile.toLowerCase()))
      );
      if (riskMatch) {
        totalScore += weights.risk_tolerance;
        matchDetails.risk_tolerance = 'Good match';
      }

      // 6. Financial Situation Match (5%)
      const situationMap = {
        'beginner': ['young professionals', 'families'],
        'established': ['families', 'young professionals'],
        'advanced': ['entrepreneurs', 'high net worth'],
        'complex': ['high net worth', 'entrepreneurs']
      };
      const clientSituation = situationMap[financial_situation] || [];
      const situationMatch = agent.preferred_client_types && agent.preferred_client_types.some(type =>
        clientSituation.some(sit => type.toLowerCase().includes(sit.toLowerCase()))
      );
      if (situationMatch) {
        totalScore += weights.financial_situation;
        matchDetails.financial_situation = 'Good match';
      }

      return {
        ...agent,
        matchScore: Math.round(totalScore * 100),
        matchDetails
      };
    });

    // Sort by match score (highest first) and return top 6 matches
    const topMatches = scoredAgents
      .filter(agent => agent.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    res.json({
      success: true,
      data: topMatches,
      quiz_answers: {
        primary_goal,
        investment_timeline,
        risk_tolerance,
        financial_situation,
        communication_pref,
        language_preference,
        location
      }
    });

  } catch (error) {
    console.error('Error in agent matching:', error);
    res.status(500).json({ success: false, message: 'Failed to match agents' });
  }
});

module.exports = router; 