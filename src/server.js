const express = require('express');
const axios = require('axios');
const cacheManager = require('./cache-manager');
const agifyService = require('./services/agify');
const genderizeService = require('./services/genderize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function sendResponse(res, data) {
    // Inject signature
    const responseData = {
        ...data,
        servi_par: "cache-misere",
        realise_par: "David Fasani"
    };
    res.json(responseData);
}

app.get('/agify', async (req, res) => {
    try {
        const params = req.query;
        if (!params.name) {
            return res.status(400).json({ error: "Missing 'name' parameter" });
        }

        const cacheKey = agifyService.getCacheKey(params);

        // 1. Check Cache
        const cachedData = await cacheManager.getCache(cacheKey);
        if (cachedData) {
            res.set('X-Proxy-Source', 'Cache');
            return sendResponse(res, cachedData);
        }

        // 2. Check Limits
        const currentUsage = await cacheManager.getUsage(agifyService.SERVICE_NAME);
        const limit = agifyService.DAILY_LIMIT;

        res.set('X-Rate-Limit-Used', currentUsage);
        res.set('X-Rate-Limit-Limit', limit);

        if (currentUsage >= limit) {
            console.log(`[LIMIT] Daily limit reached for ${agifyService.SERVICE_NAME}. Serving mock.`);
            const mockData = agifyService.getMockData(params);
            res.set('X-Proxy-Source', 'Mock');
            return sendResponse(res, mockData);
        }

        // 3. Fetch Upstream
        const url = agifyService.getUrl(params);
        console.log(`[UPSTREAM] Fetching ${url}`);

        const response = await axios.get(url);
        const data = response.data;

        // 4. Save to Cache and Increment Usage
        await cacheManager.setCache(cacheKey, data);
        await cacheManager.incrementUsage(agifyService.SERVICE_NAME);

        res.set('X-Proxy-Source', 'Upstream');
        sendResponse(res, data);

    } catch (error) {
        console.error('Proxy error:', error.message);
        // Fallback to mock on error? Or just 500?
        // Let's fallback to mock if upstream fails (e.g. they rate limit us)
        if (error.response && error.response.status === 429) {
            console.log(`[UPSTREAM] Rate limited by upstream. Serving mock.`);
            const mockData = agifyService.getMockData(req.query);
            res.set('X-Proxy-Source', 'Mock-Fallback');
            return sendResponse(res, mockData);
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/genderize', async (req, res) => {
    try {
        const params = req.query;
        if (!params.name) {
            return res.status(400).json({ error: "Missing 'name' parameter" });
        }

        const cacheKey = genderizeService.getCacheKey(params);

        // 1. Check Cache
        const cachedData = await cacheManager.getCache(cacheKey);
        if (cachedData) {
            res.set('X-Proxy-Source', 'Cache');
            return sendResponse(res, cachedData);
        }

        // 2. Check Limits
        const currentUsage = await cacheManager.getUsage(genderizeService.SERVICE_NAME);
        const limit = genderizeService.DAILY_LIMIT;

        res.set('X-Rate-Limit-Used', currentUsage);
        res.set('X-Rate-Limit-Limit', limit);

        if (currentUsage >= limit) {
            console.log(`[LIMIT] Daily limit reached for ${genderizeService.SERVICE_NAME}. Serving mock.`);
            const mockData = genderizeService.getMockData(params);
            res.set('X-Proxy-Source', 'Mock');
            return sendResponse(res, mockData);
        }

        // 3. Fetch Upstream
        const url = genderizeService.getUrl(params);
        console.log(`[UPSTREAM] Fetching ${url}`);

        const response = await axios.get(url);
        const data = response.data;

        // 4. Save to Cache and Increment Usage
        await cacheManager.setCache(cacheKey, data);
        await cacheManager.incrementUsage(genderizeService.SERVICE_NAME);

        res.set('X-Proxy-Source', 'Upstream');
        sendResponse(res, data);

    } catch (error) {
        console.error('Proxy error:', error.message);
        if (error.response && error.response.status === 429) {
            console.log(`[UPSTREAM] Rate limited by upstream. Serving mock.`);
            const mockData = genderizeService.getMockData(req.query);
            res.set('X-Proxy-Source', 'Mock-Fallback');
            return sendResponse(res, mockData);
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
