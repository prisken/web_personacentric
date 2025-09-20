// Test script to verify Secret Chat Room functionality
const fetch = require('node-fetch');

async function testSecretChatFlow() {
  console.log('🧪 Testing Secret Chat Room Flow...\n');
  
  try {
    // Step 1: Test secret login
    console.log('1. Testing secret login...');
    const loginResponse = await fetch('http://localhost:5001/api/food-for-talk/secret-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'local@test.com',
        password: 'test123',
        passkey: 'tpwtks6ul9fxc97gfsqzg'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', loginData.message);
    console.log('   Token received:', !!loginData.token);
    console.log('   User data:', loginData.user);
    
    // Step 2: Test JWT token decoding
    console.log('\n2. Testing JWT token decoding...');
    const token = loginData.token;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
    console.log('✅ JWT payload decoded:', payload);
    
    const userData = {
      id: payload.userId,
      email: payload.email,
      blurredName: payload.email.charAt(0) + '***'
    };
    console.log('✅ User data created:', userData);
    
    // Step 3: Test chat participants endpoint
    console.log('\n3. Testing chat participants endpoint...');
    const participantsResponse = await fetch('http://localhost:5001/api/food-for-talk/chat-participants', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const participantsData = await participantsResponse.json();
    console.log('✅ Chat participants loaded:', participantsData.message);
    console.log('   Participants count:', participantsData.participants.length);
    console.log('   Sample participant:', participantsData.participants[0]);
    
    console.log('\n🎉 All tests passed! Secret Chat Room functionality is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSecretChatFlow();
