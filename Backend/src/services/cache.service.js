const NodeCache = require("node-cache")

/**
 * In-memory cache service using node-cache.
 * TTL values are in seconds.
 * 
 * Usage:
 *   const cacheService = require("./services/cache.service")
 *   await cacheService.getOrSet("key", () => expensiveOperation(), ttlSeconds)
 */
const cache = new NodeCache({
    stdTTL: 300,          // Default TTL: 5 minutes (in seconds)
    checkperiod: 60,      // Scan for expired keys every 60 seconds
    useClones: false      // Store references to objects for better performance
})

const cacheService = {
    /**
     * Get a value from cache by key.
     * @param {string} key
     * @returns {any | undefined}
     */
    get(key) {
        return cache.get(key)
    },

    /**
     * Set a value in cache with optional TTL.
     * @param {string} key
     * @param {any} value
     * @param {number} ttlSeconds - time to live in seconds (defaults to service default)
     * @returns {boolean}
     */
    set(key, value, ttlSeconds) {
        return cache.set(key, value, ttlSeconds)
    },

    /**
     * Delete a value from cache by key (or array of keys).
     * @param {string|string[]} key
     * @returns {number} number of deleted entries
     */
    del(key) {
        return cache.del(key)
    },

    /**
     * Check if a key exists in cache (and is not expired).
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return cache.has(key)
    },

    /**
     * Get a cached value, or compute and cache it if missing.
     * @param {string} key
     * @param {Function} fallbackFn - async function that computes the value if not cached
     * @param {number} ttlSeconds - time to live in seconds
     * @returns {Promise<any>}
     */
    async getOrSet(key, fallbackFn, ttlSeconds) {
        const cached = cache.get(key)
        if (cached !== undefined) {
            return cached
        }

        const value = await fallbackFn()
        cache.set(key, value, ttlSeconds)
        return value
    },

    /**
     * Flush all cached entries (useful on server restart or for testing).
     */
    flushAll() {
        cache.flushAll()
    },

    /**
     * Get cache statistics (key count, hits, misses, etc.)
     */
    getStats() {
        return cache.getStats()
    }
}

module.exports = cacheService