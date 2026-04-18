import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IconAppraisal,
  IconArrowRight,
  IconClock,
  IconMail,
  IconMapPin,
  IconMessage,
  IconPhone,
  IconService,
  IconShieldCheck,
  IconUser,
} from '../../../../components/icons/HomeIcons';
import { INSPECTION_TYPE_OPTIONS } from '../../../../constants/inquiryOptions';
import { US_CITY_STATE_OPTIONS } from '../../../../data/usCityStateOptions';
import './ContactSection.css';

const LOCATION_SUGGESTION_LIMIT = 10;

function filterCityStateMatches(
  query,
  data,
  limit = LOCATION_SUGGESTION_LIMIT
) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = [];

  for (const row of data) {
    const city = row.city.toLowerCase();
    const state = row.state.toLowerCase();
    const full = `${city}, ${state}`;

    if (q.length === 1) {
      if (!city.startsWith(q) && !state.startsWith(q)) continue;
    } else if (
      !(
        city.startsWith(q) ||
        city.includes(q) ||
        state.startsWith(q) ||
        state.includes(q) ||
        full.includes(q)
      )
    ) {
      continue;
    }

    let score = 0;
    if (city.startsWith(q)) score = 300 - city.length;
    else if (city.includes(q)) score = 150;
    else if (state.startsWith(q)) score = 120;
    else if (state.includes(q)) score = 80;
    else score = 60;

    scored.push({ row, score });
  }

  scored.sort(
    (a, b) => b.score - a.score || a.row.city.localeCompare(b.row.city)
  );

  return scored.slice(0, limit).map((s) => s.row);
}

const CONTACT_TRUST_ITEMS = [
  { id: 'turnaround', label: '48-hour turnaround', Icon: IconClock },
  {
    id: 'naaa',
    label: 'NAAA-compliant inspection reports',
    Icon: IconShieldCheck,
  },
  { id: 'reports', label: 'Detailed condition reports', Icon: IconAppraisal },
];

