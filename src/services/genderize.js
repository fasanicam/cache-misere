
const axios = require('axios');

const SERVICE_NAME = 'genderize';
const BASE_URL = 'https://api.genderize.io';
const DAILY_LIMIT = 100;

function getUrl(params) {
    const queryString = new URLSearchParams(params).toString();
    return `${BASE_URL}?${queryString}`;
}

function getCacheKey(params) {
    const name = params.name ? params.name.toLowerCase() : '';
    const country = params.country_id ? `_${params.country_id}` : '';
    return `${SERVICE_NAME}:${name}${country}`;
}

function getMockData(params) {
    const name = params.name || 'Unknown';

    // Deterministic mock data
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Invent gender based on hash (even = female, odd = male, roughly)
    const isFemale = (hash % 2) === 0;
    const gender = isFemale ? 'female' : 'male';
    const probability = 0.85 + (Math.abs(hash % 15) / 100); // 0.85 to 0.99

    return {
        name: name,
        gender: gender,
        probability: probability,
        count: 0,
        note: "This is a mocked response (limit exceeded)"
    };
}

module.exports = {
    SERVICE_NAME,
    DAILY_LIMIT,
    getUrl,
    getCacheKey,
    getMockData
};
