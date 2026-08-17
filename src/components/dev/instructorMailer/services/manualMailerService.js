/**
 * src/components/dev/instructorMailer/services/manualMailerService.js
 *
 * API service for the instructor Manual Mailer.
 * Implements the two-call send flow against the backend spec:
 *   1. (optional) open an SSE progress stream at /email-progress/:batchId
 *   2. POST /manual-mailer or /manual-mailer/multi-language with the same batchId
 *
 * The POST blocks server-side until the entire batch is sent (~0.5-1s per
 * recipient), so no axios timeout is set on it. The POST response is the
 * authoritative result; the SSE 'complete' event carries the exact same body
 * and serves as a backup channel if the POST connection dies mid-batch.
 */

import axios from 'axios';
import { reactive } from 'vue';

const apiURL = import.meta.env.VITE_ROOT_API;
const BASE = `${apiURL}/instructorSideData`;

/** Placeholder tokens the backend substitutes (exact match, no whitespace). */
export const SUPPORTED_PLACEHOLDERS = ['STUDENT_NAME', 'FIRST_NAME', 'LAST_NAME'];

/**
 * Shared mailer state across all three form tabs — the spec mandates one
 * batch at a time, so every Send button disables while any batch runs.
 */
export const mailerState = reactive({ sending: false });

/**
 * Scan text fields for {{TOKEN}} occurrences the backend will NOT substitute.
 * Matching is exact — "{{ FIRST_NAME }}" (with spaces) is unknown and would be
 * delivered as literal text, so it must be flagged.
 * @param {Array<string>} texts - subject/body strings to scan
 * @returns {Array<string>} unique unknown tokens, e.g. ["{{EXPERIENCE_NAME}}"]
 */
export function findUnknownTokens(texts) {
  const unknown = new Set();
  for (const text of texts) {
    if (!text) continue;
    for (const match of String(text).matchAll(/\{\{([^{}]*)\}\}/g)) {
      if (!SUPPORTED_PLACEHOLDERS.includes(match[1])) {
        unknown.add(match[0]);
      }
    }
  }
  return [...unknown];
}

// How long to keep waiting on the SSE stream for a backup result after the
// POST connection dies. Refreshed by every stream event: while progress events
// keep arriving the batch is still running, so keep waiting.
const STALL_ACTIVE_MS = 90000; // stream has produced events before
const STALL_SILENT_MS = 10000; // stream never connected (backend fully down)
const STALL_POLL_MS = 5000;

/**
 * Normalize a send-report body ({ message?|error?, total, sent, failed })
 * into the UI result contract.
 */
function normalizeReport(body) {
  if (body && typeof body.total === 'number' && Array.isArray(body.failed)) {
    let status;
    if (body.failed.length === 0) {
      status = 'success';
    } else if (body.sent === 0) {
      status = 'allFailed';
    } else {
      status = 'partial';
    }
    return {
      status,
      total: body.total,
      sent: body.sent,
      failed: body.failed,
      message: body.message || body.error || '',
    };
  }
  return {
    status: 'error',
    total: 0,
    sent: 0,
    failed: [],
    message: (body && (body.error || body.title || body.message)) || 'Unexpected server response.',
  };
}

/**
 * Send a manual-mailer batch with live SSE progress.
 * Never rejects — always resolves to a normalized result:
 *   {
 *     status: 'success' | 'partial' | 'allFailed' | 'error' | 'unknownOutcome',
 *     total: Number, sent: Number,
 *     failed: Array<{ email, error }>,   // raw SMTP messages — render as plain text
 *     message: String
 *   }
 *
 * @param {Object} opts
 * @param {'single'|'multi'} opts.mode - which send endpoint to use
 * @param {Array<Object>} opts.recipients - student objects from the
 *   students-without-*-form endpoints, passed verbatim (extra keys are ignored;
 *   the server derives {{STUDENT_NAME}} from firstName + lastName)
 * @param {Object} opts.content - single: { subject, htmlContent }
 *   multi: { subjectEnglish, htmlContentEnglish, subjectSpanish, htmlContentSpanish }
 * @param {Function} [opts.onProgress] - called with either a full snapshot
 *   { attempted, sent, failedCount, total, lastFailed } or null when live
 *   progress is unavailable (UI should fall back to an indeterminate spinner).
 *   Note: if the component owning the send unmounts, the batch continues
 *   server-side; this promise still resolves and cleans up the stream.
 * @returns {Promise<Object>} normalized result (see above)
 */