function ContactSection({
  formData,
  status,
  success,
  successRef,
  onChange,
  onPhoneChange,
  onSubmit,
}) {
  const locationWrapRef = useRef(null);
  const locationOptionRefs = useRef([]);
  const [locationListOpen, setLocationListOpen] = useState(false);
  const [locationActiveIndex, setLocationActiveIndex] = useState(-1);

  const locationSuggestions = useMemo(
    () => filterCityStateMatches(formData.location, US_CITY_STATE_OPTIONS),
    [formData.location]
  );

  const showLocationSuggestions =
    locationListOpen && locationSuggestions.length > 0;

  useEffect(() => {
    if (
      locationActiveIndex >= 0 &&
      locationActiveIndex >= locationSuggestions.length
    ) {
      setLocationActiveIndex(-1);
    }
  }, [locationSuggestions, locationActiveIndex]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        locationWrapRef.current &&
        !locationWrapRef.current.contains(event.target)
      ) {
        setLocationListOpen(false);
        setLocationActiveIndex(-1);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, {
      passive: true,
    });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (
      locationActiveIndex < 0 ||
      !locationOptionRefs.current[locationActiveIndex]
    ) {
      return;
    }

    locationOptionRefs.current[locationActiveIndex].scrollIntoView({
      block: 'nearest',
    });
  }, [locationActiveIndex, showLocationSuggestions]);

  function commitLocationValue(value) {
    onChange({ target: { name: 'location', value } });
    setLocationListOpen(false);
    setLocationActiveIndex(-1);
  }

  function handleLocationInputChange(event) {
    setLocationListOpen(true);
    setLocationActiveIndex(-1);
    onChange(event);
  }

  function handleLocationFocus() {
    setLocationListOpen(true);
  }

  function handleLocationKeyDown(event) {
    const list = locationSuggestions;

    if (!showLocationSuggestions && event.key === 'Escape') {
      setLocationListOpen(false);
      setLocationActiveIndex(-1);
      return;
    }

    if (!showLocationSuggestions || list.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setLocationActiveIndex((i) => (i < list.length - 1 ? i + 1 : i));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setLocationActiveIndex((i) => (i > 0 ? i - 1 : -1));
    } else if (event.key === 'Enter') {
      const idx = locationActiveIndex;
      const row = list[idx];

      if (row) {
        event.preventDefault();
        commitLocationValue(`${row.city}, ${row.state}`);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setLocationListOpen(false);
      setLocationActiveIndex(-1);
    }
  }

  function handleLocationSuggestionPick(row) {
    commitLocationValue(`${row.city}, ${row.state}`);
  }

  return (
    <section
      id="contact"
      className="section section--contact section--blueprint home-section"
      style={{ animationDelay: '0.22s' }}
    >
      <div className="section__blueprint-bg blueprint-grid-fine" aria-hidden />
      <div className="section__contact-overlay" aria-hidden />
      <div className="container section__content">
        <div className="contact-wrapper">
          <div className="contact__intro">
            <header className="contact-header">
              <p className="contact__eyebrow section__eyebrow">◈ CONTACT</p>
              <h2 className="contact__title">
                REQUEST A <span className="section__title-accent">QUOTE</span>
              </h2>
              <p className="contact__lead section__text">
                Independent inspection services with standardized reporting,
                licensed field inspectors, and dispatch coordination designed
                for dealer, auction, and fleet operations.
              </p>
            </header>

            <div className="contact__meta" aria-label="Contact information">
              <span className="contact__meta-item">
                <IconMail />
                <a href="mailto:xphere614@outlook.com">xphere614@outlook.com</a>
              </span>
              <span className="contact__meta-item">
                <IconPhone />
                <a href="tel:+16146325106">(614) 632-5106</a>
              </span>
            </div>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="contact-form__corners" aria-hidden>
              <span className="contact-form__corner contact-form__corner--tl" />
              <span className="contact-form__corner contact-form__corner--tr" />
              <span className="contact-form__corner contact-form__corner--bl" />
              <span className="contact-form__corner contact-form__corner--br" />
            </div>

            {success && (
              <div
                ref={successRef}
                className="form-message form-message--success form-message--banner"
                role="status"
              >
                Request received. We&apos;ll follow up within 1 business day.
              </div>
            )}

            <div className="contact-form__fields">
              <label className="contact-form__field">
                <span className="contact-form__label">
                  <IconUser />
                  Contact name
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={onChange}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="contact-form__field">
                <span className="contact-form__label">
                  <IconMail />
                  Email address
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Work email"
                  value={formData.email}
                  onChange={onChange}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="contact-form__field">
                <span className="contact-form__label">
                  <IconPhone />
                  Phone number
                </span>
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(000) 000-0000"
                  maxLength={14}
                  value={formData.phone}
                  onChange={onPhoneChange}
                />
              </label>

              <div className="contact-form__field">
                <span
                  className="contact-form__label"
                  id="contact-inspection-type-label"
                >
                  <IconService />
                  Inspection type
                </span>

                <div className="contact-form__select-wrap">
                  <select
                    id="contact-service-type-select"
                    name="serviceType"
                    className="contact-form__select"
                    value={formData.serviceType}
                    onChange={onChange}
                    required
                    aria-labelledby="contact-inspection-type-label"
                    aria-describedby="contact-inspection-type-hint"
                  >
                    <option value="" disabled>
                      Select inspection type
                    </option>
                    {INSPECTION_TYPE_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <p
                  id="contact-inspection-type-hint"
                  className="contact-form__field-hint"
                />

                {formData.serviceType === 'other' && (
                  <div className="contact-form__nested-field">
                    <label
                      className="contact-form__nested-label"
                      htmlFor="contact-service-type-detail"
                    >
                      Please describe inspection type
                    </label>
                    <input
                      id="contact-service-type-detail"
                      type="text"
                      name="serviceTypeDetail"
                      value={formData.serviceTypeDetail}
                      onChange={onChange}
                      placeholder="Brief description of what you need"
                      autoComplete="off"
                      required
                      aria-required="true"
                    />
                  </div>
                )}
              </div>

              <label
                className="contact-form__field contact-form__field--full"
                htmlFor="contact-location-input"
              >
                <span className="contact-form__label">
                  <IconMapPin />
                  Location / state
                </span>

                <div
                  className="contact-form__location-wrap"
                  ref={locationWrapRef}
                >
                  <input
                    id="contact-location-input"
                    type="text"
                    name="location"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={showLocationSuggestions}
                    aria-controls="contact-location-listbox"
                    aria-autocomplete="list"
                    aria-activedescendant={
                      showLocationSuggestions && locationActiveIndex >= 0
                        ? `contact-location-opt-${locationActiveIndex}`
                        : undefined
                    }
                    placeholder="City, State"
                    autoComplete="off"
                    value={formData.location}
                    onChange={handleLocationInputChange}
                    onFocus={handleLocationFocus}
                    onKeyDown={handleLocationKeyDown}
                  />

                  {showLocationSuggestions && (
                    <ul
                      id="contact-location-listbox"
                      className="contact-form__location-suggestions"
                      role="listbox"
                    >
                      {locationSuggestions.map((row, index) => {
                        const label = `${row.city}, ${row.state}`;
                        const isActive = index === locationActiveIndex;

                        return (
                          <li
                            key={`${row.city}-${row.state}`}
                            role="presentation"
                          >
                            <button
                              type="button"
                              id={`contact-location-opt-${index}`}
                              ref={(el) => {
                                locationOptionRefs.current[index] = el;
                              }}
                              role="option"
                              aria-selected={isActive}
                              className={`contact-form__location-suggestion${isActive ? ' contact-form__location-suggestion--active' : ''}`}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleLocationSuggestionPick(row)}
                            >
                              {label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </label>

              <label className="contact-form__field contact-form__field--full">
                <span className="contact-form__label">
                  <IconMessage />
                  Inspection request details
                </span>
                <textarea
                  name="message"
                  placeholder="Vehicle type, VIN if available, auction or lot location, timing, and any special requirements."
                  rows={3}
                  value={formData.message}
                  onChange={onChange}
                  required
                />
              </label>
            </div>

            <div className="contact-form__actions">
              <button
                type="submit"
                className="button button--contact-cta"
                disabled={status.loading}
              >
                {status.loading ? 'Submitting...' : 'Submit Request'}
                <IconArrowRight />
              </button>

              <p className="contact-form__reassurance">
                We&apos;ll follow up within 1 business day.
              </p>
            </div>

            <ul
              className="contact__trust"
              role="list"
              aria-label="Trust and credentials"
            >
              {CONTACT_TRUST_ITEMS.map(({ id, label, Icon }) => (
                <li key={id} className="contact__trust-item">
                  <span className="contact__trust-inner">
                    <span className="contact__trust-icon" aria-hidden>
                      <Icon />
                    </span>
                    <span className="contact__trust-label">{label}</span>
                  </span>
                </li>
              ))}
            </ul>

            {status.message && !success && (
              <p
                className={
                  status.error
                    ? 'form-message form-message--error'
                    : 'form-message form-message--success'
                }
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
