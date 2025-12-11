
const axios = require('axios');

const SERVICE_NAME = 'agify';
const BASE_URL = 'https://api.agify.io';
const DAILY_LIMIT = 100;

function getUrl(params) {
    // Construct query string
    const queryString = new URLSearchParams(params).toString();
    return `${BASE_URL}?${queryString}`;
}

function getCacheKey(params) {
    // Unique key based on params. For agify, 'name' is the main one. 
    // We should probably normalize it (lowercase).
    // If country_id is present, include it.
    const name = params.name ? params.name.toLowerCase() : '';
    const country = params.country_id ? `_${params.country_id}` : '';
    return `${SERVICE_NAME}:${name}${country}`;
}

function getMockData(params) {
    const name = params.name || 'Unknown';
    // Deterministic mock data based on name length or chars to be consistent-ish?
    // Or just random. User asked to "inventer".

    // Simple hash to make sure same name always gets same "invented" age
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Invent an age between 18 and 90
    const age = Math.abs(hash % 73) + 18;

    return {
        name: name,
        age: age,
        count: 0, // Indicate it's not based on real data
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
