// Organization encryption key management
// ONE shared org key for all team members - enables secret sharing!

let inMemoryOrgKey: Uint8Array | null = null;
let keyMetadata: { orgId: string } | null = null;

export function getOrgKey(): Uint8Array | null {
  return inMemoryOrgKey;
}

export function setOrgKey(key: Uint8Array | null) {
  inMemoryOrgKey = key;
}

export function clearOrgKey() {
  inMemoryOrgKey = null;
  keyMetadata = null;
}

export function getKeyMetadata() {
  return keyMetadata;
}

// Derive ONE shared org key - same for all team members
// This enables secret sharing: User A creates secret → User B can decrypt it!
export async function deriveOrgKey(orgId: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  // ONLY use orgId - same key for everyone in the org
  const data = encoder.encode(`vaultsync:org:${orgId}`);
  
  // Use Web Crypto API to derive a key
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

// Initialize org key from session
export async function initOrgKeyFromSession(userId: string, orgId: string) {
  if (!orgId) {
    return null;
  }
  
  // Derive the SHARED org key (same for all users in this org)
  const key = await deriveOrgKey(orgId);
  setOrgKey(key);
  keyMetadata = { orgId };
  
  return key;
}

