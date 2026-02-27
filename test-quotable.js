const axios = require('axios');

async function testQuotableProxy() {
    const baseURL = 'http://localhost:3000/quotable';

    console.log('\n--- TESTING QUOTABLE SERVICE ---');
    console.log('--- TEST 1: Request (Should bypass cache if fresh) ---');
    try {
        const res1 = await axios.get(`${baseURL}?maxLength=50`);
        console.log('Status:', res1.status);
        console.log('Source:', res1.headers['x-proxy-source']);
        console.log('Data:', res1.data);
    } catch (e) { console.error(e.message); }

    console.log('\n--- TEST 2: Request (Should hit cache) ---');
    try {
        const res2 = await axios.get(`${baseURL}?maxLength=50`);
        console.log('Status:', res2.status);
        console.log('Source:', res2.headers['x-proxy-source']);
        console.log('Data:', res2.data);
    } catch (e) { console.error(e.message); }
}

testQuotableProxy();
