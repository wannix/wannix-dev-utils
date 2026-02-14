export type HashAlgorithm = "MD5" | "SHA1" | "SHA256" | "SHA512" | "RIPEMD160";

export interface HashState {
  input: string;
  algorithm: HashAlgorithm;
  hmacEnabled: boolean;
  hmacKey: string;
  output: string;
  error: string | null;
}
