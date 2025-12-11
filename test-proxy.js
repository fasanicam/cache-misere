const axios = require('axios');

async function testProxy() {
    const baseURL = 'http://localhost:3000/agify';

    console.log('--- TEST 1: First Request (Should bypass cache if fresh) ---');
    try {
        const res1 = await axios.get(`${baseURL}?name=testuser1`);
        console.log('Status:', res1.status);
        console.log('Source:', res1.headers['x-proxy-source']);
        console.log('Data:', res1.data);
    } catch (e) { console.error(e.message); }

    console.log('\n--- TEST 2: Second Request (Should hit cache) ---');
    try {
        const res2 = await axios.get(`${baseURL}?name=testuser1`);
        console.log('Status:', res2.status);
        console.log('Source:', res2.headers['x-proxy-source']);
        console.log('Data:', res2.data);
    } catch (e) { console.error(e.message); }

    console.log('\n--- TEST 3: New Request (Should increment usage) ---');
    try {
        const res3 = await axios.get(`${baseURL}?name=testuser2`);
        console.log('Status:', res3.status);
        console.log('Source:', res3.headers['x-proxy-source']);
        console.log('Usage:', res3.headers['x-rate-limit-used']);
    } catch (e) { console.error(e.message); }
}

async function testGenderizeProxy() {
    const baseURL = 'http://localhost:3000/genderize';

    console.log('\n--- TESTING GENDERIZE SERVICE ---');
    console.log('--- TEST 1: Request (Should bypass cache if fresh) ---');
    try {
        const res1 = await axios.get(`${baseURL}?name=sophie`);
        console.log('Status:', res1.status);
        console.log('Source:', res1.headers['x-proxy-source']);
        console.log('Data:', res1.data);
    } catch (e) { console.error(e.message); }

    console.log('\n--- TEST 2: Request (Should hit cache) ---');
    try {
        const res2 = await axios.get(`${baseURL}?name=sophie`);
        console.log('Status:', res2.status);
        console.log('Source:', res2.headers['x-proxy-source']);
        console.log('Data:', res2.data);
    } catch (e) { console.error(e.message); }
}

// Allow server to start
setTimeout(async () => {
    await testProxy();
    await testGenderizeProxy();
}, 1000);
