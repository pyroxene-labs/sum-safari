// ============================================
// Persistence Service
// Abstract storage for localStorage now, API later
// ============================================

import type { StorageProvider } from "@/types";

const STORAGE_PREFIX = "sum-safari:";

/**
 * LocalStorage implementation of StorageProvider
 */
class LocalStorageProvider implements StorageProvider {
  async save(key: string, data: unknown): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_PREFIX + key, serialized);
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      throw error;
    }
  }

  async load<T>(key: string): Promise<T | null> {
    try {
      const serialized = localStorage.getItem(STORAGE_PREFIX + key);
      if (serialized === null) {
        return null;
      }
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const storage: StorageProvider = new LocalStorageProvider();

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: "settings",
  CURRENT_SESSION: "current-session",
  HIGH_SCORES: "high-scores",
} as const;
