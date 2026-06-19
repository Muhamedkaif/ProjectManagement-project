async function testAuth() {
  const baseUrl = 'http://localhost:5000/api/auth';
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  
  console.log('--- TESTING REGISTER ---');
  try {
    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Engineer',
        email: testEmail,
        password: testPassword,
        role: 'Admin'
      })
    });
    
    const regData = await regRes.json();
    console.log('Register Response Status:', regRes.status);
    console.log('Register Response Data:', JSON.stringify(regData, null, 2));

    if (regRes.status !== 201) {
      throw new Error('Registration failed');
    }

    console.log('\n--- TESTING LOGIN ---');
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    const loginData = await loginRes.json();
    console.log('Login Response Status:', loginRes.status);
    console.log('Login Response Data:', JSON.stringify(loginData, null, 2));

    if (loginRes.status !== 200) {
      throw new Error('Login failed');
    }

    const token = loginData.data.token;

    console.log('\n--- TESTING GET PROFILE (/ME) ---');
    const profileRes = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const profileData = await profileRes.json();
    console.log('Profile Response Status:', profileRes.status);
    console.log('Profile Response Data:', JSON.stringify(profileData, null, 2));

    if (profileRes.status !== 200) {
      throw new Error('Fetching profile failed');
    }

    console.log('\n✅ ALL AUTHENTICATION FLOW TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Authentication flow test failed:', error.message);
  }
}

testAuth();
