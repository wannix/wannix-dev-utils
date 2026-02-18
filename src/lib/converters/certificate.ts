export interface CertificateInfo {
  type: 'certificate' | 'csr';
  commonName: string;
  organization?: string;
  organizationalUnit?: string;
  country?: string;
  state?: string;
  locality?: string;
  issuer?: {
    commonName: string;
    organization?: string;
    country?: string;
  };
  validFrom?: Date;
  validTo?: Date;
  serialNumber?: string;
  sans?: string[];
  publicKeyAlgorithm?: string;
  signatureAlgorithm?: string;
}

export interface DecodeResult {
  success: boolean;
  info?: CertificateInfo;
  error?: string;
}

function parseDistinguishedName(dn: string): Record<string, string> {
  const result: Record<string, string> = {};
  const parts = dn.split(/,(?=\s*[A-Z]+=)/);
  
  for (const part of parts) {
    const [key, ...valueParts] = part.split('=');
    const value = valueParts.join('=').trim();
    result[key.trim()] = value;
  }
  
  return result;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function parseASN1Length(data: Uint8Array, offset: number): { length: number; bytesRead: number } {
  const firstByte = data[offset];
  if (firstByte < 128) {
    return { length: firstByte, bytesRead: 1 };
  }
  
  const numBytes = firstByte & 0x7f;
  let length = 0;
  for (let i = 0; i < numBytes; i++) {
    length = (length << 8) | data[offset + 1 + i];
  }
  return { length, bytesRead: 1 + numBytes };
}

function extractTextFromASN1(data: Uint8Array, offset: number, length: number): string {
  const bytes = data.slice(offset, offset + length);
  return new TextDecoder().decode(bytes);
}

export function decodeCertificate(pem: string): DecodeResult {
  try {
    const isCert = pem.includes('-----BEGIN CERTIFICATE-----');
    const isCSR = pem.includes('-----BEGIN CERTIFICATE REQUEST-----') || 
                  pem.includes('-----BEGIN NEW CERTIFICATE REQUEST-----');
    
    if (!isCert && !isCSR) {
      return { success: false, error: "Invalid PEM format. Expected CERTIFICATE or CERTIFICATE REQUEST." };
    }
    
    // Extract base64 content
    const base64Match = pem.match(/-----BEGIN[^-]+-----\s*([\s\S]*?)\s*-----END/);
    if (!base64Match) {
      return { success: false, error: "Could not extract certificate data from PEM." };
    }
    
    const base64Data = base64Match[1].replace(/\s/g, '');
    
    // Parse the certificate using Web Crypto API for basic info
    // Since full X.509 parsing is complex, we'll extract common fields
    const info: CertificateInfo = {
      type: isCert ? 'certificate' : 'csr',
      commonName: 'Unknown',
    };
    
    try {
      const arrayBuffer = base64ToArrayBuffer(base64Data);
      const bytes = new Uint8Array(arrayBuffer);
      
      // Simple ASN.1 parsing for common fields
      // Look for common patterns in the DER encoding
      const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      
      // Extract CN from the raw bytes by looking for common patterns
      const cnPatterns = [
        /CN=([^,\/\n\r]+)/i,
        /commonName[^\x00-\x1f]*?([A-Za-z0-9\.\-\s]+)/i,
      ];
      
      for (const pattern of cnPatterns) {
        const match = text.match(pattern);
        if (match) {
          info.commonName = match[1].trim();
          break;
        }
      }
      
      // Try to extract O (Organization)
      const orgMatch = text.match(/O=([^,\/\n\r]+)/i);
      if (orgMatch) info.organization = orgMatch[1].trim();
      
      // Try to extract OU (Organizational Unit)
      const ouMatch = text.match(/OU=([^,\/\n\r]+)/i);
      if (ouMatch) info.organizationalUnit = ouMatch[1].trim();
      
      // Try to extract C (Country)
      const cMatch = text.match(/C=([A-Z]{2})/i);
      if (cMatch) info.country = cMatch[1].toUpperCase();
      
      // Try to extract ST (State)
      const stMatch = text.match(/ST=([^,\/\n\r]+)/i);
      if (stMatch) info.state = stMatch[1].trim();
      
      // Try to extract L (Locality)
      const lMatch = text.match(/L=([^,\/\n\r]+)/i);
      if (lMatch) info.locality = lMatch[1].trim();
      
      // Look for SANs (Subject Alternative Names) - commonly contain DNS:
      const sanMatches = text.matchAll(/DNS:([^\x00-\x1f,]+)/gi);
      const sans: string[] = [];
      for (const match of sanMatches) {
        sans.push(match[1].trim());
      }
      if (sans.length > 0) info.sans = sans;
      
      // For certificates, try to extract issuer
      if (isCert) {
        // This is a simplified extraction
        const issuerCN = text.match(/issuer[^\x00-\x1f]*CN=([^,\/\n\r]+)/i);
        if (issuerCN) {
          info.issuer = { commonName: issuerCN[1].trim() };
        }
      }
      
      // Detect algorithm from content
      if (text.includes('RSA')) info.publicKeyAlgorithm = 'RSA';
      else if (text.includes('EC') || text.includes('ecdsa')) info.publicKeyAlgorithm = 'ECDSA';
      else if (text.includes('Ed25519')) info.publicKeyAlgorithm = 'Ed25519';
      
      if (text.includes('sha256')) info.signatureAlgorithm = 'SHA-256';
      else if (text.includes('sha384')) info.signatureAlgorithm = 'SHA-384';
      else if (text.includes('sha512')) info.signatureAlgorithm = 'SHA-512';
      
    } catch (parseError) {
      // Continue with basic info
    }
    
    return { success: true, info };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to decode certificate" 
    };
  }
}
