import './ServicesSection.css';

import {
  IconAppraisal,
  IconCheck,
  IconDollar,
  IconInspection,
  IconZap,
} from '../../../../components/icons/HomeIcons';

const TRUST_ITEMS = [
  'NAAA-aligned condition reports',
  'Nationwide inspection coverage',
  '48-hour turnaround',
  'Licensed & insured inspectors',
  'Digital photo documentation',
  'Auction-ready reports',
  'VIN verification included',
  'Mobile inspection capability',
];

const SERVICE_METRICS = [
  { value: '500+', label: 'INSPECTIONS COMPLETED' },
  { value: '48HR', label: 'AVG. TURNAROUND' },
  { value: '20+', label: 'SERVICE AREAS' },
  { value: '100%', label: 'DIGITAL ECR DELIVERY' },
];

function ServicesSection() {
  return (
    <section
      id="services"
      className="section section--services section--blueprint home-section"
      style={{ animationDelay: '0.12s' }}
    >
      <div className="section__blueprint-bg blueprint-grid" aria-hidden />
      <div className="section__services-overlay" aria-hidden />

      <div className="container section__content">
        <header className="services-header">
          <p className="section__eyebrow">◈ SPECIFICATIONS</p>
          <h2 className="section__title">
            Our <span className="section__title-accent">Services</span>
          </h2>
        </header>

        <div className="services-grid">
          <article className="service-card service-card--specs service-card--primary">
            <div className="service-card__header">
              <div className="service-card__icon service-card__icon--specs">
                <IconInspection />
              </div>
              <h3 className="service-card__title">EXPERT LEVEL INSPECTIONS</h3>
            </div>
            <p className="service-card__desc">
              We provide expert-level vehicle inspection services with
              Electronic Condition Reports completed at your location by
              experienced, pre-screened inspectors.
            </p>
            <a href="#contact" className="service-card__micro-cta">
              Learn more →
            </a>
          </article>

          <article className="service-card service-card--specs">
            <div className="service-card__header">
              <div className="service-card__icon service-card__icon--specs">
                <IconAppraisal />
              </div>
              <h3 className="service-card__title">ECR INSPECTIONS</h3>
            </div>
            <p className="service-card__desc">
              Inspections include comprehensive paint, body, and mechanical
              review, along with dedicated checks for flood damage and frame
              damage.
            </p>
            <a href="#contact" className="service-card__micro-cta">
              Learn more →
            </a>
          </article>

          <article className="service-card service-card--specs">
            <div className="service-card__header">
              <div className="service-card__icon service-card__icon--specs">
                <IconDollar />
              </div>
              <h3 className="service-card__title">VEHICLE APPRAISALS</h3>
            </div>
            <p className="service-card__desc">
              Reliable condition-based appraisals to support purchasing, resale,
              insurance, auction, and fleet decisions with accuracy and
              confidence.
            </p>
            <a href="#contact" className="service-card__micro-cta">
              Learn more →
            </a>
          </article>

          <article className="service-card service-card--specs">
            <div className="service-card__header">
              <div className="service-card__icon service-card__icon--specs">
                <IconZap />
              </div>
              <h3 className="service-card__title">FAST 48-HOUR TURNAROUND</h3>
            </div>
            <p className="service-card__desc">
              Vehicles are inspected within 48 hours of dispatch. ECRs are
              automatically submitted upon completion so clients receive results
              without delay.
            </p>
            <a href="#contact" className="service-card__micro-cta">
              Learn more →
            </a>
          </article>
        </div>

        <div className="services__foot">
          <p className="services__trust-head">
            TRUSTED BY DEALERS, AUCTIONS, AND FLEET BUYERS
          </p>

          <ul className="services__trust-list">
            {TRUST_ITEMS.map((text) => (
              <li key={text} className="services__trust-item">
                <span className="services__trust-icon" aria-hidden>
                  <IconCheck />
                </span>
                <span className="services__trust-text">{text}</span>
              </li>
            ))}
          </ul>

          <div className="services__metrics" aria-label="Service scale">
            {SERVICE_METRICS.map((metric, index) => (
              <div
                key={metric.label}
                className={`services__metric${
                  index < SERVICE_METRICS.length - 1
                    ? ' services__metric--rule'
                    : ''
                }`}
              >
                <div className="services__metric-value">{metric.value}</div>
                <div className="services__metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="section__bottom-line section__bottom-line--services"
        aria-hidden
      />
    </section>
  );
}

export default ServicesSection;
