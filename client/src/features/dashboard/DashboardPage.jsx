import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContacts, getContactStats } from '../../services/api';
import StatusBadge from '../../components/shared/StatusBadge';
import './DashboardPage.css';

function DashboardPage() {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const [list, summary] = await Promise.all([
          getContacts(token, { limit: 50, page: 1 }),
          getContactStats(token),
        ]);
        if (!cancelled) {
          setContacts(list.contacts || []);
          setStats(summary);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load inquiries.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="dashboard">
      <div className="container">
        <header className="dashboard__header">
          <div>
            <h1>Inquiries</h1>
            <p>Open an inquiry to view details, notes, and attachments.</p>
          </div>
        </header>

        {stats ? (
          <div className="dashboard-metrics">
            <div className="dashboard-metrics__card">
              <span className="dashboard-metrics__label">New</span>
              <span className="dashboard-metrics__count">{stats.new}</span>
            </div>
            <div className="dashboard-metrics__card">
              <span className="dashboard-metrics__label">Scheduled</span>
              <span className="dashboard-metrics__count">
                {stats.scheduled}
              </span>
            </div>
            <div className="dashboard-metrics__card">
              <span className="dashboard-metrics__label">In progress</span>
              <span className="dashboard-metrics__count">
                {stats.inspectionInProgress}
              </span>
            </div>
            <div className="dashboard-metrics__card">
              <span className="dashboard-metrics__label">Closed</span>
              <span className="dashboard-metrics__count">{stats.closed}</span>
            </div>
            <div className="dashboard-metrics__card">
              <span className="dashboard-metrics__label">This month</span>
              <span className="dashboard-metrics__count">
                {stats.totalThisMonth}
              </span>
            </div>
          </div>
        ) : null}

        {loading ? <p>Loading…</p> : null}
        {error ? (
          <p role="alert" style={{ color: 'var(--status-new-text, #f87171)' }}>
            {error}
          </p>
        ) : null}

        {!loading && !error ? (
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id}>
                    <td className="dashboard-table__primary">
                      <strong>{c.name}</strong>
                      <br />
                      <span>{c.email}</span>
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : '—'}
                    </td>
                    <td className="dashboard-table__actions">
                      <Link
                        className="dashboard-table__link"
                        to={`/admin/inquiries/${c._id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 ? (
              <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>
                No inquiries yet.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default DashboardPage;