export async function sendManualMail({ mode, recipients, content, onProgress = () => {} }) {
  if (mailerState.sending) {
    return {
      status: 'error',
      total: 0,
      sent: 0,
      failed: [],
      message: 'Another email batch is currently sending. Wait for it to finish before starting a new one.',
    };
  }
  mailerState.sending = true;

  // Stream state
  let es = null;
  let completeBody = null;
  let streamDone = false; // complete/unknown/dead — no backup result coming beyond completeBody
  let streamSawActivity = false;
  let lastEventAt = Date.now();
  let wakeWaiter = null;

  const batchId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : null;

  const settleStream = () => {
    streamDone = true;
    if (es) es.close();
    if (wakeWaiter) wakeWaiter();
  };

  // 1. Open the progress stream BEFORE the POST (never gate the send on it)
  if (batchId) {
    es = new EventSource(`${BASE}/email-progress/${batchId}`, { withCredentials: true });
    es.onopen = () => {
      streamSawActivity = true;
      lastEventAt = Date.now();
    };
    es.addEventListener('progress', (e) => {
      streamSawActivity = true;
      lastEventAt = Date.now();
      try {
        const p = JSON.parse(e.data);
        onProgress({
          attempted: p.attempted,
          sent: p.sent,
          failedCount: p.failedCount,
          total: p.total,
          lastFailed: p.lastFailed || null,
        });
      } catch {
        /* malformed frame — ignore, next snapshot repaints */
      }
    });
    es.addEventListener('complete', (e) => {
      try {
        completeBody = JSON.parse(e.data);
      } catch {
        completeBody = null;
      }
      settleStream();
    });
    es.addEventListener('unknown', () => {
      // Server has no info for this batch — drop the bar, trust the POST outcome
      onProgress(null);
      settleStream();
    });
    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        // Permanent pre-open rejection (400/403/503) — browser will not retry
        onProgress(null);
        settleStream();
      }
      // CONNECTING = transient auto-reconnect; snapshots repaint, do nothing
    };
  } else {
    onProgress(null);
  }

  // Wait for the stream to deliver a backup result (or give up when it stalls)
  const waitForStreamResult = () =>
    new Promise((resolve) => {
      const finish = () => {
        clearInterval(stallTimer);
        wakeWaiter = null;
        resolve(completeBody);
      };
      if (streamDone || !es) {
        resolve(completeBody);
        return;
      }
      wakeWaiter = finish;
      const stallTimer = setInterval(() => {
        const stallMs = streamSawActivity ? STALL_ACTIVE_MS : STALL_SILENT_MS;
        if (Date.now() - lastEventAt > stallMs) finish();
      }, STALL_POLL_MS);
    });

  // 2. Send. No timeout — the request legitimately blocks for the whole batch.
  const url = mode === 'multi' ? `${BASE}/manual-mailer/multi-language` : `${BASE}/manual-mailer`;
  const body = { recipients, ...content, ...(batchId ? { batchId } : {}) };

  try {
    const response = await axios.post(url, body);
    return normalizeReport(response.data);
  } catch (error) {
    if (error.response) {
      const data = error.response.data || {};
      // 502 all-failed carries the full report shape — normalize it like a 200
      if (typeof data.total === 'number' && Array.isArray(data.failed)) {
        return normalizeReport(data);
      }
      return {
        status: 'error',
        total: recipients.length,
        sent: 0,
        failed: [],
        message: data.error || data.title || `Send failed (HTTP ${error.response.status}).`,
      };
    }
    // Connection died (server restart, network drop, client timeout) —
    // the batch may still be running server-side. The stream is the backup.
    const backup = await waitForStreamResult();
    if (backup) return normalizeReport(backup);
    return {
      status: 'unknownOutcome',
      total: recipients.length,
      sent: 0,
      failed: [],
      message: '',
    };
  } finally {
    // Always close — also stops the ~2-min post-completion replay reconnects
    if (es) es.close();
    mailerState.sending = false;
  }
}

export default {
  SUPPORTED_PLACEHOLDERS,
  mailerState,
  findUnknownTokens,
  sendManualMail,
};
