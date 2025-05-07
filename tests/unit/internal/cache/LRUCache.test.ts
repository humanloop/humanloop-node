import LRUCache from "../../../../src/cache/LRUCache";

describe("LRUCache", () => {
    let cache: LRUCache<string, number>;

    beforeEach(() => {
        cache = new LRUCache<string, number>(3); // Test with small capacity
    });

    describe("basic operations", () => {
        it("should set and get values", () => {
            cache.set("key1", 1);
            expect(cache.get("key1")).toBe(1);
        });

        it("should return undefined for non-existent keys", () => {
            expect(cache.get("nonexistent")).toBeUndefined();
        });

        it("should handle setting same key multiple times", () => {
            cache.set("key1", 1);
            cache.set("key1", 2);
            expect(cache.get("key1")).toBe(2);
        });
    });

    describe("capacity and eviction", () => {
        it("should evict least recently used item when capacity is reached", () => {
            cache.set("key1", 1);
            cache.set("key2", 2);
            cache.set("key3", 3);
            cache.set("key4", 4); // Should evict key1

            expect(cache.get("key1")).toBeUndefined();
            expect(cache.get("key4")).toBe(4);
        });

        it("should update LRU order on get operations", () => {
            cache.set("key1", 1);
            cache.set("key2", 2);
            cache.set("key3", 3);

            cache.get("key1"); // Make key1 most recently used
            cache.set("key4", 4); // Should evict key2, not key1

            expect(cache.get("key1")).toBe(1);
            expect(cache.get("key2")).toBeUndefined();
        });
    });

    describe("clear operation", () => {
        it("should clear all items from cache", () => {
            cache.set("key1", 1);
            cache.set("key2", 2);
            cache.clear();

            expect(cache.get("key1")).toBeUndefined();
            expect(cache.get("key2")).toBeUndefined();
        });
    });
});
