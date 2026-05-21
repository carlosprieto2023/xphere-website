/**
 * Normalize MongoDB URI from env / Render (quotes, BOM, accidental KEY=value in value field).
 */
function normalizeMongoUri(raw) {
  if (raw == null || typeof raw !== 'string') return '';
  let s = raw.trim().replace(/^\uFEFF/, '');
  s = s.replace(/^["']|["']$/g, '').trim();
  const keyVal = /^(?:DATABASE_URL|MONGODB_URI)\s*=\s*(.+)$/i.exec(s);
  if (keyVal) {
    s = keyVal[1].trim().replace(/^["']|["']$/g, '');
  }
  return s.trim();
}

function getMongoUriFromEnv() {
  return normalizeMongoUri(
    process.env.DATABASE_URL || process.env.MONGODB_URI || ''
  );
}

function assertValidMongoUri(uri) {
  if (
    !uri ||
    (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))
  ) {
    return false;
  }
  return true;
}

module.exports = {
  normalizeMongoUri,
  getMongoUriFromEnv,
  assertValidMongoUri,
};
