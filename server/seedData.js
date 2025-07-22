const { User, Agent, Event, BlogPost, Contest, PointTransaction, PaymentTransaction, 
        Subscription, Notification, EventRegistration, AgentClientRelationship, 
        ContestSubmission, ClientUpgrade } = require('./models');
// const { User, Agent, Event, BlogPost, Contest, PointTransaction, PaymentTransaction, 
//         Subscription, Notification, EventRegistration, AgentClientRelationship, 
//         ContestSubmission, ClientUpgrade, Badge, Recommendation } = require('./models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
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

    // Create agent users
    const agent1Password = await bcrypt.hash('agent123', 10);
    const agent1 = await User.create({
      email: 'agent1@personacentric.com',
      password_hash: agent1Password,
      first_name: '張',
      last_name: '顧問',
      phone: '+852-2345-6789',
      role: 'agent',
      language_preference: 'zh-TW',
      points: 1500,
      subscription_status: 'active',
      is_verified: true
    });

    const agent2Password = await bcrypt.hash('agent123', 10);
    const agent2 = await User.create({
      email: 'agent2@personacentric.com',
      password_hash: agent2Password,
      first_name: '李',
      last_name: '顧問',
      phone: '+852-3456-7890',
      role: 'agent',
      language_preference: 'zh-TW',
      points: 2200,
      subscription_status: 'active',
      is_verified: true
    });

    // Create client users
    const client1Password = await bcrypt.hash('client123', 10);
    const client1 = await User.create({
      email: 'client1@personacentric.com',
      password_hash: client1Password,
      first_name: '王',
      last_name: '客戶',
      phone: '+852-4567-8901',
      role: 'client',
      language_preference: 'zh-TW',
      points: 800,
      subscription_status: 'active',
      is_verified: true
    });

    const client2Password = await bcrypt.hash('client123', 10);
    const client2 = await User.create({
      email: 'client2@personacentric.com',
      password_hash: client2Password,
      first_name: '陳',
      last_name: '客戶',
      phone: '+852-5678-9012',
      role: 'client',
      language_preference: 'zh-TW',
      points: 1200,
      subscription_status: 'active',
      is_verified: true
    });

    // Create agent profiles
    const agent1Profile = await Agent.create({
      user_id: agent1.id,
      specialization: '投資規劃',
      experience_years: 5,
      certifications: 'CFP, CFA',
      bio: '專注於個人投資規劃和退休規劃',
      commission_rate: 0.15,
      is_verified: true
    });

    const agent2Profile = await Agent.create({
      user_id: agent2.id,
      specialization: '保險規劃',
      experience_years: 8,
      certifications: 'CFP, CLU',
      bio: '專業保險顧問，提供全面的保險解決方案',
      commission_rate: 0.12,
      is_verified: true
    });

    // Create sample events
    const event1 = await Event.create({
      title: '財務規劃基礎工作坊',
      description: '學習財務規劃的基礎知識，為您的財務未來建立穩固的基礎。適合初學者參加。',
      event_type: 'workshop',
      start_date: new Date('2024-03-15T14:00:00'),
      end_date: new Date('2024-03-15T16:00:00'),
      location: '線上活動',
      max_participants: 50,
      price: 0,
      points_reward: 100,
      agent_id: agent1Profile.id,
      created_by: admin.id,
      status: 'published'
    });

    const event2 = await Event.create({
      title: '投資策略進階研討會',
      description: '為有經驗的投資者提供高級投資策略，優化您的投資組合。',
      event_type: 'seminar',
      start_date: new Date('2024-03-20T18:00:00'),
      end_date: new Date('2024-03-20T20:00:00'),
      location: '市中心會議中心',
      max_participants: 30,
      price: 50.00,
      points_reward: 200,
      agent_id: agent1Profile.id,
      created_by: admin.id,
      status: 'published'
    });

    const event3 = await Event.create({
      title: '退休規劃大師班',
      description: '退休規劃綜合指南，包括401(k)、IRA和社會保障策略。',
      event_type: 'workshop',
      start_date: new Date('2024-03-25T10:00:00'),
      end_date: new Date('2024-03-25T12:00:00'),
      location: '線上活動',
      max_participants: 40,
      price: 75.00,
      points_reward: 150,
      agent_id: agent2Profile.id,
      created_by: admin.id,
      status: 'published'
    });

    const event4 = await Event.create({
      title: '保險規劃諮詢會',
      description: '了解不同類型的保險以及如何選擇合適的保障。',
      event_type: 'consultation',
      start_date: new Date('2024-02-28T14:00:00'),
      end_date: new Date('2024-02-28T15:30:00'),
      location: '線上活動',
      max_participants: 25,
      price: 0,
      points_reward: 80,
      agent_id: agent2Profile.id,
      created_by: admin.id,
      status: 'published'
    });

    // Create some event registrations
    await EventRegistration.create({
      event_id: event1.id,
      user_id: client1.id,
      status: 'registered'
    });

    await EventRegistration.create({
      event_id: event2.id,
      user_id: client1.id,
      status: 'registered'
    });

    await EventRegistration.create({
      event_id: event1.id,
      user_id: client2.id,
      status: 'registered'
    });

    // Create blog posts
    const blog1 = await BlogPost.create({
      title: '2024年投資趨勢分析',
      slug: '2024-investment-trends',
      content: '隨著全球經濟的變化，投資者需要重新評估他們的投資策略...',
      author_id: agent1.id,
      status: 'published',
      views: 150,
      likes: 25
    });

    const blog2 = await BlogPost.create({
      title: '保險規劃的重要性',
      slug: 'importance-of-insurance',
      content: '在現代社會中，適當的保險規劃是財務安全的重要組成部分...',
      author_id: agent2.id,
      status: 'published',
      views: 120,
      likes: 18
    });

    // Create contests
    const contest1 = await Contest.create({
      title: '2024年1月內容競賽',
      description: '分享您的投資心得和經驗',
      start_date: new Date('2024-01-01T00:00:00'),
      end_date: new Date('2024-01-31T23:59:59'),
      status: 'active',
      created_by: admin.id,
      prize_pool: 5000
    });

    // Create point transactions
    await PointTransaction.create({
      user_id: agent1.id,
      transaction_type: 'earned',
      points_amount: 500,
      description: '付款獎勵 - 月費訂閱',
      payment_transaction_id: null
    });

    await PointTransaction.create({
      user_id: agent1.id,
      transaction_type: 'earned',
      points_amount: 1000,
      description: '內容創作獎勵',
      content_id: blog1.id
    });

    await PointTransaction.create({
      user_id: client1.id,
      transaction_type: 'earned',
      points_amount: 300,
      description: '活動參與獎勵',
      event_id: event1.id
    });

    // Create payment transactions
    await PaymentTransaction.create({
      user_id: agent1.id,
      payment_method: 'stripe',
      amount: 10.00,
      currency: 'HKD',
      status: 'completed',
      points_awarded: 500,
      reward_processed: true,
      payment_date: new Date()
    });

    await PaymentTransaction.create({
      user_id: agent2.id,
      payment_method: 'paypal',
      amount: 10.00,
      currency: 'HKD',
      status: 'completed',
      points_awarded: 500,
      reward_processed: true,
      payment_date: new Date()
    });

    // Create subscriptions
    await Subscription.create({
      user_id: agent1.id,
      plan_type: 'agent',
      status: 'active',
      amount: 10.00,
      currency: 'HKD',
      billing_cycle: 'monthly',
      next_billing_date: new Date('2024-03-01T00:00:00')
    });

    await Subscription.create({
      user_id: agent2.id,
      plan_type: 'agent',
      status: 'active',
      amount: 10.00,
      currency: 'HKD',
      billing_cycle: 'monthly',
      next_billing_date: new Date('2024-03-01T00:00:00')
    });

    // Create agent-client relationships
    await AgentClientRelationship.create({
      agent_id: agent1Profile.id,
      client_id: client1.id,
      status: 'active',
      start_date: new Date('2024-01-01T00:00:00'),
      commission_rate: 0.15,
      total_commission: 1500.00
    });

    await AgentClientRelationship.create({
      agent_id: agent2Profile.id,
      client_id: client2.id,
      status: 'active',
      start_date: new Date('2024-01-15T00:00:00'),
      commission_rate: 0.12,
      total_commission: 1200.00
    });

    // Create event registrations
    await EventRegistration.create({
      event_id: event1.id,
      user_id: client1.id,
      status: 'registered',
      registration_date: new Date('2024-01-10T00:00:00')
    });

    await EventRegistration.create({
      event_id: event2.id,
      user_id: client2.id,
      status: 'registered',
      registration_date: new Date('2024-01-12T00:00:00')
    });

    // Create notifications
    await Notification.create({
      user_id: agent1.id,
      type: 'payment_reward',
      title: '付款獎勵',
      message: '您已獲得500積分作為付款獎勵',
      is_read: false,
      priority: 'medium'
    });

    await Notification.create({
      user_id: client1.id,
      type: 'event_reminder',
      title: '活動提醒',
      message: '投資策略研討會將於明天舉行',
      is_read: false,
      priority: 'high'
    });

    // Create contest submissions
    await ContestSubmission.create({
      contest_id: contest1.id,
      user_id: agent1.id,
      title: '我的投資心得',
      content: '在過去的一年中，我學到了很多關於投資的寶貴經驗...',
      content_type: 'blog_article',
      status: 'approved',
      votes: 15
    });

    // Seed recommendation game data
    // try {
    //   await seedRecommendationData();
    // } catch (error) {
    //   console.log('⚠️ Recommendation seeding skipped (tables may not exist yet):', error.message);
    // }

    console.log('Data seeding completed successfully!');
    console.log('Sample users created:');
    console.log('Admin: admin@personacentric.com / admin123');
    console.log('Agent 1: agent1@personacentric.com / agent123');
    console.log('Agent 2: agent2@personacentric.com / agent123');
    console.log('Client 1: client1@personacentric.com / client123');
    console.log('Client 2: client2@personacentric.com / client123');

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

