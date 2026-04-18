export const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'inspection_in_progress', label: 'Inspection In Progress' },
  { value: 'report_in_progress', label: 'Report In Progress' },
  { value: 'report_sent', label: 'Report Sent' },
  { value: 'closed', label: 'Closed' },
];

export const ASSIGNED_OPTIONS = [
  '',
  'Carlos',
  'Inspection',
  'Scheduling',
  'Follow Up',
  'Report Writing',
];

export const SERVICE_TYPE_OPTIONS = [
  'vehicle_appraisal',
  'pre_purchase_inspection',
  'condition_report',
  'dealer_inspection',
  'fleet_inspection',
  'other',
];

export const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];

export const LEAD_SOURCE_OPTIONS = [
  'website',
  'email',
  'phone',
  'referral',
  'dealer',
  'auction',
  'other',
];

export const INSPECTION_TYPE_OPTIONS = [
  { value: 'pre_purchase', label: 'Pre-purchase' },
  { value: 'auction', label: 'Auction' },
  { value: 'dealer', label: 'Dealer' },
  { value: 'fleet', label: 'Fleet' },
  { value: 'appraisal', label: 'Appraisal' },
  { value: 'other', label: 'Other' },
];

/** Older values still present on some records — keep in sync with legacy data if needed */
export const LEGACY_INSPECTION_TYPE_OPTIONS = [
  { value: 'vehicle_appraisal', label: 'Vehicle appraisal (legacy)' },
  { value: 'pre_purchase_inspection', label: 'Pre-purchase inspection (legacy)' },
  { value: 'condition_report', label: 'Condition report (legacy)' },
  { value: 'dealer_inspection', label: 'Dealer inspection (legacy)' },
  { value: 'fleet_inspection', label: 'Fleet inspection (legacy)' },
];
