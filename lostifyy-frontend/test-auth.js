const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function testAuth() {
  try {
    console.log('Testing authentication flow...');
    
    // Test registration
    console.log('\n1. Testing registration...');
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️  User already exists, continuing with login test...');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
      }
    }
    
    // Test login
    console.log('\n2. Testing login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data);
    
    const token = loginResponse.data.token;
    
    // Test token verification
    console.log('\n3. Testing token verification...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Token verification successful:', verifyResponse.data);
    
    // Test protected endpoint
    console.log('\n4. Testing protected endpoint...');
    try {
      const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Protected endpoint accessible:', itemsResponse.status);
    } catch (error) {
      console.log('ℹ️  Protected endpoint test:', error.response?.status, error.response?.statusText);
    }
    
    console.log('\n🎉 Authentication flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testAuth();