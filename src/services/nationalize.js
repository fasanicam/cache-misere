
const axios = require('axios');

const SERVICE_NAME = 'nationalize';
const BASE_URL = 'https://api.nationalize.io';
const DAILY_LIMIT = 100;

function getUrl(params) {
    const queryString = new URLSearchParams(params).toString();
    return `${BASE_URL}?${queryString}`;
}

function getCacheKey(params) {
    const name = params.name ? params.name.toLowerCase() : '';
    return `${SERVICE_NAME}:${name}`;
}

function getMockData(params) {
    const name = params.name || 'Unknown';

    // Deterministic mock data
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate a set of countries based on the hash (example logic)
    const countries = ['FR', 'US', 'BE', 'CA', 'DE', 'IT', 'ES', 'PT', 'BR', 'JP'];
    const mockCountries = [];

    // Pick 2-3 random countries from the list deterministically
    const numCountries = (Math.abs(hash) % 2) + 2;
    let remainingProb = 1.0;

    for (let i = 0; i < numCountries; i++) {
        const countryIndex = (Math.abs(hash) + i) % countries.length;
        const prob = parseFloat((remainingProb * (0.5 + (Math.abs(hash + i) % 4) / 10)).toFixed(2));

        mockCountries.push({
            country_id: countries[countryIndex],
            probability: prob
        });
        remainingProb -= prob;
        if (remainingProb < 0) remainingProb = 0;
    }

    return {
        name: name,
        country: mockCountries,
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
