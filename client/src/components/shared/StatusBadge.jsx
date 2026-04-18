const STATUS_CLASS = new Set([
  'new',
  'contacted',
  'quoted',
  'scheduled',
  'inspection_in_progress',
  'report_in_progress',
  'report_sent',
  'closed',
]);

function labelForStatus(status) {
  const map = {
    new: 'New',
    contacted: 'Contacted',
    quoted: 'Quoted',
    scheduled: 'Scheduled',
    inspection_in_progress: 'Inspection in progress',
    report_in_progress: 'Report in progress',
    report_sent: 'Report sent',
    closed: 'Closed',
  };
  return map[status] || status || '—';
}

function StatusBadge({ status }) {
  const value = status || 'new';
  const modifier = STATUS_CLASS.has(value) ? value : 'new';
  return (
    <span className={`status-badge status-badge--${modifier}`}>
      {labelForStatus(value)}
    </span>
  );
}

export default StatusBadge;
