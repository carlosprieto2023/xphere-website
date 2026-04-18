import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../../components/shared/StatusBadge';
import {
  CUSTOMER_CATEGORY_OPTIONS,
  getCategoryLabel,
} from '../../constants/customerCategories';
import {
  ASSIGNED_OPTIONS,
  INSPECTION_TYPE_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  LEGACY_INSPECTION_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from '../../constants/inquiryOptions';
import {
  addNote,
  deleteAttachment,
  deleteContact,
  getContactById,
  updateAssignedTo,
  updateContactDetails,
  updateContactStatus,
  uploadAttachment,
} from '../../services/api';
function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteText, setNoteText] = useState('');
  const [assignValue, setAssignValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState('');
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const [detailsForm, setDetailsForm] = useState({
    serviceType: 'other',
    serviceTypeDetail: '',
    priority: 'medium',
    leadSource: 'website',
    customerCategory: 'other',
    scheduledDate: '',
    inspectionDate: '',
    reportDueDate: '',
    reportSentDate: '',
    clientCompany: '',
    location: '',
    quoteAmount: '',
  });

  async function loadContact() {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const data = await getContactById(id, token);
      setContact(data);
      setAssignValue(data.assignedTo || '');

      setDetailsForm({
        serviceType: data.serviceType || 'other',
        serviceTypeDetail: data.serviceTypeDetail || '',
        priority: data.priority || 'medium',
        leadSource: data.leadSource || 'website',
        customerCategory: data.customerCategory || 'other',
        scheduledDate: data.scheduledDate
          ? data.scheduledDate.slice(0, 10)
          : '',
        inspectionDate: data.inspectionDate
          ? data.inspectionDate.slice(0, 10)
          : '',
        reportDueDate: data.reportDueDate
          ? data.reportDueDate.slice(0, 10)
          : '',
        reportSentDate: data.reportSentDate
          ? data.reportSentDate.slice(0, 10)
          : '',
        clientCompany: data.clientCompany || '',
        location: data.location || '',
        quoteAmount: data.quoteAmount ?? '',
      });

      setError('');
    } catch (err) {
      const message = err.message || 'Failed to load inquiry';
      setError(message);

      if (message === 'Unauthorized' || message === 'Invalid token') {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContact();
  }, [id]);

  function handleDetailsChange(event) {
    const { name, value } = event.target;
    setDetailsForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleDetailsSave(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await updateContactDetails(id, detailsForm, token);
      await loadContact();
    } catch (err) {
      setError(err.message || 'Failed to update inquiry details');
    }
  }

  async function handleStatusChange(event) {
    const token = localStorage.getItem('token');
    try {
      await updateContactStatus(id, event.target.value, token);
      await loadContact();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  }

  async function handleAssignBlur() {
    const token = localStorage.getItem('token');
    try {
      await updateAssignedTo(id, assignValue, token);
      await loadContact();
    } catch (err) {
      setError(err.message || 'Failed to update assignment');
    }
  }

  async function handleAddNote(event) {
    event.preventDefault();
    if (!noteText.trim()) return;
    const token = localStorage.getItem('token');
    try {
      await addNote(id, noteText, token);
      setNoteText('');
      await loadContact();
    } catch (err) {
      setError(err.message || 'Failed to add note');
    }
  }

  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem('token');
    setUploading(true);
    try {
      await uploadAttachment(id, file, token);
      await loadContact();
      event.target.value = '';
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteAttachment(attachmentId) {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this file?')) return;
    setDeletingAttachmentId(attachmentId);
    try {
      await deleteAttachment(id, attachmentId, token);
      await loadContact();
    } catch (err) {
      setError(err.message || 'Failed to delete file');
    } finally {
      setDeletingAttachmentId('');
    }
  }

  async function handleDeleteInquiry() {
    const token = localStorage.getItem('token');
    if (
      !window.confirm(
        'Are you sure you want to delete this inquiry? This cannot be undone.'
      )
    )
      return;
    try {
      await deleteContact(id, token);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to delete inquiry');
    }
  }

  if (loading) {
    return (
      <main id="main" className="dashboard">
        <div className="container">
          <div className="dashboard__header">
            <Link to="/admin" className="detail-back-link">
              ← Back to Dashboard
            </Link>
          </div>
          <div className="detail-skeleton">
            <div className="detail-skeleton__hero" />
            <div className="detail-skeleton__line detail-skeleton__line--wide" />
            <div className="detail-skeleton__line" />
          </div>
        </div>
      </main>
    );
  }

  if (!contact) {
    return (
      <main id="main" className="dashboard">
        <div className="container">
          <div className="dashboard__header">
            <Link to="/admin" className="detail-back-link">
              ← Back to Dashboard
            </Link>
          </div>
          <div className="detail-empty">
            <h2 className="detail-empty__title">Inquiry not found</h2>
            <p className="detail-empty__text">
              This inquiry may have been deleted or the link is incorrect.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const createdDate = new Date(contact.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main id="main" className="dashboard">
      <div className="container">
        <header className="detail-header">
          <Link to="/admin" className="detail-back-link">
            ← Back to Dashboard
          </Link>
        </header>

        {error && (
          <div className="detail-error" role="alert">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="detail-error__message">{error}</p>
          </div>
        )}

        <div className="inquiry-detail">
          {/* Hero – primary identity and workflow */}
          <section className="inquiry-hero">
            <div className="inquiry-hero__identity">
              <h1 className="inquiry-hero__name">{contact.name}</h1>
              <div className="inquiry-hero__meta">
                <StatusBadge status={contact.status} />
                <span className="inquiry-hero__meta-item">
                  {contact.assignedTo || 'Unassigned'}
                </span>
                <span className="inquiry-hero__meta-sep">·</span>
                <span className="inquiry-hero__meta-item">{createdDate}</span>
              </div>
            </div>
            <div className="inquiry-hero__actions">
              <label className="inquiry-hero__field">
                <span className="inquiry-hero__label">Status</span>
                <select
                  className="inquiry-hero__select"
                  value={contact.status}
                  onChange={handleStatusChange}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="inquiry-hero__field">
                <span className="inquiry-hero__label">Assigned</span>
                <select
                  className="inquiry-hero__select"
                  value={assignValue}
                  onChange={(e) => setAssignValue(e.target.value)}
                  onBlur={handleAssignBlur}
                >
                  {ASSIGNED_OPTIONS.map((opt) => (
                    <option key={opt || 'unassigned'} value={opt}>
                      {opt || 'Unassigned'}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="inquiry-hero__delete"
                onClick={handleDeleteInquiry}
              >
                Delete
              </button>
            </div>
          </section>

          <div className="inquiry-body">
            <section className="inquiry-main">
              {/* Contact strip */}
              <div className="inquiry-contact">
                <a
                  href={`mailto:${contact.email}`}
                  className="inquiry-contact__item"
                >
                  {contact.email}
                </a>
                {contact.phone && (
                  <>
                    <span className="inquiry-contact__sep">·</span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="inquiry-contact__item"
                    >
                      {contact.phone}
                    </a>
                  </>
                )}
                {(getCategoryLabel(contact.customerCategory) !== '—' ||
                  contact.clientCompany) && (
                  <>
                    <span className="inquiry-contact__sep">·</span>
                    <span className="inquiry-contact__item inquiry-contact__item--muted">
                      {getCategoryLabel(contact.customerCategory) !== '—'
                        ? getCategoryLabel(contact.customerCategory)
                        : contact.clientCompany}
                    </span>
                  </>
                )}
              </div>

              {/* Message */}
              <div className="inquiry-section">
                <h3 className="inquiry-section__title">Message</h3>
                <p className="inquiry-section__content">{contact.message}</p>
              </div>

              {/* Notes */}
              <div className="inquiry-section">
                <h3 className="inquiry-section__title">Notes</h3>
                {contact.notes?.length > 0 ? (
                  <ul className="inquiry-notes">
                    {contact.notes.map((note) => (
                      <li key={note._id} className="inquiry-note">
                        <p className="inquiry-note__text">{note.text}</p>
                        <span className="inquiry-note__meta">
                          {note.createdBy} ·{' '}
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="inquiry-section__empty">No notes yet.</p>
                )}
                <form className="inquiry-note-form" onSubmit={handleAddNote}>
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="inquiry-note-form__input"
                  />
                  <button
                    type="submit"
                    className="button"
                    disabled={!noteText.trim()}
                  >
                    Add
                  </button>
                </form>
              </div>
            </section>

            <aside className="inquiry-sidebar">
              {/* Operational details – collapsible */}
              <div className="inquiry-panel">
                <button
                  type="button"
                  className="inquiry-panel__toggle"
                  onClick={() => setDetailsExpanded(!detailsExpanded)}
                  aria-expanded={detailsExpanded}
                >
                  <h3 className="inquiry-panel__title">Operational details</h3>
                  <svg
                    className={`inquiry-panel__chevron ${detailsExpanded ? 'inquiry-panel__chevron--open' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {detailsExpanded && (
                  <form
                    className="inquiry-panel__content"
                    onSubmit={handleDetailsSave}
                  >
                    <label className="inquiry-detail-field inquiry-detail-field--full">
                      <span>Category</span>
                      <select
                        name="customerCategory"
                        value={detailsForm.customerCategory}
                        onChange={handleDetailsChange}
                      >
                        {CUSTOMER_CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="inquiry-details-grid">
                      <label className="inquiry-detail-field">
                        <span>Inspection type</span>
                        <select
                          name="serviceType"
                          value={detailsForm.serviceType}
                          onChange={handleDetailsChange}
                        >
                          <optgroup label="Current">
                            {INSPECTION_TYPE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Legacy">
                            {LEGACY_INSPECTION_TYPE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </label>
                      <label className="inquiry-detail-field inquiry-detail-field--full">
                        <span>Inspection type detail</span>
                        <input
                          type="text"
                          name="serviceTypeDetail"
                          value={detailsForm.serviceTypeDetail}
                          onChange={handleDetailsChange}
                          placeholder="Required for Other; optional otherwise"
                        />
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Priority</span>
                        <select
                          name="priority"
                          value={detailsForm.priority}
                          onChange={handleDetailsChange}
                        >
                          {PRIORITY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Lead source</span>
                        <select
                          name="leadSource"
                          value={detailsForm.leadSource}
                          onChange={handleDetailsChange}
                        >
                          {LEAD_SOURCE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Client company</span>
                        <input
                          type="text"
                          name="clientCompany"
                          value={detailsForm.clientCompany}
                          onChange={handleDetailsChange}
                          placeholder="Company name (legacy)"
                        />
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Location</span>
                        <input
                          type="text"
                          name="location"
                          value={detailsForm.location}
                          onChange={handleDetailsChange}
                          placeholder="Inspection location"
                        />
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Quote amount</span>
                        <input
                          type="number"
                          name="quoteAmount"
                          value={detailsForm.quoteAmount}
                          onChange={handleDetailsChange}
                          placeholder="0"
                        />
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Scheduled</span>
                        <input
                          type="date"
                          name="scheduledDate"
                          value={detailsForm.scheduledDate}
                          onChange={handleDetailsChange}
                        />
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Inspection</span>
                        <input
                          type="date"
                          name="inspectionDate"
                          value={detailsForm.inspectionDate}
                          onChange={handleDetailsChange}
                        />
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Report due</span>
                        <input
                          type="date"
                          name="reportDueDate"
                          value={detailsForm.reportDueDate}
                          onChange={handleDetailsChange}
                        />
                      </label>
                      <label className="inquiry-detail-field">
                        <span>Report sent</span>
                        <input
                          type="date"
                          name="reportSentDate"
                          value={detailsForm.reportSentDate}
                          onChange={handleDetailsChange}
                        />
                      </label>
                    </div>
                    <button type="submit" className="button">
                      Save details
                    </button>
                  </form>
                )}
              </div>

              {/* Activity */}
              <div className="inquiry-panel">
                <h3 className="inquiry-panel__title">Activity</h3>
                {contact.activities?.length > 0 ? (
                  <ul className="inquiry-activity">
                    {contact.activities.slice(0, 10).map((activity) => (
                      <li key={activity._id} className="inquiry-activity__item">
                        <p>{activity.text}</p>
                        <span className="inquiry-activity__meta">
                          {activity.createdBy} ·{' '}
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="inquiry-panel__empty">No activity yet.</p>
                )}
              </div>

              {/* Attachments */}
              <div className="inquiry-panel">
                <h3 className="inquiry-panel__title">Attachments</h3>
                <label className="inquiry-upload">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="inquiry-upload__input"
                  />
                  <span className="inquiry-upload__label">
                    {uploading ? 'Uploading…' : 'Choose file'}
                  </span>
                </label>
                {contact.attachments?.length > 0 ? (
                  <ul className="inquiry-attachments">
                    {contact.attachments.map((file, i) => (
                      <li key={file._id || i} className="inquiry-attachment">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inquiry-attachment__link"
                        >
                          {file.fileName}
                        </a>
                        <button
                          type="button"
                          className="inquiry-attachment__delete"
                          onClick={() => handleDeleteAttachment(file._id)}
                          disabled={deletingAttachmentId === file._id}
                        >
                          {deletingAttachmentId === file._id ? '…' : 'Remove'}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="inquiry-panel__empty">No attachments.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

export default InquiryDetail;
