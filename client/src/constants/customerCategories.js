/**
 * Top-level customer categories for inquiry organization.
 * Used for filtering and quick access from the dashboard.
 */

export const CUSTOMER_CATEGORY_OPTIONS = [
  { value: 'manheim', label: 'Manheim' },
  { value: 'adesa', label: 'ADESA' },
  { value: 'openlane', label: 'OPENLANE' },
  { value: 'americas_auto_auction', label: "America's Auto Auction" },
  { value: 'public_reports', label: 'Public Reports' },
  { value: 'other', label: 'Other' },
];

export function getCategoryLabel(value) {
  if (!value) return '—';
  const option = CUSTOMER_CATEGORY_OPTIONS.find((o) => o.value === value);
  return option?.label ?? value;
}
