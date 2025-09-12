const { User, Agent } = require('../models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createAllProductionUsers() {
  try {
    console.log('🚀 Creating all production users...');
    console.log('Environment:', process.env.NODE_ENV);

    // Define all users to create
    const usersToCreate = [
      // Super Admin
      {
        email: 'superadmin@personacentric.com',
        password: 'superadmin123',
        first_name: 'Super',
        last_name: 'Admin',
        phone: '+852-0000-0000',
        role: 'super_admin',
        points: 0,
        permissions: { super_admin: true }
      },
      // Admin
      {
        email: 'admin@personacentric.com',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'User',
        phone: '+852-1234-5678',
        role: 'admin',
        points: 0
      },
      // Agents
      {
        email: 'agent1@personacentric.com',
        password: 'agent123',
        first_name: '張',
        last_name: '顧問',
        phone: '+852-2345-6789',
        role: 'agent',
        points: 0,
        agentProfile: {
          specialization: '投資規劃',
          experience_years: 5,
          certifications: 'CFP, CFA',
          bio: '專注於個人投資規劃和退休規劃',
          commission_rate: 0.15,
          rating: 4.5,
          total_reviews: 10,
          areas_of_expertise: ['退休規劃', '投資組合管理', '風險管理'],
          languages: ['zh-TW', 'en'],
          preferred_client_types: ['個人投資者', '小型企業'],
          communication_modes: ['面對面', '視訊會議'],
          availability: '{"weekdays": ["09:00-18:00"], "weekends": ["10:00-15:00"]}',
          location: '香港中環'
        }
      },
      {
        email: 'agent2@personacentric.com',
        password: 'agent123',
        first_name: '李',
        last_name: '顧問',
        phone: '+852-3456-7890',
        role: 'agent',
        points: 0,
        agentProfile: {
          specialization: '保險規劃',
          experience_years: 8,
          certifications: 'LUTCF, CLU',
          bio: '專業保險顧問，專精於人壽保險和健康保險',
          commission_rate: 0.12,
          rating: 4.8,
          total_reviews: 25,
          areas_of_expertise: ['人壽保險', '健康保險', '意外保險'],
          languages: ['zh-TW', 'en'],
          preferred_client_types: ['家庭', '高收入個人'],
          communication_modes: ['面對面', '電話'],
          availability: '{"weekdays": ["10:00-19:00"], "weekends": ["09:00-16:00"]}',
          location: '香港銅鑼灣'
        }
      },
      {
        email: 'sarah.johnson@personacentric.com',
        password: 'agent123',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '+852-4567-8901',
        role: 'agent',
        points: 1805,
        agentProfile: {
          specialization: '財富管理',
          experience_years: 12,
          certifications: 'CFP, CWM',
          bio: '資深財富管理顧問，專精於高淨值客戶服務',
          commission_rate: 0.18,
          rating: 4.9,
          total_reviews: 45,
          areas_of_expertise: ['財富管理', '稅務規劃', '遺產規劃'],
          languages: ['en', 'zh-TW'],
          preferred_client_types: ['高淨值個人', '企業主'],
          communication_modes: ['視訊會議', '面對面'],
          availability: '{"weekdays": ["08:00-17:00"], "weekends": ["10:00-14:00"]}',
          location: '香港金鐘'
        }
      },
      {
        email: 'michael.chen@personacentric.com',
        password: 'agent123',
        first_name: 'Michael',
        last_name: 'Chen',
        phone: '+852-5678-9012',
        role: 'agent',
        points: 0,
        agentProfile: {
          specialization: '退休規劃',
          experience_years: 6,
          certifications: 'RFP, CFP',
          bio: '退休規劃專家，幫助客戶建立穩健的退休基金',
          commission_rate: 0.14,
          rating: 4.6,
          total_reviews: 18,
          areas_of_expertise: ['退休規劃', '年金規劃', '長期照護'],
          languages: ['zh-TW', 'en'],
          preferred_client_types: ['中年專業人士', '即將退休者'],
          communication_modes: ['面對面', '視訊會議'],
          availability: '{"weekdays": ["09:00-18:00"], "weekends": ["10:00-15:00"]}',
          location: '香港尖沙咀'
        }
      },
      {
        email: 'emily.rodriguez@personacentric.com',
        password: 'agent123',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        phone: '+852-6789-0123',
        role: 'agent',
        points: 0,
        agentProfile: {
          specialization: '教育基金規劃',
          experience_years: 4,
          certifications: 'CFP',
          bio: '教育基金規劃專家，專精於子女教育儲蓄',
          commission_rate: 0.13,
          rating: 4.4,
          total_reviews: 12,
          areas_of_expertise: ['教育基金', '儲蓄規劃', '投資組合'],
          languages: ['en', 'es'],
          preferred_client_types: ['年輕家庭', '有子女的父母'],
          communication_modes: ['視訊會議', '電話'],
          availability: '{"weekdays": ["10:00-19:00"], "weekends": ["09:00-16:00"]}',
          location: '香港灣仔'
        }
      },
      {
        email: 'kenji.tanaka@personacentric.com',
        password: 'agent123',
        first_name: 'Kenji',
        last_name: 'Tanaka',
        phone: '+852-7890-1234',
        role: 'agent',
        points: 0,
        agentProfile: {
          specialization: '國際投資',
          experience_years: 10,
          certifications: 'CFA, FRM',
          bio: '國際投資專家，專精於全球市場投資策略',
          commission_rate: 0.16,
          rating: 4.7,
          total_reviews: 32,
          areas_of_expertise: ['國際投資', '外匯', '商品投資'],
          languages: ['ja', 'en', 'zh-TW'],
          preferred_client_types: ['國際投資者', '企業'],
          communication_modes: ['視訊會議', '面對面'],
          availability: '{"weekdays": ["08:00-17:00"], "weekends": ["10:00-14:00"]}',
          location: '香港中環'
        }
      },
      {
        email: 'lucy.wong@personacentric.com',
        password: 'agent123',
        first_name: 'Lucy',
        last_name: 'Wong',
        phone: '+852-8901-2345',
        role: 'agent',
        points: 0,
        agentProfile: {
          specialization: '房地產投資',
          experience_years: 7,
          certifications: 'CCIM, CPM',
          bio: '房地產投資顧問，專精於香港房地產市場',
          commission_rate: 0.15,
          rating: 4.5,
          total_reviews: 20,
          areas_of_expertise: ['房地產投資', '物業管理', '租賃規劃'],
          languages: ['zh-TW', 'en'],
          preferred_client_types: ['房地產投資者', '物業擁有者'],
          communication_modes: ['面對面', '電話'],
          availability: '{"weekdays": ["09:00-18:00"], "weekends": ["10:00-15:00"]}',
          location: '香港九龍'
        }
      },
      {
        email: 'alexander.smith@personacentric.com',
        password: 'agent123',
        first_name: 'Alexander',
        last_name: 'Smith',
        phone: '+852-9012-3456',
        role: 'agent',
        points: 0,
        agentProfile: {
          specialization: '企業財務',
          experience_years: 9,
          certifications: 'CFA, CPA',
          bio: '企業財務顧問，專精於企業融資和財務規劃',
          commission_rate: 0.17,
          rating: 4.8,
          total_reviews: 28,
          areas_of_expertise: ['企業融資', '財務規劃', '風險管理'],
          languages: ['en', 'zh-TW'],
          preferred_client_types: ['中小企業', '企業主'],
          communication_modes: ['視訊會議', '面對面'],
          availability: '{"weekdays": ["08:00-17:00"], "weekends": ["10:00-14:00"]}',
          location: '香港中環'
        }
      },
      {
        email: 'mei.lin@personacentric.com',
        password: 'agent123',
        first_name: 'Mei',
        last_name: 'Lin',
        phone: '+852-0123-4567',
        role: 'agent',
        points: 0,
        agentProfile: {
          specialization: '稅務規劃',
          experience_years: 6,
          certifications: 'CPA, CFP',
          bio: '稅務規劃專家，幫助客戶優化稅務策略',
          commission_rate: 0.14,
          rating: 4.6,
          total_reviews: 15,
          areas_of_expertise: ['稅務規劃', '會計服務', '財務諮詢'],
          languages: ['zh-TW', 'en'],
          preferred_client_types: ['高收入個人', '小企業主'],
          communication_modes: ['面對面', '視訊會議'],
          availability: '{"weekdays": ["09:00-18:00"], "weekends": ["10:00-15:00"]}',
          location: '香港銅鑼灣'
        }
      },
      // Clients
      {
        email: 'client1@personacentric.com',
        password: 'client123',
        first_name: '王',
        last_name: '客戶',
        phone: '+852-9876-5432',
        role: 'client',
        points: 555
      },
      {
        email: 'client2@personacentric.com',
        password: 'client123',
        first_name: '陳',
        last_name: '客戶',
        phone: '+852-8765-4321',
        role: 'client',
        points: 10
      },
      {
        email: 'client1@test.com',
        password: 'client123',
        first_name: '王',
        last_name: '小明',
        phone: '+852-7654-3210',
        role: 'client',
        points: 0
      },
      {
        email: 'client2@test.com',
        password: 'client123',
        first_name: '陳',
        last_name: '美玲',
        phone: '+852-6543-2109',
        role: 'client',
        points: 0
      },
      {
        email: 'client3@test.com',
        password: 'client123',
        first_name: 'John',
        last_name: 'Smith',
        phone: '+852-5432-1098',
        role: 'client',
        points: 0
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of usersToCreate) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: userData.email } });
        
        if (existingUser) {
          console.log(`⏭️  User ${userData.email} already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create user
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
          id: uuidv4(),
          email: userData.email,
          password_hash: hashedPassword,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          role: userData.role,
          language_preference: 'zh-TW',
          points: userData.points,
          subscription_status: 'active',
          is_verified: true,
          permissions: userData.permissions || {}
        });

        console.log(`✅ Created user: ${userData.first_name} ${userData.last_name} (${userData.email}) - ${userData.role}`);
        createdCount++;

        // Create agent profile if this is an agent
        if (userData.role === 'agent' && userData.agentProfile) {
          await Agent.create({
            user_id: user.id,
            specialization: userData.agentProfile.specialization,
            experience_years: userData.agentProfile.experience_years,
            certifications: userData.agentProfile.certifications,
            bio: userData.agentProfile.bio,
            commission_rate: userData.agentProfile.commission_rate,
            is_verified: true,
            rating: userData.agentProfile.rating,
            total_reviews: userData.agentProfile.total_reviews,
            areas_of_expertise: JSON.stringify(userData.agentProfile.areas_of_expertise),
            languages: JSON.stringify(userData.agentProfile.languages),
            preferred_client_types: JSON.stringify(userData.agentProfile.preferred_client_types),
            communication_modes: JSON.stringify(userData.agentProfile.communication_modes),
            availability: userData.agentProfile.availability,
            location: userData.agentProfile.location,
            status: 'approved',
            in_matching_pool: true
          });
          console.log(`  📋 Created agent profile for ${userData.first_name} ${userData.last_name}`);
        }

      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    console.log(`\n🎉 Production users creation completed!`);
    console.log(`📊 Summary: ${createdCount} users created, ${skippedCount} users skipped`);

    // Verify final counts
    const totalUsers = await User.count();
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['role']
    });

    console.log(`\n📈 Final database state:`);
    console.log(`Total users: ${totalUsers}`);
    usersByRole.forEach(row => {
      console.log(`  ${row.role}: ${row.dataValues.count} users`);
    });

  } catch (error) {
    console.error('❌ Error creating production users:', error);
    throw error;
  }
}

module.exports = createAllProductionUsers;

// Run if called directly
if (require.main === module) {
  createAllProductionUsers()
    .then(() => {
      console.log('✅ All production users created successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to create production users:', error);
      process.exit(1);
    });
}
