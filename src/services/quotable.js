const axios = require('axios');
const https = require('https');

const SERVICE_NAME = 'quotable';
const BASE_URL = 'https://dummyjson.com/quotes/random';
const DAILY_LIMIT = 100;

function getUrl(params) {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
}

function getCacheKey(params) {
    const queryString = new URLSearchParams(params).toString();
    // Cache key based on query string to allow different random filters, 
    // but same filters will just return the same "random" quote from cache.
    return `${SERVICE_NAME}:${queryString || 'default'}`;
}

function getMockData(params) {
    return {
        _id: "mock_id_12345",
        content: "This is a mocked random quote (limit exceeded or upstream failed). Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Mocked Author",
        tags: ["mock", "limit"],
        authorSlug: "mocked-author",
        length: 154,
        dateAdded: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0]
    };
}

function getAxiosConfig() {
    return {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        transformResponse: [
            function (data) {
                let parsed;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    return data;
                }

                if (parsed && parsed.quote && parsed.author) {
                    return {
                        _id: String(parsed.id || Date.now()),
                        content: parsed.quote,
                        author: parsed.author,
                        tags: ["a-fasani-json"],
                        authorSlug: parsed.author.toLowerCase().replace(/\s+/g, '-'),
                        length: parsed.quote.length,
                        dateAdded: new Date().toISOString().split('T')[0],
                        dateModified: new Date().toISOString().split('T')[0]
                    };
                }

                return parsed;
            }
        ]
    };
}

module.exports = {
    SERVICE_NAME,
    DAILY_LIMIT,
    getUrl,
    getCacheKey,
    getMockData,
    getAxiosConfig
};
