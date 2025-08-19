const { User, ClientRelationship } = require('./models');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const API_BASE = 'http://localhost:5001/api';

async function testNewClientAgentSystem() {
  console.log('🧪 Testing improved client-agent relationship system...\n');

  try {
    // 1. Find an agent and a client user
    const agent = await User.findOne({ where: { role: 'agent' } });
    const client = await User.findOne({ where: { role: 'client' } });

    if (!agent || !client) {
      console.error('❌ Need at least one agent and one client user');
      return;
    }

    console.log(`✅ Found agent: ${agent.first_name} ${agent.last_name} (${agent.email})`);
    console.log(`✅ Found client: ${client.first_name} ${client.last_name} (${client.email})`);
    console.log(`   Client referral ID: ${client.client_id}\n`);

    // 2. Create JWT tokens for both users
    const agentToken = jwt.sign(
      { userId: agent.id, email: agent.email, role: agent.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const clientToken = jwt.sign(
      { userId: client.id, email: client.email, role: client.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3. Test client relationship endpoints (for client)
    console.log('📱 Testing client relationship endpoints...');
    
    try {
      const clientRelResponse = await axios.get(`${API_BASE}/client-management/client/relationships`, {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      
      console.log(`✅ Client can view relationships: ${clientRelResponse.data.relationships.length} found`);
      console.log(`   Client ID from API: ${clientRelResponse.data.client_id}`);
    } catch (error) {
      console.error('❌ Client relationship endpoint failed:', error.response?.data || error.message);
    }

    // 4. Test agent adding client using referral ID
    console.log('\n🔗 Testing agent adding client by referral ID...');
    
    try {
      const addClientResponse = await axios.post(`${API_BASE}/client-management/clients`, {
        client_referral_id: client.client_id,
        commission_rate: 0.15,
        notes: 'Test relationship via referral ID',
        risk_tolerance: 'moderate',
        investment_horizon: 'long_term'
      }, {
        headers: { Authorization: `Bearer ${agentToken}` }
      });
      
      console.log('✅ Agent successfully added client using referral ID');
      console.log(`   Relationship status: ${addClientResponse.data.relationship.status}`);
      console.log(`   Relationship ID: ${addClientResponse.data.relationship.id}`);
      
      const relationshipId = addClientResponse.data.relationship.id;

      // 5. Test client confirming the relationship
      console.log('\n✅ Testing client confirming relationship...');
      
      try {
        const confirmResponse = await axios.post(`${API_BASE}/client-management/client/relationships/${relationshipId}/confirm`, {}, {
          headers: { Authorization: `Bearer ${clientToken}` }
        });
        
        console.log('✅ Client successfully confirmed relationship');
        console.log(`   Message: ${confirmResponse.data.message}`);
        
        // 6. Verify the relationship is now active
        const agentClientsResponse = await axios.get(`${API_BASE}/client-management/clients`, {
          headers: { Authorization: `Bearer ${agentToken}` }
        });
        
        const activeRelationship = agentClientsResponse.data.relationships.find(r => r.id === relationshipId);
        if (activeRelationship && activeRelationship.status === 'active') {
          console.log('✅ Relationship is now active in agent\'s client list');
        } else {
          console.log('❌ Relationship not found or not active');
        }
        
        // 7. Test trying to add the same client again (should fail)
        console.log('\n🚫 Testing duplicate relationship prevention...');
        
        try {
          await axios.post(`${API_BASE}/client-management/clients`, {
            client_referral_id: client.client_id,
            commission_rate: 0.10
          }, {
            headers: { Authorization: `Bearer ${agentToken}` }
          });
          console.log('❌ Duplicate relationship was allowed (should have been prevented)');
        } catch (error) {
          if (error.response?.status === 400) {
            console.log('✅ Duplicate relationship correctly prevented');
          } else {
            console.log('❌ Unexpected error preventing duplicate:', error.response?.data || error.message);
          }
        }
        
        // 8. Clean up - remove the test relationship
        console.log('\n🧹 Cleaning up test relationship...');
        
        try {
          await axios.delete(`${API_BASE}/client-management/clients/${client.id}`, {
            headers: { Authorization: `Bearer ${agentToken}` }
          });
          console.log('✅ Test relationship cleaned up');
        } catch (error) {
          console.log('⚠️  Failed to clean up test relationship:', error.response?.data || error.message);
        }
        
      } catch (error) {
        console.error('❌ Client confirm relationship failed:', error.response?.data || error.message);
      }
      
    } catch (error) {
      console.error('❌ Agent add client failed:', error.response?.data || error.message);
    }

    // 9. Test invalid referral ID
    console.log('\n🚫 Testing invalid referral ID...');
    
    try {
      await axios.post(`${API_BASE}/client-management/clients`, {
        client_referral_id: 'INVALID123',
        commission_rate: 0.10
      }, {
        headers: { Authorization: `Bearer ${agentToken}` }
      });
      console.log('❌ Invalid referral ID was accepted (should have been rejected)');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Invalid referral ID correctly rejected');
      } else {
        console.log('❌ Unexpected error for invalid referral ID:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test setup failed:', error);
  }
}

// Run the test
testNewClientAgentSystem()
  .then(() => {
    console.log('\n✅ Testing completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
  });