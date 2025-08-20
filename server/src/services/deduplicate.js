function stripNonDigits(input) {
  return String(input || '')
    .trim()
    .replace(/[^0-9+]/g, '');
}

function normalizePhone(raw, defaultCountryCode) {
  if (!raw) return null;
  let s = stripNonDigits(raw);
  if (!s) return null;

  if (s.startsWith('00')) {
    s = '+' + s.slice(2);
  }

  if (s.startsWith('+')) {
    const digits = s.replace(/[^0-9]/g, '');
    return '+' + digits;
  }

  // If it starts with a single 0 (local format), attach country code if provided
  if (/^0[0-9]{5,}$/.test(s) && defaultCountryCode) {
    const digits = s.replace(/^0+/, '');
    const cc = String(defaultCountryCode).replace(/[^0-9]/g, '');
    if (!cc) return null;
    return '+' + cc + digits;
  }

  // If it looks like plain national digits and we have a default country code, prefix it
  if (/^[0-9]{7,}$/.test(s) && defaultCountryCode) {
    const cc = String(defaultCountryCode).replace(/[^0-9]/g, '');
    if (!cc) return null;
    return '+' + cc + s;
  }

  // If neither condition matches and no country code, return as digits-only for dedup
  if (/^[0-9]{7,}$/.test(s)) {
    return s; // not E.164 but stable for dedup purposes
  }

  return null;
}

function normalizeAndDeduplicate(contacts, defaultCountryCode) {
  const uniqueSet = new Set();
  const duplicatesMap = {};
  const uniqueContacts = [];

  for (const raw of contacts) {
    const normalized = normalizePhone(raw, defaultCountryCode);
    if (!normalized) continue;
    if (uniqueSet.has(normalized)) {
      if (!duplicatesMap[normalized]) duplicatesMap[normalized] = [];
      duplicatesMap[normalized].push(String(raw));
    } else {
      uniqueSet.add(normalized);
      uniqueContacts.push(normalized);
    }
  }

  return { uniqueContacts, duplicates: duplicatesMap };
}

module.exports = { normalizeAndDeduplicate, normalizePhone };

