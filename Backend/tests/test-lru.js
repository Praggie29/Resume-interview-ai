const lruCache = require("../src/services/lruCache.service");

async function testLRU() {
    console.log("=== 1. TESTING LRU EVICTION (CAPACITY) ===");

    // Let's create a temporary small cache with capacity = 2 to easily see eviction
    const MiniCache = lruCache.constructor;
    const testCache = new MiniCache(2); // capacity of 2 items

    testCache.set("item1", "Data 1", 60);
    testCache.set("item2", "Data 2", 60);
    console.log("Added item1 and item2. Current size:", testCache.size());

    // Access item1 -> this makes item1 MOST RECENTLY USED, and item2 LEAST RECENTLY USED
    testCache.get("item1");
    console.log("Accessed item1 (now item1 is active, item2 is idle)");

    // Add item3 -> Capacity is 2, so it should EVICT item2!
    testCache.set("item3", "Data 3", 60);
    console.log("Added item3 (capacity exceeded, triggered eviction!)");

    console.log("Checking item1:", testCache.get("item1")); // Should be: "Data 1" (Kept!)
    console.log("Checking item2:", testCache.get("item2")); // Should be: undefined (Evicted!)
    console.log("Checking item3:", testCache.get("item3")); // Should be: "Data 3" (Kept!)

    console.log("\n=== 2. TESTING STRICT TTL EXPIRATION ===");
    testCache.set("activeItem", "Important Data", 2); // TTL of 2 seconds
    console.log("Immediate read:", testCache.get("activeItem")); // "Important Data"

    console.log("Waiting 2.5 seconds for TTL to expire...");
    await new Promise((resolve) => setTimeout(resolve, 2500));

    console.log("Read after TTL expired:", testCache.get("activeItem")); // Should be: undefined!
}

testLRU();