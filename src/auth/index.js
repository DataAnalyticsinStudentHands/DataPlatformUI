import { jwtVerify, importSPKI } from 'jose';

let publicKeyPromise = null;

async function getPublicKey() {
  if (!publicKeyPromise) {
    const publicKeyBase64 = import.meta.env.VITE_PUBLIC_KEY_B64;
    // Decode base64 to PEM format
    const publicKeyPem = window.atob(publicKeyBase64);
    publicKeyPromise = importSPKI(publicKeyPem, 'RS256');
  }
  return publicKeyPromise;
}

export async function verifyJWT(token) {
  try {
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(token, publicKey);
    return payload; // Returns the verified claims
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
