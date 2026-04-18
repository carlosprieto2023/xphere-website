export function formatLabel(value) {
  if (!value) return 'N/A';
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
