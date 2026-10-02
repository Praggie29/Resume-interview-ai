const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 300,      // Default TTL: 5 minutes
    checkperiod: 60,  // Remove expired keys every 60 seconds
    maxKeys: 500,     // Prevents RAM memory overflow by capping max items
    useClones: false  // Improves performance by disabling deep object cloning
});

const cacheService = {
    get(key) {
        try {
            return cache.get(key);
        } catch (err) {
            console.error(`[Cache Error] Failed to get "${key}":`, err.message);
        }
    },

    set(key, value, ttl = 300) {
        try {
            cache.set(key, value, ttl);
        } catch (err) {
            console.error(`[Cache Error] Failed to set "${key}":`, err.message);
        }
    },

    del(key) {
        try {
            cache.del(key);
        } catch (err) {
            console.error(`[Cache Error] Failed to delete "${key}":`, err.message);
        }
    },

    async getOrSet(key, callback, ttl = 300) {
        // 1. Try reading from cache safely
        try {
            const cachedData = cache.get(key);
            if (cachedData !== undefined) {
                return cachedData;
            }
        } catch (err) {
            console.error(`[Cache Error] Read failed for "${key}", falling back to DB:`, err.message);
        }

        // 2. Fetch fresh data from DB
        const data = await callback();

        // 3. Try saving to cache safely
        try {
            cache.set(key, data, ttl);
        } catch (err) {
            console.error(`[Cache Error] Write failed for "${key}":`, err.message);
        }

        return data; // Return the DB data to user
    }
};

module.exports = cacheService;