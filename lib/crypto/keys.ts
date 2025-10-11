import nacl from "tweetnacl";

export type DeviceKeypair = {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
};

export function generateDeviceKeypair(): DeviceKeypair {
  const kp = nacl.box.keyPair();
  return { publicKey: kp.publicKey, secretKey: kp.secretKey };
}

export function encodeBase64(bytes: Uint8Array): string {
  if (typeof window === "undefined") return Buffer.from(bytes).toString("base64");
  return btoa(String.fromCharCode(...bytes));
}

export function decodeBase64(b64: string): Uint8Array {
  if (typeof window === "undefined") return new Uint8Array(Buffer.from(b64, "base64"));
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function exportPublicKeyB64(kp: DeviceKeypair): string {
  return encodeBase64(kp.publicKey);
}

export function exportSecretKeyB64(kp: DeviceKeypair): string {
  return encodeBase64(kp.secretKey);
}


