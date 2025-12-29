const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_accessToken",
  REFRESH_TOKEN: "auth_refreshToken",
  THEME: "theme_preference",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function getItem<T = string>(key: StorageKey): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }

    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

function setItem<T>(key: StorageKey, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (typeof value === "string") {
      localStorage.setItem(key, value);
      return;
    }

    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded, attempting cleanup");
    }
  }
}

function removeItem(key: StorageKey): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}

export function clearAuthStorage(): void {
  removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function saveAuthCredentials(
  accessToken: string,
  refreshToken: string
): void {
  setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

export function getStoredAccessToken(): string | null {
  return getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getStoredRefreshToken(): string | null {
  return getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function getStoredCredentials(): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  return {
    accessToken: getStoredAccessToken(),
    refreshToken: getStoredRefreshToken(),
  };
}

export function saveThemePreference(theme: string): void {
  setItem(STORAGE_KEYS.THEME, theme);
}

export function getStoredThemePreference(): string | null {
  return getItem(STORAGE_KEYS.THEME);
}
