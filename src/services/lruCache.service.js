/**
 * Custom LRU Cache with Strict TTL
 * 
 * Rules:
 * 1. Strict TTL: If time expires, the item is immediately deleted—even if active.
 * 2. LRU Eviction: When capacity is reached, the least recently used idle item is evicted first.
 * 3. O(1) Operations: Uses JavaScript Map (which maintains insertion order).
 */
class LRUCacheWithTTL {
    constructor(capacity = 500) {
        this.capacity = capacity;
        this.cache = new Map(); // stores: key -> { value, expiresAt }
    }

    /**
     * Read from cache in O(1)
     */
    get(key) {
        try {
            if (!this.cache.has(key)) {
                return undefined;
            }

            const item = this.cache.get(key);

            // RULE 1: STRICT TTL CHECK
            // Even if the user is active right now, if TTL has expired, delete it!
            if (Date.now() > item.expiresAt) {
                this.cache.delete(key);
                return undefined; // signals a cache-miss so fresh DB data is loaded
            }

            // Still valid! Refresh its recency in Map so it doesn't get evicted by LRU
            this.cache.delete(key);
            this.cache.set(key, item);

            return item.value;
        } catch (err) {
            console.error(`[LRU Error] Failed to get "${key}":`, err.message);
            return undefined;
        }
    }

    /**
     * Write to cache in O(1)
     */
    set(key, value, ttlSeconds = 300) {
        try {
            // If the key already exists, delete it so we re-insert at the newest position
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.capacity) {
                // RULE 2: CAPACITY REACHED -> LRU EVICTION
                // In JS Map, keys().next().value gives the oldest (Least Recently Used) key
                const leastRecentlyUsedKey = this.cache.keys().next().value;
                this.cache.delete(leastRecentlyUsedKey);
            }

            // Save with strict expiration timestamp
            this.cache.set(key, {
                value,
                expiresAt: Date.now() + (ttlSeconds * 1000)
            });
        } catch (err) {
            console.error(`[LRU Error] Failed to set "${key}":`, err.message);
        }
    }

    /**
     * Explicit deletion (e.g., when a user updates data or logs out)
     */
    del(key) {
        try {
            this.cache.delete(key);
        } catch (err) {
            console.error(`[LRU Error] Failed to delete "${key}":`, err.message);
        }
    }

    /**
     * Helper to read from cache or fetch from DB fallback
     */
    async getOrSet(key, callback, ttlSeconds = 300) {
        const cachedData = this.get(key);
        if (cachedData !== undefined) {
            return cachedData;
        }

        // Fetch fresh data from MongoDB
        const data = await callback();

        // Save fresh data into LRU cache with fresh TTL
        this.set(key, data, ttlSeconds);

        return data;
    }

    /**
     * Inspect current cache size
     */
    size() {
        return this.cache.size;
    }
}

// Export singleton instance with max capacity of 500 items
const lruCacheService = new LRUCacheWithTTL(500);

module.exports = lruCacheService;