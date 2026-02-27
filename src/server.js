const express = require('express');
const axios = require('axios');
const cacheManager = require('./cache-manager');
const agifyService = require('./services/agify');
const genderizeService = require('./services/genderize');
const nationalizeService = require('./services/nationalize');
const quotableService = require('./services/quotable');
const archiveManager = require('./archive-manager');

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

        const axiosConfig = agifyService.getAxiosConfig ? agifyService.getAxiosConfig() : {};
        const response = await axios.get(url, axiosConfig);
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

        const axiosConfig = genderizeService.getAxiosConfig ? genderizeService.getAxiosConfig() : {};
        const response = await axios.get(url, axiosConfig);
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

app.get('/nationalize', async (req, res) => {
    try {
        const params = req.query;
        if (!params.name) {
            return res.status(400).json({ error: "Missing 'name' parameter" });
        }

        const cacheKey = nationalizeService.getCacheKey(params);

        // 1. Check Cache
        const cachedData = await cacheManager.getCache(cacheKey);
        if (cachedData) {
            res.set('X-Proxy-Source', 'Cache');
            return sendResponse(res, cachedData);
        }

        // 2. Check Limits
        const currentUsage = await cacheManager.getUsage(nationalizeService.SERVICE_NAME);
        const limit = nationalizeService.DAILY_LIMIT;

        res.set('X-Rate-Limit-Used', currentUsage);
        res.set('X-Rate-Limit-Limit', limit);

        if (currentUsage >= limit) {
            console.log(`[LIMIT] Daily limit reached for ${nationalizeService.SERVICE_NAME}. Serving mock.`);
            const mockData = nationalizeService.getMockData(params);
            res.set('X-Proxy-Source', 'Mock');
            return sendResponse(res, mockData);
        }

        // 3. Fetch Upstream
        const url = nationalizeService.getUrl(params);
        console.log(`[UPSTREAM] Fetching ${url}`);

        const axiosConfig = nationalizeService.getAxiosConfig ? nationalizeService.getAxiosConfig() : {};
        const response = await axios.get(url, axiosConfig);
        const data = response.data;

        // 4. Save to Cache and Increment Usage
        await cacheManager.setCache(cacheKey, data);
        await cacheManager.incrementUsage(nationalizeService.SERVICE_NAME);

        res.set('X-Proxy-Source', 'Upstream');
        sendResponse(res, data);

    } catch (error) {
        console.error('Proxy error:', error.message);
        if (error.response && error.response.status === 429) {
            console.log(`[UPSTREAM] Rate limited by upstream. Serving mock.`);
            const mockData = nationalizeService.getMockData(req.query);
            res.set('X-Proxy-Source', 'Mock-Fallback');
            return sendResponse(res, mockData);
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/quotable/random', async (req, res) => {
    try {
        const params = req.query;

        // 1. Check Cache for the CURRENT rotation quote
        // This quote is served for 1 minute before rotating again
        const ROTATION_CACHE_KEY = 'quotable:rotation_current';
        const cachedRotation = await cacheManager.getCache(ROTATION_CACHE_KEY);

        if (cachedRotation) {
            res.set('X-Proxy-Source', 'Cache-Rotation');
            return sendResponse(res, cachedRotation);
        }

        // 2. Cache Miss: Time to rotate and enrich the archive

        // A. Fetch a new quote from upstream to add to the bank
        const url = quotableService.getUrl(params);
        console.log(`[UPSTREAM] Fetching new quote to enrich archive: ${url}`);

        const axiosConfig = quotableService.getAxiosConfig ? quotableService.getAxiosConfig() : {};
        let freshQuote;
        try {
            const response = await axios.get(url, axiosConfig);
            freshQuote = response.data;

            // Add to persistent archive
            await archiveManager.addQuote(freshQuote);

            // Increment usage
            await cacheManager.incrementUsage(quotableService.SERVICE_NAME);
        } catch (upstreamError) {
            console.error('[UPSTREAM] Error fetching fresh quote:', upstreamError.message);
            // If upstream fails, we continue with whatever we have in archive
        }

        // B. Pick a RANDOM quote from the entire archive bank
        let selectedQuote = await archiveManager.getRandomQuote();

        // Fallback to mock if archive is somehow empty and upstream failed
        if (!selectedQuote) {
            console.log('[ARCHIVE] Archive empty. Serving mock.');
            selectedQuote = quotableService.getMockData(params);
        }

        // C. Cache the selection for 10 seconds
        const TTL_10_SEC = 10000;
        await cacheManager.setCache(ROTATION_CACHE_KEY, selectedQuote, TTL_10_SEC);

        res.set('X-Proxy-Source', 'Rotation-New');
        sendResponse(res, selectedQuote);

    } catch (error) {
        console.error('Proxy error:', error.message);
        const mockData = quotableService.getMockData(req.query);
        res.set('X-Proxy-Source', 'Error-Fallback');
        return sendResponse(res, mockData);
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
