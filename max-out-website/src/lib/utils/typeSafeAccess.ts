/**
 * Type-safe utility functions for dynamic object access
 * Solves the recurring TypeScript indexing errors across the codebase
 */

/**
 * Safe object key access with type checking
 */
export function safeKeyAccess<T extends Record<string, any>>(
  obj: T,
  key: string,
  defaultValue?: T[keyof T]
): T[keyof T] | undefined {
  if (key in obj) {
    return obj[key as keyof T];
  }
  return defaultValue;
}

/**
 * Type guard for checking if a key exists in an object
 */
export function hasKey<T extends Record<string, any>>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return key in obj;
}

/**
 * Safe nested object access
 */
export function safeNestedAccess<T>(
  obj: any,
  path: string[],
  defaultValue?: T
): T | undefined {
  let current = obj;
  
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current as T;
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Normalize object keys from snake_case to camelCase
 */
export function normalizeKeys<T extends Record<string, any>>(obj: T): any {
  const normalized: any = {};
  
  for (const key in obj) {
    const normalizedKey = snakeToCamel(key);
    const value = obj[key];
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      normalized[normalizedKey] = normalizeKeys(value);
    } else {
      normalized[normalizedKey] = value;
    }
  }
  
  return normalized;
}

/**
 * Create a type-safe accessor function for a specific object
 */
export function createTypeSafeAccessor<T extends Record<string, any>>(obj: T) {
  return function access<K extends keyof T>(
    key: string,
    defaultValue?: T[K]
  ): T[K] | undefined {
    if (hasKey(obj, key)) {
      return obj[key];
    }
    return defaultValue;
  };
}