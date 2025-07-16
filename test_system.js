const https = require('https');
const http = require('http');

// Test backend health
function testBackend() {
  return new Promise((resolve, reject) => {
    const req = http.request('http://localhost:5001/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Backend health check:', result.status);
          resolve(true);
        } catch (e) {
          console.log('❌ Backend health check failed');
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Test login
function testLogin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'admin@personacentric.com',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Login successful');
            console.log('   User role:', result.user.role);
            console.log('   Token received:', !!result.token);
            resolve(result.token);
          } else {
            console.log('❌ Login failed:', result.error);
            reject(new Error(result.error));
          }
        } catch (e) {
          console.log('❌ Login test failed');
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Test dashboard
function testDashboard(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/dashboard',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Dashboard access successful');
            console.log('   Dashboard type:', result.data.user.role);
            console.log('   User points:', result.data.user.points);
            resolve(true);
          } else {
            console.log('❌ Dashboard access failed:', result.error);
            reject(new Error(result.error));
          }
        } catch (e) {
          console.log('❌ Dashboard test failed');
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing Persona Centric System...\n');
  
  try {
    await testBackend();
    const token = await testLogin();
    await testDashboard(token);
    
    console.log('\n🎉 All tests passed! The system is working correctly.');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: admin@personacentric.com / admin123');
    console.log('   Agent: agent1@personacentric.com / agent123');
    console.log('   Client: client1@personacentric.com / client123');
    console.log('\n🌐 Access the application at: http://localhost:3000');
    
  } catch (error) {
    console.log('\n❌ Tests failed:', error.message);
  }
}

runTests(); 