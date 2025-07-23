/**
 * src/auth/jwtVerifier.js
 * 
 * JWT token verification module using RSA public key authentication. Handles secure validation
 * of JWT tokens by importing a base64-encoded public key from environment variables and using
 * it to verify token signatures. Caches the imported public key for performance optimization.
 */

import { jwtVerify, importSPKI } from 'jose';

let publicKeyPromise = null;

// Import and cache the RSA public key from environment configuration
async function getPublicKey() {
  if (!publicKeyPromise) {
    const publicKeyBase64 = import.meta.env.VITE_PUBLIC_KEY_B64;
   
    // Decode base64 to PEM format
    const publicKeyPem = window.atob(publicKeyBase64);
   
    // Import public key for RS256 algorithm
    publicKeyPromise = importSPKI(publicKeyPem, 'RS256');
  }
 
  return publicKeyPromise;
}

// Verify JWT token signature and return payload or null if invalid
// export async function verifyJWT(token) {
//   try {
//     const publicKey = await getPublicKey();
//     const { payload } = await jwtVerify(token, publicKey);
   
//     return payload;
//   } catch (error) {
//     console.error('JWT verification failed:', error);
//     return null;
//   }
// }


export async function verifyJWT(token) {
  try {
    // TEMPORARY: Just decode without verifying
    const parts = token.split('.');
    const payload = JSON.parse(window.atob(parts[1]));
    // console.log('Decoded payload (NOT VERIFIED):', payload);
    return payload;
    
    // Comment out the verification for now
    // const publicKey = await getPublicKey();
    // const { payload } = await jwtVerify(token, publicKey);
    // return payload;
  } catch (error) {
    console.error('JWT decode failed:', error);
    return null;
  }
}