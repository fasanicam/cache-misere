const fs = require('fs-extra');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../data/cache.json');
const USAGE_FILE = path.join(__dirname, '../data/usage.json');

// Ensure data directory exists
fs.ensureDirSync(path.join(__dirname, '../data'));

async function getCache(key) {
    try {
        if (await fs.pathExists(CACHE_FILE)) {
            const cache = await fs.readJson(CACHE_FILE);

            if (cache[key]) {
                const item = cache[key];

                // Check if it's a new style cache item with expiration
                if (item.expiresAt) {
                    if (Date.now() > item.expiresAt) {
                        console.log(`[CACHE] Expired for ${key}`);
                        delete cache[key];
                        await fs.writeJson(CACHE_FILE, cache, { spaces: 2 });
                        return null;
                    }
                    console.log(`[CACHE] Hit for ${key} (expires in ${Math.round((item.expiresAt - Date.now()) / 1000)}s)`);
                    return item.data;
                }

                // Old style cache item (permanent)
                console.log(`[CACHE] Hit for ${key} (permanent)`);
                return item;
            }
        }
    } catch (err) {
        console.error('Error reading cache:', err);
    }
    return null;
}

async function setCache(key, data, ttlMs = null) {
    try {
        let cache = {};
        if (await fs.pathExists(CACHE_FILE)) {
            cache = await fs.readJson(CACHE_FILE);
        }

        if (ttlMs) {
            cache[key] = {
                data: data,
                expiresAt: Date.now() + ttlMs
            };
        } else {
            cache[key] = data;
        }

        await fs.writeJson(CACHE_FILE, cache, { spaces: 2 });
        console.log(`[CACHE] Saved for ${key}${ttlMs ? ` (TTL: ${ttlMs}ms)` : ' (permanent)'}`);
    } catch (err) {
        console.error('Error writing cache:', err);
    }
}

async function getUsage(serviceName) {
    try {
        if (await fs.pathExists(USAGE_FILE)) {
            const usage = await fs.readJson(USAGE_FILE);
            const today = new Date().toISOString().split('T')[0];

            if (usage[today] && usage[today][serviceName]) {
                return usage[today][serviceName];
            }
        }
    } catch (err) {
        console.error('Error reading usage:', err);
    }
    return 0;
}

async function incrementUsage(serviceName) {
    try {
        let usage = {};
        if (await fs.pathExists(USAGE_FILE)) {
            usage = await fs.readJson(USAGE_FILE);
        }

        const today = new Date().toISOString().split('T')[0];
        if (!usage[today]) usage[today] = {};
        if (!usage[today][serviceName]) usage[today][serviceName] = 0;

        usage[today][serviceName]++;

        await fs.writeJson(USAGE_FILE, usage, { spaces: 2 });
        return usage[today][serviceName];
    } catch (err) {
        console.error('Error writing usage:', err);
        return 999; // Fail safe to limit? Or 0 to allow? Let's assume fail safe.
    }
}

module.exports = {
    getCache,
    setCache,
    getUsage,
    incrementUsage
};
