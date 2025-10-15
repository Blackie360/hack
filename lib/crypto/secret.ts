// AES-GCM helpers using Web Crypto

export async function encryptAesGcm(keyBytes: Uint8Array, plaintext: Uint8Array, aad?: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", keyBytes as BufferSource, { name: "AES-GCM" }, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const algorithmParams: AesGcmParams = aad 
    ? { name: "AES-GCM", iv, additionalData: aad }
    : { name: "AES-GCM", iv };
  const enc = await crypto.subtle.encrypt(
    algorithmParams,
    key,
    plaintext as BufferSource
  );
  return { ciphertext: new Uint8Array(enc), iv };
}

export async function decryptAesGcm(keyBytes: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array, aad?: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", keyBytes as BufferSource, { name: "AES-GCM" }, false, ["decrypt"]);
  const algorithmParams: AesGcmParams = aad 
    ? { name: "AES-GCM", iv, additionalData: aad }
    : { name: "AES-GCM", iv };
  const dec = await crypto.subtle.decrypt(
    algorithmParams,
    key,
    ciphertext as BufferSource
  );
  return new Uint8Array(dec);
}


