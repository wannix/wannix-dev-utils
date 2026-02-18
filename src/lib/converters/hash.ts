export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512';

export interface HashResult {
  success: boolean;
  hash?: string;
  error?: string;
}

// MD5 implementation (not available in Web Crypto API)
function md5(input: string): string {
  function rotateLeft(x: number, n: number): number {
    return (x << n) | (x >>> (32 - n));
  }

  function addUnsigned(x: number, y: number): number {
    const x4 = x & 0x80000000;
    const y4 = y & 0x80000000;
    const x8 = x & 0x40000000;
    const y8 = y & 0x40000000;
    const result = (x & 0x3fffffff) + (y & 0x3fffffff);
    if (x8 & y8) return result ^ 0x80000000 ^ x4 ^ y4;
    if (x8 | y8) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ x4 ^ y4;
      return result ^ 0x40000000 ^ x4 ^ y4;
    }
    return result ^ x4 ^ y4;
  }

  function F(x: number, y: number, z: number): number { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number): number { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number): number { return x ^ y ^ z; }
  function I(x: number, y: number, z: number): number { return y ^ (x | ~z); }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function utf8Encode(str: string): string {
    return unescape(encodeURIComponent(str));
  }

  function wordToHex(value: number): string {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      const byte = (value >>> (i * 8)) & 255;
      hex += ('0' + byte.toString(16)).slice(-2);
    }
    return hex;
  }

  const str = utf8Encode(input);
  const x: number[] = [];
  const strLen = str.length;

  for (let i = 0; i < strLen; i += 4) {
    x.push(
      (str.charCodeAt(i)) |
      (str.charCodeAt(i + 1) << 8) |
      (str.charCodeAt(i + 2) << 16) |
      (str.charCodeAt(i + 3) << 24)
    );
  }

  const bitLen = strLen * 8;
  x[bitLen >> 5] |= 0x80 << (bitLen % 32);
  x[(((bitLen + 64) >>> 9) << 4) + 14] = bitLen;

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;

    a = FF(a, b, c, d, x[k + 0] || 0, 7, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1] || 0, 12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2] || 0, 17, 0x242070db);
    b = FF(b, c, d, a, x[k + 3] || 0, 22, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4] || 0, 7, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5] || 0, 12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6] || 0, 17, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7] || 0, 22, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8] || 0, 7, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9] || 0, 12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10] || 0, 17, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11] || 0, 22, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12] || 0, 7, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13] || 0, 12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14] || 0, 17, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15] || 0, 22, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1] || 0, 5, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6] || 0, 9, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11] || 0, 14, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0] || 0, 20, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5] || 0, 5, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10] || 0, 9, 0x02441453);
    c = GG(c, d, a, b, x[k + 15] || 0, 14, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4] || 0, 20, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9] || 0, 5, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14] || 0, 9, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3] || 0, 14, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8] || 0, 20, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13] || 0, 5, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2] || 0, 9, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7] || 0, 14, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12] || 0, 20, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5] || 0, 4, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8] || 0, 11, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11] || 0, 16, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14] || 0, 23, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1] || 0, 4, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4] || 0, 11, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7] || 0, 16, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10] || 0, 23, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13] || 0, 4, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0] || 0, 11, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3] || 0, 16, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6] || 0, 23, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9] || 0, 4, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12] || 0, 11, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15] || 0, 16, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2] || 0, 23, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0] || 0, 6, 0xf4292244);
    d = II(d, a, b, c, x[k + 7] || 0, 10, 0x432aff97);
    c = II(c, d, a, b, x[k + 14] || 0, 15, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5] || 0, 21, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12] || 0, 6, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3] || 0, 10, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10] || 0, 15, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1] || 0, 21, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8] || 0, 6, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15] || 0, 10, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6] || 0, 15, 0xa3014314);
    b = II(b, c, d, a, x[k + 13] || 0, 21, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4] || 0, 6, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11] || 0, 10, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2] || 0, 15, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9] || 0, 21, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}

async function webCryptoHash(algorithm: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateHash(input: string, algorithm: HashAlgorithm): Promise<HashResult> {
  if (!input) {
    return { success: true, hash: '' };
  }

  try {
    let hash: string;

    switch (algorithm) {
      case 'md5':
        hash = md5(input);
        break;
      case 'sha1':
        hash = await webCryptoHash('SHA-1', input);
        break;
      case 'sha256':
        hash = await webCryptoHash('SHA-256', input);
        break;
      case 'sha384':
        hash = await webCryptoHash('SHA-384', input);
        break;
      case 'sha512':
        hash = await webCryptoHash('SHA-512', input);
        break;
      default:
        return { success: false, error: 'Unknown algorithm' };
    }

    return { success: true, hash };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate hash',
    };
  }
}

export async function generateHMAC(
  input: string,
  key: string,
  algorithm: 'sha256' | 'sha384' | 'sha512'
): Promise<HashResult> {
  if (!input || !key) {
    return { success: true, hash: '' };
  }

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const dataBuffer = encoder.encode(input);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: `SHA-${algorithm.replace('sha', '')}` },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    const hashArray = Array.from(new Uint8Array(signature));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return { success: true, hash };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate HMAC',
    };
  }
}

export const hashAlgorithms: { value: HashAlgorithm; label: string; bits: number }[] = [
  { value: 'md5', label: 'MD5', bits: 128 },
  { value: 'sha1', label: 'SHA-1', bits: 160 },
  { value: 'sha256', label: 'SHA-256', bits: 256 },
  { value: 'sha384', label: 'SHA-384', bits: 384 },
  { value: 'sha512', label: 'SHA-512', bits: 512 },
];
