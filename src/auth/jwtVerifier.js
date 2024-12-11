// jwtVerifier.js
// Handles JWT verification using a public key for authentication.

import { jwtVerify, importSPKI } from 'jose';

let publicKeyPromise = null;

async function getPublicKey() {
  if (!publicKeyPromise) {
    const publicKeyBase64 = import.meta.env.VITE_PUBLIC_KEY_B64;
    
    // Convert the public key from base64 to PEM
    const publicKeyPem = window.atob(publicKeyBase64);
    
    // Import the public key in the correct format (RS256 algorithm)
    publicKeyPromise = importSPKI(publicKeyPem, 'RS256');
  }
  
  return publicKeyPromise;
}

export async function verifyJWT(token) {
  try {
    // Get the public key and verify the token
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(token, publicKey);
    
    return payload;
  } catch (error) {
    // Log any issues with token verification
    console.error('JWT verification failed:', error);
    return null;
  }
}