/**
 * Generates a lightweight, non-invasive browser fingerprint by combining a
 * few stable signals (screen size, timezone, language, platform). This is
 * a secondary signal alongside the session cookie for duplicate-vote
 * protection — not used for tracking or identification beyond that.
 */
export function getBrowserFingerprint(): string {
  const parts = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(navigator.hardwareConcurrency || ''),
  ];

  const raw = parts.join('|');

  // Simple, fast string hash (djb2) — no need for crypto-grade hashing here.
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 33) ^ raw.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