// Create badges for recommendation game
const badges = [
  {
    name: 'First Recommendation',
    description: 'Created your first recommendation',
    icon: '🌟',
    category: 'general',
    requirement_type: 'count',
    requirement_value: 1,
    points_reward: 50
  },
  {
    name: 'Movie Master',
    description: 'Created 10 movie recommendations',
    icon: '🎬',
    category: 'movie',
    requirement_type: 'count',
    requirement_value: 10,
    points_reward: 200
  },
  {
    name: 'Foodie',
    description: 'Created 5 restaurant recommendations',
    icon: '🍽️',
    category: 'restaurant',
    requirement_type: 'count',
    requirement_value: 5,
    points_reward: 150
  },
  {
    name: 'Gift Guru',
    description: 'Created 8 gift recommendations',
    icon: '🎁',
    category: 'gift',
    requirement_type: 'count',
    requirement_value: 8,
    points_reward: 180
  },
  {
    name: 'Bookworm',
    description: 'Created 6 book recommendations',
    icon: '📚',
    category: 'book',
    requirement_type: 'count',
    requirement_value: 6,
    points_reward: 160
  },
  {
    name: 'Event Enthusiast',
    description: 'Created 4 event recommendations',
    icon: '🎪',
    category: 'event',
    requirement_type: 'count',
    requirement_value: 4,
    points_reward: 120
  },
  {
    name: 'Tech Savvy',
    description: 'Created 7 app recommendations',
    icon: '📱',
    category: 'app',
    requirement_type: 'count',
    requirement_value: 7,
    points_reward: 170
  },
  {
    name: 'Engagement King',
    description: 'Received 50 total engagements',
    icon: '👑',
    category: 'general',
    requirement_type: 'engagement',
    requirement_value: 50,
    points_reward: 300
  },
  {
    name: 'Viral Sensation',
    description: 'Received 100 total views',
    icon: '🔥',
    category: 'general',
    requirement_type: 'engagement',
    requirement_value: 100,
    points_reward: 250
  },
  {
    name: 'Community Builder',
    description: 'Helped 10 people sign up',
    icon: '🌱',
    category: 'general',
    requirement_type: 'engagement',
    requirement_value: 10,
    points_reward: 500
  }
];

