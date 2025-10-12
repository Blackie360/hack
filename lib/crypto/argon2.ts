// Argon2 (wasm) is not compatible with Turbopack in some environments.
// As a pragmatic fallback, we use PBKDF2 via WebCrypto to derive a 32-byte KEK.
// Interface remains the same so callers don't change.

export type KekParams = {
  timeCost: number; // ignored in PBKDF2 fallback
  memoryCost: number; // ignored in PBKDF2 fallback
  parallelism: number; // ignored in PBKDF2 fallback
  saltB64: string;
};

export async function deriveKek(passphrase: string, params: KekParams): Promise<Uint8Array> {
  const salt = Uint8Array.from(atob(params.saltB64), (c) => c.charCodeAt(0));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  // Use a high iteration count to compensate (adjust as needed)
  const iterations = Math.max(210_000, params.timeCost * 100_000);
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return new Uint8Array(derivedKey);
}


