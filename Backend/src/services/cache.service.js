const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 300,      // Default TTL: 5 minutes
    checkperiod: 60,  // Remove expired keys every 60 seconds
    maxKeys: 500,     // Prevents RAM memory overflow by capping max items
    useClones: false  // Improves performance by disabling deep object cloning
});

const cacheService = {
    get(key) {
        return cache.get(key);
    },

    set(key, value, ttl = 300) {
        return cache.set(key, value, ttl);
    },

    del(key) {
        return cache.del(key);
    },

    async getOrSet(key, callback, ttl = 300) {
        const cachedData = cache.get(key);

        if (cachedData !== undefined) {
            return cachedData;
        }

        const data = await callback();
        cache.set(key, data, ttl);

        return data;
    }
};

module.exports = cacheService;