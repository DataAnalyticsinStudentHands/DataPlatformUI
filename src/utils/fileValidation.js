/**
 * src/utils/fileValidation.js
 *
 * Centralized file upload validation — extension, size, and magic-number checks.
 * Constraints mirror the backend per-endpoint limits so users get fast feedback
 * before a network round-trip.
 */

// ---------------------------------------------------------------------------
// Per-endpoint constraints (keep in sync with backend multer configs)
// ---------------------------------------------------------------------------

export const UPLOAD_CONSTRAINTS = {
  sharepoint: {
    extensions: [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.jpg', '.jpeg', '.png', '.webp', '.txt', '.csv', '.tsv',
    ],
    maxSizeMb: 50,
  },
  clowder: {
    extensions: [
      '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.pdf', '.jpg', '.jpeg', '.png', '.txt', '.csv', '.tsv',
    ],
    maxSizeMb: 100,
  },
  avatar: {
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMb: 2,
  },
  poster: {
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'],
    maxSizeMb: 32,
  },
  heroImage: {
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMb: 10,
  },
};

// Extensions that should be verified via magic-number check
const IMAGE_PDF_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf',
]);

// ---------------------------------------------------------------------------
// Individual validators
// ---------------------------------------------------------------------------

/**
 * Check file size against a megabyte limit.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateFileSize(file, maxSizeMb) {
  if (file.size > maxSizeMb * 1024 * 1024) {
    return { valid: false, error: `File exceeds the ${maxSizeMb} MB limit.` };
  }
  return { valid: true, error: null };
}

/**
 * Check file extension against an allow-list.
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateFileExtension(file, allowedExtensions) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `File type ${ext} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`,
    };
  }
  return { valid: true, error: null };
}

/**
 * Read the first bytes of a file and return the detected type based on
 * magic-number signatures.  Returns null for unknown types (the backend
 * will make the final call).
 *
 * @param {File} file
 * @returns {Promise<string|null>} 'jpeg' | 'png' | 'gif' | 'pdf' | 'webp' | null
 */
export async function validateImageSignature(file) {
  if (file.size < 4) return null;

  const header = new Uint8Array(await file.slice(0, 4).arrayBuffer());

  // JPEG: FF D8 FF
  if (header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) return 'jpeg';
  // PNG: 89 50 4E 47
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) return 'png';
  // GIF: 47 49 46 ("GIF")
  if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) return 'gif';
  // PDF: 25 50 44 46 ("%PDF")
  if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) return 'pdf';

  // WebP: bytes 8-11 are "WEBP"
  if (file.size >= 12) {
    const riff = new Uint8Array(await file.slice(8, 12).arrayBuffer());
    const tag = String.fromCharCode(riff[0], riff[1], riff[2], riff[3]);
    if (tag === 'WEBP') return 'webp';
  }

  return null;
}

// Map detected signature → acceptable extensions
const SIGNATURE_TO_EXTENSIONS = {
  jpeg: ['.jpg', '.jpeg'],
  png:  ['.png'],
  gif:  ['.gif'],
  pdf:  ['.pdf'],
  webp: ['.webp'],
};

// ---------------------------------------------------------------------------
// Combined validator
// ---------------------------------------------------------------------------

/**
 * Run all validations for a given endpoint constraint key.
 * Magic-number check only runs for image/PDF extensions.
 *
 * @param {File} file
 * @param {string} constraintKey - key in UPLOAD_CONSTRAINTS
 * @returns {Promise<{ valid: boolean, errors: string[] }>}
 */
export async function validateUpload(file, constraintKey) {
  const constraints = UPLOAD_CONSTRAINTS[constraintKey];
  if (!constraints) {
    return { valid: false, errors: [`Unknown upload type: ${constraintKey}`] };
  }

  const errors = [];

  // 1. Extension check
  const extResult = validateFileExtension(file, constraints.extensions);
  if (!extResult.valid) errors.push(extResult.error);

  // 2. Size check
  const sizeResult = validateFileSize(file, constraints.maxSizeMb);
  if (!sizeResult.valid) errors.push(sizeResult.error);

  // 3. Magic-number check (only for image/PDF extensions)
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (extResult.valid && IMAGE_PDF_EXTENSIONS.has(ext)) {
    const detectedType = await validateImageSignature(file);
    if (detectedType !== null) {
      // We got a positive detection — make sure it matches the claimed extension
      const acceptableExts = SIGNATURE_TO_EXTENSIONS[detectedType] || [];
      if (!acceptableExts.includes(ext)) {
        errors.push(
          `File content appears to be ${detectedType.toUpperCase()}, but the extension is ${ext}. Please use the correct file extension.`
        );
      }
    } else {
      // Could not identify the file content at all
      errors.push(
        `File content does not match the expected type for a ${ext} file. The file may be corrupted or renamed.`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Backend error parser
// ---------------------------------------------------------------------------

/**
 * Extract the user-facing error string from an Axios error response.
 * Handles both multer rejections (key: `message`) and content-validation
 * rejections (key: `error`).
 *
 * @param {Error} axiosError
 * @param {string} [fallback='File upload failed.']
 * @returns {string}
 */
export function parseUploadError(axiosError, fallback = 'File upload failed.') {
  const data = axiosError?.response?.data;
  if (data) {
    return data.error || data.message || fallback;
  }
  return fallback;
}
