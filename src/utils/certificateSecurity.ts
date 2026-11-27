// Pure TypeScript SHA-256 and certificate verification utility
// Zero external dependencies

function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0, j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash: number[] = [];
  let k: number[] = [];
  let primeCounter = 0;

  const isPrime: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isPrime[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isPrime[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii.length % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words.push((asciiBitLength / maxWord) | 0);
  words.push(asciiBitLength);

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];

      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1h + ch + k[i] + w[i]) | 0;
      const s0h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0h + maj) | 0;

      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

const PYVERSE_SECRET_SALT = 'PYVERSE_VERIFIED_CREDENTIAL_KEY_2026_SAIF';

export interface CertificateData {
  certId: string;
  recipientName: string;
  topicId: string;
  topicTitle: string;
  issueDate: string;
  signature: string;
}

export function generateCertId(recipient: string, topicId: string): string {
  const norm = `${recipient.trim().toLowerCase()}-${topicId}-${Date.now().toString(36).slice(-4)}`;
  const hash = sha256(norm);
  const code = hash.substring(0, 4).toUpperCase();
  return `PV-2026-${code}`;
}

export function computeCertSignature(
  certId: string,
  recipientName: string,
  topicId: string,
  issueDate: string
): string {
  const payload = [
    certId.trim().toUpperCase(),
    recipientName.trim().toLowerCase(),
    topicId.trim().toLowerCase(),
    issueDate.trim(),
    PYVERSE_SECRET_SALT,
  ].join('::');

  return sha256(payload).substring(0, 16).toUpperCase();
}

export function verifyCertSignature(
  certId: string,
  recipientName: string,
  topicId: string,
  issueDate: string,
  signature: string
): boolean {
  if (!certId || !recipientName || !topicId || !issueDate || !signature) {
    return false;
  }
  const expected = computeCertSignature(certId, recipientName, topicId, issueDate);
  return expected.toUpperCase() === signature.trim().toUpperCase();
}

export function buildVerificationUrl(
  certId: string,
  recipientName: string,
  topicId: string,
  issueDate: string,
  signature: string
): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://saifahmad-crypto.github.io';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/PyConcept_Web/';
  
  const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const params = new URLSearchParams({
    verify: '1',
    id: certId,
    name: recipientName,
    topic: topicId,
    date: issueDate,
    sig: signature,
  });

  return `${origin}${cleanPath}#/verify?${params.toString()}`;
}

export function parseVerificationFromUrl(): {
  certId: string;
  recipientName: string;
  topicId: string;
  issueDate: string;
  signature: string;
  isValid: boolean;
} | null {
  if (typeof window === 'undefined') return null;

  const urlStr = window.location.href;
  const hash = window.location.hash;
  const search = window.location.search;

  let params: URLSearchParams | null = null;

  if (hash.includes('verify?') || hash.startsWith('#/verify?')) {
    const qIndex = hash.indexOf('?');
    if (qIndex !== -1) {
      params = new URLSearchParams(hash.substring(qIndex + 1));
    }
  } else if (search.includes('verify')) {
    params = new URLSearchParams(search);
  }

  if (!params) return null;

  const id = params.get('id') || '';
  const name = params.get('name') || '';
  const topic = params.get('topic') || '';
  const date = params.get('date') || '';
  const sig = params.get('sig') || '';

  if (!id && !sig) return null;

  const isValid = verifyCertSignature(id, name, topic, date, sig);

  return {
    certId: id,
    recipientName: name,
    topicId: topic,
    issueDate: date,
    signature: sig,
    isValid,
  };
}
