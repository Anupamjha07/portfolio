all const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const AUTH = {
    username: 'admin',
    password: 'admin123'
};

async function test() {
    console.log('--- Testing API ---');

    // 1. Test Resume
    try {
        const res = await axios.get(`${BASE_URL}/cv.pdf`);
        console.log(`[PASS] Resume load: Status ${res.status}, Content-Type: ${res.headers['content-type']}`);
    } catch (e) {
        console.log(`[FAIL] Resume load: ${e.message}`);
    }

    // 2. Test Contact (Add Message)
    try {
        const res = await axios.post(`${BASE_URL}/api/contact`, {
            name: 'API Tester',
            email: 'api@test.com',
            message: 'Hello from API Test'
        });
        console.log(`[PASS] Add Message: Status ${res.status}, Success: ${res.data.success}`);
    } catch (e) {
        console.log(`[FAIL] Add Message: ${e.message}`);
    }

    // 3. Test Add Experience (Auth)
    try {
        const res = await axios.post(`${BASE_URL}/api/experience`, {
            role: 'API Dev',
            company: 'Test Corp',
            duration: '2023',
            description: 'Testing API'
        }, { auth: AUTH });
        console.log(`[PASS] Add Experience: Status ${res.status}, Success: ${res.data.success}`);
    } catch (e) {
        console.log(`[FAIL] Add Experience: ${e.message}`);
    }

    // 4. Check Messages (Auth)
    try {
        const res = await axios.get(`${BASE_URL}/api/messages`, { auth: AUTH });
        console.log(`[PASS] Get Messages: Count ${res.data.length}`);
        if (res.data.length > 0) console.log('Message:', res.data[0]);
    } catch (e) {
        console.log(`[FAIL] Get Messages: ${e.message}`);
    }

}

test();
