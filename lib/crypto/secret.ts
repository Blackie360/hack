// AES-GCM helpers using Web Crypto

export async function encryptAesGcm(keyBytes: Uint8Array, plaintext: Uint8Array, aad?: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad }, key, plaintext);
  return { ciphertext: new Uint8Array(new Uint8Array(enc)), iv };
}

export async function decryptAesGcm(keyBytes: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array, aad?: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);
  const dec = await crypto.subtle.decrypt({ name: "AES-GCM", iv, additionalData: aad }, key, ciphertext);
  return new Uint8Array(new Uint8Array(dec));
}


