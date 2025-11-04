const express = require('express');
const FoodForTalkUser = require('../models/FoodForTalkUser');
const sequelize = require('../config/database');
const { authenticateToken, requireAgentOrSuperAdmin: _requireAgentOrSuperAdmin } = require('../middleware/auth');
const { requireAgentOrAdmin } = require('../middleware/auth');

const router = express.Router();

// List participants assigned to current agent
router.get('/my-participants', authenticateToken, requireAgentOrAdmin, async (req, res) => {
  try {
    // Ensure column exists (prod-safe)
    try {
      const qi = sequelize.getQueryInterface();
      const columns = await qi.describeTable('food_for_talk_users');
      if (!columns.assigned_agent_id) {
        await qi.addColumn('food_for_talk_users', 'assigned_agent_id', {
          type: require('sequelize').UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' }
        });
        try { await qi.addIndex('food_for_talk_users', ['assigned_agent_id'], { name: 'idx_fft_assigned_agent_id' }); } catch (_) {}
      }
    } catch (e) {
      console.warn('agent list ensure column failed (continuing):', e?.message);
    }

    const agentUserId = req.user.id;
    const participants = await FoodForTalkUser.findAll({
      where: { assigned_agent_id: agentUserId },
      attributes: [
        'id', 'email', 'first_name', 'last_name', 'nickname', 'gender', 'age',
        'phone', 'whatsapp_phone', 'occupation', 'bio', 'interests',
        'dietary_restrictions', 'profile_photo_url', 'secret_passkey', 'is_verified', 'is_active',
        'created_at'
      ],
      order: [['created_at', 'DESC']]
    });

    // Expand JSON array fields for safety
    const result = participants.map(p => ({
      id: p.id,
      email: p.email,
      firstName: p.first_name,
      lastName: p.last_name,
      nickname: p.nickname,
      gender: p.gender,
      age: p.age,
      phone: p.phone,
      whatsappPhone: p.whatsapp_phone,
      occupation: p.occupation,
      bio: p.bio,
      interests: (() => { try { return Array.isArray(p.interests) ? p.interests : JSON.parse(p.interests || '[]'); } catch { return []; } })(),
      dietaryRestrictions: p.dietary_restrictions,
      profilePhotoUrl: p.profile_photo_url,
      secretPasskey: p.secret_passkey || null,
      isVerified: p.is_verified,
      isActive: p.is_active,
      assignedAgentId: agentUserId
    }));

    return res.json({ success: true, participants: result });
  } catch (error) {
    console.error('List my FFT participants error:', error);
    return res.status(500).json({ success: false, error: 'Failed to load participants' });
  }
});

// Agent updates an assigned participant's profile
router.put('/participants/:id', authenticateToken, requireAgentOrAdmin, async (req, res) => {
  try {
    const agentUserId = req.user.id;
    const { id } = req.params;
    const participant = await FoodForTalkUser.findByPk(id);
    if (!participant) return res.status(404).json({ message: 'Participant not found' });
    if (participant.assigned_agent_id !== agentUserId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to manage this participant' });
    }

    const updateData = req.body || {};
    const allowedFields = [
      'first_name', 'last_name', 'nickname', 'gender', 'age', 'phone', 'whatsapp_phone',
      'occupation', 'bio', 'interests', 'dietary_restrictions', 'consent_accepted',
      'expect_person_type', 'dream_first_date', 'dream_first_date_other',
      'attractive_traits', 'attractive_traits_other', 'japanese_food_preference',
      'quickfire_magic_item_choice', 'quickfire_desired_outcome'
    ];

    const camelToSnake = {
      firstName: 'first_name', lastName: 'last_name', whatsappPhone: 'whatsapp_phone',
      interestsOther: 'interests_other', dietaryRestrictions: 'dietary_restrictions',
      expectPersonType: 'expect_person_type', dreamFirstDate: 'dream_first_date',
      dreamFirstDateOther: 'dream_first_date_other', attractiveTraits: 'attractive_traits',
      attractiveTraitsOther: 'attractive_traits_other', japaneseFoodPreference: 'japanese_food_preference',
      quickfireMagicItemChoice: 'quickfire_magic_item_choice', quickfireDesiredOutcome: 'quickfire_desired_outcome',
      consentAccepted: 'consent_accepted'
    };

    const filtered = {};
    Object.entries(updateData).forEach(([k, v]) => {
      const key = camelToSnake[k] || k;
      if (!allowedFields.includes(key)) return;
      if (key === 'consent_accepted') filtered[key] = v === true || v === 'true';
      else if (key === 'age') {
        const ageNum = typeof v === 'string' ? parseInt(v, 10) : v;
        if (!Number.isNaN(ageNum)) filtered[key] = ageNum;
      } else if (key === 'interests' || key === 'attractive_traits') {
        if (Array.isArray(v)) filtered[key] = v;
      } else {
        filtered[key] = v;
      }
    });

    await participant.update(filtered);

    return res.json({ success: true, message: 'Participant updated' });
  } catch (error) {
    console.error('Agent update participant error:', error);
    return res.status(500).json({ message: 'Failed to update participant' });
  }
});

// Agent views details of an assigned participant
router.get('/participants/:id', authenticateToken, requireAgentOrAdmin, async (req, res) => {
  try {
    const agentUserId = req.user.id;
    const { id } = req.params;
    const participant = await FoodForTalkUser.findByPk(id);
    if (!participant) return res.status(404).json({ message: 'Participant not found' });
    if (participant.assigned_agent_id !== agentUserId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this participant' });
    }

    // Build a formatted participant similar to admin view but scoped
    const formatted = {
      id: participant.id,
      email: participant.email,
      firstName: participant.first_name,
      lastName: participant.last_name,
      nickname: participant.nickname,
      gender: participant.gender,
      age: participant.age,
      phone: participant.phone,
      whatsappPhone: participant.whatsapp_phone,
      occupation: participant.occupation,
      bio: participant.bio,
      interests: (() => { try { return Array.isArray(participant.interests) ? participant.interests : JSON.parse(participant.interests || '[]'); } catch { return []; } })(),
      interestsOther: participant.interests_other,
      dietaryRestrictions: participant.dietary_restrictions,
      profilePhotoUrl: participant.profile_photo_url,
      isVerified: participant.is_verified,
      isActive: participant.is_active,
      registrationDate: participant.registration_date,
      lastLogin: participant.last_login,
      expectPersonType: participant.expect_person_type,
      dreamFirstDate: participant.dream_first_date,
      dreamFirstDateOther: participant.dream_first_date_other,
      attractiveTraits: (() => { try { return Array.isArray(participant.attractive_traits) ? participant.attractive_traits : JSON.parse(participant.attractive_traits || '[]'); } catch { return []; } })(),
      attractiveTraitsOther: participant.attractive_traits_other,
      japaneseFoodPreference: participant.japanese_food_preference,
      quickfireMagicItemChoice: participant.quickfire_magic_item_choice,
      quickfireDesiredOutcome: participant.quickfire_desired_outcome,
      consentAccepted: participant.consent_accepted
    };

    return res.json({ success: true, participant: formatted });
  } catch (error) {
    console.error('Agent get participant details error:', error);
    return res.status(500).json({ message: 'Failed to get participant details' });
  }
});

module.exports = router;