// Create sample recommendations
const sampleRecommendations = [
  {
    category: 'movie',
    name: 'Inception',
    description: 'A mind-bending sci-fi thriller about dreams within dreams',
    why_recommend: 'The plot is incredibly creative and the visual effects are groundbreaking. It makes you think long after the movie ends.',
    link: 'https://www.imdb.com/title/tt1375666/',
    location: '',
    photo_url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg'
  },
  {
    category: 'restaurant',
    name: '鼎泰豐',
    description: 'Famous Taiwanese restaurant known for their xiaolongbao',
    why_recommend: 'The soup dumplings are absolutely perfect - thin skin, flavorful broth, and tender meat. A must-try experience!',
    link: 'https://www.dintaifung.com.tw/',
    location: '台北市信義區信義路五段7號',
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Din_Tai_Fung_restaurant_in_Taipei.jpg/1200px-Din_Tai_Fung_restaurant_in_Taipei.jpg'
  },
  {
    category: 'book',
    name: '原子習慣',
    description: 'A guide to building good habits and breaking bad ones',
    why_recommend: 'This book completely changed how I think about habit formation. The 1% improvement concept is life-changing.',
    link: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
    location: '',
    photo_url: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    category: 'app',
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, and project management',
    why_recommend: 'Incredibly flexible and powerful. I use it for everything from daily notes to project planning.',
    link: 'https://www.notion.so/',
    location: '',
    photo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png'
  },
  {
    category: 'gift',
    name: 'AirPods Pro',
    description: 'Wireless earbuds with active noise cancellation',
    why_recommend: 'Perfect gift for anyone who commutes or works in noisy environments. The noise cancellation is amazing.',
    link: 'https://www.apple.com/airpods-pro/',
    location: '',
    photo_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361'
  }
];

async function seedRecommendationData() {
  try {
    // Check if tables exist by trying to query them
    await Badge.count();
    await Recommendation.count();
    
    // Create badges
    for (const badgeData of badges) {
      await Badge.create(badgeData);
    }
    console.log('✅ Badges created successfully');

    // Create sample recommendations for existing users
    const users = await User.findAll({ where: { role: 'client' }, limit: 2 });
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const recommendations = sampleRecommendations.slice(i * 2, (i + 1) * 2);
      
      for (const recData of recommendations) {
        const shareCode = crypto.randomBytes(10).toString('hex').toUpperCase();
        await Recommendation.create({
          ...recData,
          user_id: user.id,
          share_code: shareCode
        });
      }
    }
    console.log('✅ Sample recommendations created successfully');

  } catch (error) {
    console.error('❌ Error seeding recommendation data:', error);
    throw error; // Re-throw to be caught by the outer try-catch
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  const { sequelize } = require('./models');
  
  sequelize.sync({ force: true }).then(() => {
    console.log('Database synced');
    return seedData();
  }).then(() => {
    console.log('Seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedData }; 