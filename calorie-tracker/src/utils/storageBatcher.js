/**
 * localStorage Write Batcher
 * Batches multiple localStorage writes to reduce INP impact from synchronous operations
 */

let pendingWrites = new Map();
let batchTimeout = null;
const BATCH_DELAY = 16; // ~1 frame at 60fps

/**
 * Schedule a localStorage write to be batched
 * @param {string} key - The localStorage key
 * @param {*} value - The value to store (will be JSON.stringified)
 */
export function batchedSetItem(key, value) {
  pendingWrites.set(key, value);

  if (batchTimeout) {
    clearTimeout(batchTimeout);
  }

  batchTimeout = setTimeout(() => {
    flushWrites();
  }, BATCH_DELAY);
}

/**
 * Schedule a localStorage removal to be batched
 * @param {string} key - The localStorage key to remove
 */
export function batchedRemoveItem(key) {
  pendingWrites.set(key, null);

  if (batchTimeout) {
    clearTimeout(batchTimeout);
  }

  batchTimeout = setTimeout(() => {
    flushWrites();
  }, BATCH_DELAY);
}

/**
 * Immediately flush all pending writes
 * Useful when user is navigating away or closing the app
 */
export function flushWrites() {
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }

  if (pendingWrites.size === 0) return;

  // Perform all writes in a single batch
  pendingWrites.forEach((value, key) => {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });

  pendingWrites.clear();
}

/**
 * Get a value from localStorage, checking pending writes first
 * @param {string} key - The localStorage key
 * @returns {*} The parsed value, or null if not found
 */
export function batchedGetItem(key) {
  // Check pending writes first (most recent value)
  if (pendingWrites.has(key)) {
    const value = pendingWrites.get(key);
    return value === null ? null : value;
  }

  // Fall back to localStorage
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

// Flush on page unload to ensure data is saved
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushWrites);
  window.addEventListener('pagehide', flushWrites);
}
