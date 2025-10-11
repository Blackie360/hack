// Simple client-side storage for unlock state and device keypair
// NOTE: In v1 we avoid persisting org key; keep in memory only.

import { DeviceKeypair, generateDeviceKeypair, exportPublicKeyB64, exportSecretKeyB64 } from "./keys";

let inMemoryOrgKey: Uint8Array | null = null;

const DEVICE_KEYS_STORAGE_KEY = "vaultsync.device_keys";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getOrgKey(): Uint8Array | null {
  return inMemoryOrgKey;
}

export function setOrgKey(key: Uint8Array | null) {
  inMemoryOrgKey = key;
}

export function getOrCreateDeviceKeypair(): { publicKeyB64: string; secretKeyB64: string } | null {
  if (!isBrowser()) return null;
  const existing = window.localStorage.getItem(DEVICE_KEYS_STORAGE_KEY);
  if (existing) return JSON.parse(existing);
  const kp: DeviceKeypair = generateDeviceKeypair();
  const stored = {
    publicKeyB64: exportPublicKeyB64(kp),
    secretKeyB64: exportSecretKeyB64(kp),
  };
  window.localStorage.setItem(DEVICE_KEYS_STORAGE_KEY, JSON.stringify(stored));
  return stored;
}

export function getDeviceKeypair(): { publicKeyB64: string; secretKeyB64: string } | null {
  if (!isBrowser()) return null;
  const existing = window.localStorage.getItem(DEVICE_KEYS_STORAGE_KEY);
  return existing ? JSON.parse(existing) : null;
}


