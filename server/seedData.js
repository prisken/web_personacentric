const { User, Event, Agent } = require('./models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seedData() {
  try {
    console.log('Starting simplified data seeding...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@personacentric.com' } });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
    } else {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@personacentric.com',
        password_hash: adminPassword,
        first_name: 'Admin',
        last_name: 'User',
        phone: '+852-1234-5678',
        role: 'admin',
        language_preference: 'zh-TW',
        points: 0,
        subscription_status: 'active',
        is_verified: true
      });
      console.log('Admin user created successfully');
    }

    // Create agent users
    const agentEmails = [
      'agent1@personacentric.com',
      'agent2@personacentric.com',
      'sarah.johnson@personacentric.com',
      'michael.chen@personacentric.com',
      'emily.rodriguez@personacentric.com',
      'kenji.tanaka@personacentric.com',
      'lucy.wong@personacentric.com',
      'alexander.smith@personacentric.com',
      'mei.lin@personacentric.com'
    ];

    const agentData = [
      { first_name: '張', last_name: '顧問', phone: '+852-2345-6789', points: 1500 },
      { first_name: '李', last_name: '顧問', phone: '+852-3456-7890', points: 2200 },
      { first_name: 'Sarah', last_name: 'Johnson', phone: '+852-1111-2222', points: 1800 },
      { first_name: 'Michael', last_name: 'Chen', phone: '+852-2222-3333', points: 2000 },
      { first_name: 'Emily', last_name: 'Rodriguez', phone: '+852-3333-4444', points: 1600 },
      { first_name: 'Kenji', last_name: 'Tanaka', phone: '+852-4444-5555', points: 1700 },
      { first_name: 'Lucy', last_name: 'Wong', phone: '+852-5555-6666', points: 1900 },
      { first_name: 'Alexander', last_name: 'Smith', phone: '+852-6666-7777', points: 2500 },
      { first_name: 'Mei', last_name: 'Lin', phone: '+852-7777-8888', points: 1400 }
    ];

    for (let i = 0; i < agentEmails.length; i++) {
      const existingAgent = await User.findOne({ where: { email: agentEmails[i] } });
      if (!existingAgent) {
        const agentPassword = await bcrypt.hash('agent123', 10);
        await User.create({
          email: agentEmails[i],
          password_hash: agentPassword,
          first_name: agentData[i].first_name,
          last_name: agentData[i].last_name,
          phone: agentData[i].phone,
          role: 'agent',
          language_preference: i < 2 ? 'zh-TW' : 'en',
          points: agentData[i].points,
          subscription_status: 'active',
          is_verified: true
        });
        console.log(`Agent ${agentData[i].first_name} ${agentData[i].last_name} created successfully`);
      } else {
        console.log(`Agent ${agentData[i].first_name} ${agentData[i].last_name} already exists, skipping...`);
      }
    }

    // Find admin user and ensure we have their ID
    const adminUser = await User.findOne({ 
      where: { email: 'admin@personacentric.com' }
    });

    if (!adminUser) {
      throw new Error('Admin user not found. Please ensure admin user exists before creating events.');
    }

    console.log('Found admin user with ID:', adminUser.id);

    // Find agent user and create agent record if needed
    const agentUser = await User.findOne({
      where: { email: 'agent1@personacentric.com' }
    });

    if (!agentUser) {
      throw new Error('Agent user not found. Please ensure agent user exists before creating events.');
    }

    // Find or create agent record
    let agent = await Agent.findOne({
      where: { user_id: agentUser.id }
    });

    if (!agent) {
      const agentId = uuidv4();
      agent = await Agent.create({
        id: agentId,
        user_id: agentUser.id,
        specialization: '投資理財',
        experience_years: 5,
        certifications: 'CFP, CFA',
        bio: '專業投資顧問，擅長退休規劃和資產配置',
        commission_rate: 0.1,
        is_verified: true,
        rating: 4.5,
        total_reviews: 10,
        areas_of_expertise: JSON.stringify(['退休規劃', '投資組合管理', '風險管理']),
        languages: JSON.stringify(['zh-TW', 'en']),
        preferred_client_types: JSON.stringify(['個人投資者', '小型企業']),
        communication_modes: JSON.stringify(['面對面', '視訊會議']),
        availability: '{"weekdays": ["09:00-18:00"], "weekends": ["10:00-15:00"]}',
        location: '香港中環',
        status: 'approved',
        in_matching_pool: true
      });
      console.log('Created new agent record with ID:', agentId);
    }

    // Refresh agent record to ensure we have the latest data
    agent = await Agent.findOne({
      where: { user_id: agentUser.id }
    });

    if (!agent) {
      throw new Error('Failed to find agent record after creation.');
    }

    console.log('Found agent with ID:', agent.id);

    // Create events
    const eventTypes = ['workshop', 'seminar', 'consultation'];
    const locations = ['香港中環國際金融中心', '香港九龍灣國際展貿中心', '線上會議'];
    const eventTitles = [
      '2024投資展望研討會：全球市場分析',
      '退休理財規劃工作坊',
      '數位資產投資策略線上講座'
    ];
    const eventDescriptions = [
      '深入探討2024年全球金融市場趨勢，包括股票、債券、加密貨幣等投資機會。由資深投資顧問分享專業見解，協助投資者做出明智決策。',
      '專為45-60歲人士設計的退休理財工作坊，內容包括退休金規劃、投資組合配置、風險管理等實用主題。',
      '探討比特幣、NFT等數位資產的投資機會與風險，協助投資者了解這個快速發展的新興市場。'
    ];

    // Check if events already exist
    for (let i = 0; i < 3; i++) {
      const existingEvent = await Event.findOne({ where: { title: eventTitles[i] } });
      if (existingEvent) {
        console.log(`Event "${eventTitles[i]}" already exists, skipping...`);
        continue;
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7 + (i * 7)); // Events start in future weeks
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 3); // Each event lasts 3 hours

      const eventId = uuidv4();
      try {
        const createdEvent = await Event.create({
          id: eventId,
          title: eventTitles[i],
          description: eventDescriptions[i],
          event_type: eventTypes[i],
          start_date: startDate,
          end_date: endDate,
          location: locations[i],
          max_participants: 50,
          current_participants: Math.floor(Math.random() * 20),
          price: 888.00,
          points_reward: 100,
          agent_id: agent.id,
          created_by: adminUser.id,
          status: 'published',
          image: 'https://res.cloudinary.com/personacentric/image/upload/v1/events/default-event-image.jpg'
        });
        console.log(`Event "${eventTitles[i]}" created successfully with ID: ${createdEvent.id}`);
      } catch (error) {
        console.error(`Failed to create event "${eventTitles[i]}":`, error);
      }
    }

    console.log('Simplified user and event seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

module.exports = seedData;