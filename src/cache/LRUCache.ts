/**
 * LRU Cache implementation
 */
export default class LRUCache<K, V> {
    private cache: Map<K, V>;
    private readonly maxSize: number;

    constructor(maxSize: number) {
        this.cache = new Map<K, V>();
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        if (!this.cache.has(key)) {
            return undefined;
        }

        // Get the value
        const value = this.cache.get(key);
        
        // Remove key and re-insert to mark as most recently used
        this.cache.delete(key);
        this.cache.set(key, value!);

        return value;
    }

    set(key: K, value: V): void {
        // If key already exists, refresh its position
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        // If cache is full, remove the least recently used item (first item in the map)
        else if (this.cache.size >= this.maxSize) {
            const lruKey = this.cache.keys().next().value;
            if (lruKey) {
                this.cache.delete(lruKey);
            }
        }

        // Add new key-value pair
        this.cache.set(key, value);
    }

    clear(): void {
        this.cache.clear();
    }
}
