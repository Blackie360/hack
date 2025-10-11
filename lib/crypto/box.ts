import nacl from "tweetnacl";
import { decodeBase64, encodeBase64 } from "./keys";

// Sealed box using nacl.box with ephemeral sender keypair (wrap org key for a recipient)
// We embed nonce at the end of payload to avoid storing it separately: [ephemeralPub | boxed | nonce]
export function sealedBoxEncrypt(recipientPublicKeyB64: string, plaintext: Uint8Array): { payloadB64: string } {
  const recipientPublicKey = decodeBase64(recipientPublicKeyB64);
  const ephemeral = nacl.box.keyPair();
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const boxed = nacl.box(plaintext, nonce, recipientPublicKey, ephemeral.secretKey);
  const payload = new Uint8Array(ephemeral.publicKey.length + boxed.length + nonce.length);
  payload.set(ephemeral.publicKey, 0);
  payload.set(boxed, ephemeral.publicKey.length);
  payload.set(nonce, ephemeral.publicKey.length + boxed.length);
  return { payloadB64: encodeBase64(payload) };
}

export function sealedBoxDecrypt(recipientSecretKeyB64: string, payloadB64: string): Uint8Array | null {
  const recipientSecretKey = decodeBase64(recipientSecretKeyB64);
  const payload = decodeBase64(payloadB64);
  const ephPub = payload.slice(0, nacl.box.publicKeyLength);
  const nonce = payload.slice(payload.length - nacl.box.nonceLength);
  const boxed = payload.slice(nacl.box.publicKeyLength, payload.length - nacl.box.nonceLength);
  const opened = nacl.box.open(boxed, nonce, ephPub, recipientSecretKey);
  return opened || null;
}


