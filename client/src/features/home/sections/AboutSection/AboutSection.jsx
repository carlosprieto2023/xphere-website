import './AboutSection.css';

import {
  IconAppraisal,
  IconAward,
  IconCheck,
  IconClock,
  IconFileCheck,
  IconMapPin,
  IconShield,
} from '../../../../components/icons/HomeIcons';

const MICRO_TRUST = [
  'NAAA aligned',
  'Licensed inspectors',
  'Nationwide coverage',
];

const FEATURES = [
  {
    Icon: IconAward,
    title: 'CERTIFIED INSPECTORS',
    text: 'Pre-screened, NAAA-certified professionals meeting the highest standards of the automotive inspection industry.',
  },
  {
    Icon: IconMapPin,
    title: 'NORTH AMERICA COVERAGE',
    text: 'Comprehensive service network spanning locations throughout North America for consistent, reliable coverage.',
  },
  {
    Icon: IconClock,
    title: '48-HOUR TURNAROUND',
    text: 'Vehicles inspected within 48 hours of dispatch, with ECRs submitted automatically upon completion.',
  },
  {
    Icon: IconFileCheck,
    title: 'DETAILED ECRS',
    text: 'Comprehensive Electronic Condition Reports covering paint, body, mechanical, flood damage, and frame checks.',
  },
  {
    Icon: IconAppraisal,
    title: 'LEADING ECR SOFTWARE',
    text: 'Experienced with leading Electronic Condition Report platforms used throughout the automotive industry.',
  },
  {
    Icon: IconShield,
    title: 'UNBIASED THIRD-PARTY',
    text: 'Fully independent, third-party inspections delivering objective, reliable results with no conflicts of interest.',
  },
];

function AboutSection() {
  return (
    <section
      id="about"
      className="section section--about section--blueprint home-section"
      style={{ animationDelay: '0.18s' }}
    >
      <div className="section__blueprint-bg blueprint-grid" aria-hidden />

      <div className="section__about-overlay" aria-hidden />

      <div className="container section__content">
        <div className="about__grid">
          <div className="about__intro">
            <p className="about__eyebrow section__eyebrow">◈ ABOUT US</p>

            <h2 className="about__title section__title">
              Built on
              <br />
              <span className="section__title-accent">Accuracy</span>
              <br />
              and
              <span className="section__title-accent"> Trust</span>
            </h2>

            <p className="about__text section__text">
              Xphere operates as an inspection platform for automotive
              professionals: certified field inspectors, structured ECR
              workflows, and third-party objectivity you can defend in a
              deal—whether you buy at auction, run a lot, or procure fleet units
              nationwide.
            </p>

            <div className="about__actions">
              <a href="#contact" className="button button--hero">
                GET STARTED
              </a>
            </div>

            <ul
              className="about__micro-trust"
              aria-label="Credentials at a glance"
            >
              {MICRO_TRUST.map((label) => (
                <li key={label} className="about__micro-trust-item">
                  <span className="about__micro-trust-icon" aria-hidden>
                    <IconCheck />
                  </span>

                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="about__features">
            {FEATURES.map(({ Icon, title, text }) => (
              <article key={title} className="about__card">
                <span className="about__card-icon" aria-hidden>
                  <Icon />
                </span>

                <h3 className="about__card-title">{title}</h3>

                <p className="about__card-text">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div
        className="section__bottom-line section__bottom-line--about"
        aria-hidden
      />
    </section>
  );
}

export default AboutSection;
