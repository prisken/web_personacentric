const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * POST /api/analytics/track
 * Store analytics event
 */
router.post('/track', async (req, res) => {
  try {
    const {
      session_id,
      event_type,
      event_data,
      timestamp,
      page_url,
      page_path,
      referrer,
      user_agent,
      screen_resolution,
      viewport_size,
      timezone,
      language
    } = req.body;

    // Basic validation
    if (!session_id || !event_type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Insert into database
    const query = `
      INSERT INTO analytics_events (
        session_id,
        event_type,
        event_data,
        timestamp,
        page_url,
        page_path,
        referrer,
        user_agent,
        screen_resolution,
        viewport_size,
        timezone,
        language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      session_id,
      event_type,
      JSON.stringify(event_data),
      timestamp,
      page_url,
      page_path,
      referrer,
      user_agent,
      screen_resolution,
      viewport_size,
      timezone,
      language
    ]);

    res.json({
      success: true,
      message: 'Event tracked successfully'
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event'
    });
  }
});

/**
 * GET /api/analytics/summary
 * Get analytics summary (admin only)
 */
router.get('/summary', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Get event counts by type
    const eventCounts = await db.all(`
      SELECT 
        event_type,
        COUNT(*) as count
      FROM analytics_events
      WHERE timestamp >= ?
      GROUP BY event_type
      ORDER BY count DESC
    `, [since]);

    // Get unique sessions
    const uniqueSessions = await db.get(`
      SELECT COUNT(DISTINCT session_id) as count
      FROM analytics_events
      WHERE timestamp >= ?
    `, [since]);

    // Get page views
    const pageViews = await db.get(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'page_view'
      AND timestamp >= ?
    `, [since]);

    // Get button clicks
    const buttonClicks = await db.get(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'button_click'
      AND timestamp >= ?
    `, [since]);

    res.json({
      success: true,
      data: {
        period_days: days,
        unique_sessions: uniqueSessions.count,
        total_page_views: pageViews.count,
        total_button_clicks: buttonClicks.count,
        events_by_type: eventCounts
      }
    });

  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary'
    });
  }
});

/**
 * GET /api/analytics/dashboard
 * Get dashboard data for Food for Talk
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Total page views
    const pageViews = await db.get(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'page_view'
      AND page_path LIKE '%food-for-talk%'
      AND timestamp >= ?
    `, [since]);

    // Register button clicks
    const registerClicks = await db.get(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'button_click'
      AND json_extract(event_data, '$.button_name') = 'Register Now'
      AND timestamp >= ?
    `, [since]);

    // Unique visitors
    const uniqueVisitors = await db.get(`
      SELECT COUNT(DISTINCT session_id) as count
      FROM analytics_events
      WHERE page_path LIKE '%food-for-talk%'
      AND timestamp >= ?
    `, [since]);

    // Average time on page
    const avgTimeOnPage = await db.get(`
      SELECT AVG(CAST(json_extract(event_data, '$.time_seconds') AS INTEGER)) as avg_seconds
      FROM analytics_events
      WHERE event_type = 'time_on_page'
      AND timestamp >= ?
    `, [since]);

    // Scroll depth distribution
    const scrollDepth = await db.all(`
      SELECT 
        json_extract(event_data, '$.percentage') as percentage,
        COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'scroll_depth'
      AND timestamp >= ?
      GROUP BY percentage
      ORDER BY percentage
    `, [since]);

    // Button click breakdown
    const buttonBreakdown = await db.all(`
      SELECT 
        json_extract(event_data, '$.button_name') as button_name,
        json_extract(event_data, '$.location') as location,
        COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'button_click'
      AND timestamp >= ?
      GROUP BY button_name, location
      ORDER BY count DESC
    `, [since]);

    // Language usage
    const languageUsage = await db.all(`
      SELECT 
        language,
        COUNT(*) as count
      FROM analytics_events
      WHERE timestamp >= ?
      GROUP BY language
      ORDER BY count DESC
    `, [since]);

    // Device breakdown
    const deviceBreakdown = await db.all(`
      SELECT 
        CASE 
          WHEN json_extract(event_data, '$.viewport_size') LIKE '%mobile%' OR 
               CAST(json_extract(event_data, '$.viewport_size') AS TEXT) LIKE '%x%' AND 
               CAST(SUBSTR(json_extract(event_data, '$.viewport_size'), 1, INSTR(json_extract(event_data, '$.viewport_size'), 'x') - 1) AS INTEGER) < 768
          THEN 'mobile'
          WHEN CAST(json_extract(event_data, '$.viewport_size') AS TEXT) LIKE '%x%' AND 
               CAST(SUBSTR(json_extract(event_data, '$.viewport_size'), 1, INSTR(json_extract(event_data, '$.viewport_size'), 'x') - 1) AS INTEGER) < 1024
          THEN 'tablet'
          ELSE 'desktop'
        END as device_type,
        COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'page_view'
      AND timestamp >= ?
      GROUP BY device_type
      ORDER BY count DESC
    `, [since]);

    // Click-through rate
    const ctr = registerClicks.count > 0 && pageViews.count > 0
      ? ((registerClicks.count / pageViews.count) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        period_days: days,
        total_page_views: pageViews.count || 0,
        unique_visitors: uniqueVisitors.count || 0,
        register_button_clicks: registerClicks.count || 0,
        click_through_rate: ctr + '%',
        avg_time_on_page_seconds: Math.round(avgTimeOnPage.avg_seconds || 0),
        scroll_depth_distribution: scrollDepth,
        button_click_breakdown: buttonBreakdown,
        language_usage: languageUsage,
        device_breakdown: deviceBreakdown
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

/**
 * GET /api/analytics/conversion-funnel
 * Get conversion funnel data
 */
router.get('/conversion-funnel', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Step 1: Page views
    const pageViews = await db.get(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'page_view'
      AND page_path LIKE '%food-for-talk%'
      AND timestamp >= ?
    `, [since]);

    // Step 2: Register button clicks
    const registerClicks = await db.get(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'button_click'
      AND json_extract(event_data, '$.button_name') = 'Register Now'
      AND timestamp >= ?
    `, [since]);

    // Step 3: Registration form starts (you'll need to add this tracking later)
    const formStarts = await db.get(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'form_event'
      AND json_extract(event_data, '$.form_name') = 'registration'
      AND json_extract(event_data, '$.event_type') = 'start'
      AND timestamp >= ?
    `, [since]);

    // Step 4: Registration completions (you'll need to add this tracking later)
    const formCompletions = await db.get(`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'conversion'
      AND json_extract(event_data, '$.event_name') = 'registration_complete'
      AND timestamp >= ?
    `, [since]);

    const funnel = [
      {
        step: 'Page Views',
        count: pageViews.count || 0,
        percentage: 100
      },
      {
        step: 'Register Button Clicks',
        count: registerClicks.count || 0,
        percentage: pageViews.count > 0 ? ((registerClicks.count / pageViews.count) * 100).toFixed(1) : 0
      },
      {
        step: 'Form Starts',
        count: formStarts.count || 0,
        percentage: registerClicks.count > 0 ? ((formStarts.count / registerClicks.count) * 100).toFixed(1) : 0
      },
      {
        step: 'Form Completions',
        count: formCompletions.count || 0,
        percentage: formStarts.count > 0 ? ((formCompletions.count / formStarts.count) * 100).toFixed(1) : 0
      }
    ];

    res.json({
      success: true,
      data: {
        period_days: days,
        funnel: funnel,
        overall_conversion_rate: pageViews.count > 0 ? ((formCompletions.count / pageViews.count) * 100).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('Conversion funnel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversion funnel data'
    });
  }
});

module.exports = router;
