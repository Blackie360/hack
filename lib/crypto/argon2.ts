import argon2 from "argon2-browser";

export type KekParams = {
  timeCost: number;
  memoryCost: number;
  parallelism: number;
  saltB64: string;
};

export async function deriveKek(passphrase: string, params: KekParams): Promise<Uint8Array> {
  const salt = Uint8Array.from(atob(params.saltB64), c => c.charCodeAt(0));
  const res = await argon2.hash({
    pass: passphrase,
    salt,
    time: params.timeCost,
    mem: params.memoryCost,
    parallelism: params.parallelism,
    hashLen: 32,
    type: argon2.ArgonType.Argon2id,
  });
  return Uint8Array.from(atob(res.hash64!), c => c.charCodeAt(0));
}


