import { IconCheck } from '../../../../components/icons/HomeIcons';
import './HeroSection.css';

const TRUST_ITEMS = [
  'Industry-standard reporting',
  '24-hour turnaround',
  'Trusted by auction partners',
  'NAAA condition report guidelines',
];

function handleHeroImageError(event) {
  event.currentTarget.style.display = 'none';
  event.currentTarget
    .closest('.hero__image-stack')
    ?.querySelector('.hero__fallback')
    ?.classList.add('hero__fallback--visible');
}

function HeroSection() {
  return (
    <section id="hero" className="hero hero--blueprint home-section">
      <div className="hero__blueprint-bg blueprint-grid-fine" aria-hidden />
      <div className="hero__gradient-overlay" aria-hidden />

      <div className="hero__corner hero__corner--tl" aria-hidden />
      <div className="hero__corner hero__corner--tr" aria-hidden />
      <div className="hero__corner hero__corner--bl" aria-hidden />
      <div className="hero__corner hero__corner--br" aria-hidden />

      <div className="container hero__container">
        <div className="hero__grid">
          <div className="hero__content">
            <div className="hero__eyebrow-box">
              <p className="hero__eyebrow">◈ Auto Appraisal Services</p>
            </div>

            <h1 className="hero__title font-display">
              Inspect.
              <br />
              <span className="hero__title-accent">Appraise.</span>
              <br />
              Buy with confidence.
            </h1>

            <div className="hero__text">
              <p className="hero__description">
                Professional pre-purchase vehicle inspections and standardized
                condition reports for dealers, auctions, and fleet operators.
              </p>

              <div className="hero__cta">
                <a href="#contact" className="button button--hero">
                  Request Inspection
                </a>
                <a href="#services" className="button button--hero-outline">
                  Learn More
                </a>
              </div>

              <div className="hero__trust-wrapper">
                <ul className="hero__trust" aria-label="Why choose us">
                  {TRUST_ITEMS.map((item) => (
                    <li key={item} className="hero__trust-item">
                      <IconCheck />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="hero__media hero__visual">
            <div className="hero__image-panel">
              <div className="hero__media-glow-depth" aria-hidden />
              <div className="hero__media-glow" aria-hidden />

              <div className="hero__image-frame hero__image-frame--blueprint">
                <div className="hero__image-stack">
                  <img
                    src="/images/hero-inspection.jpeg"
                    alt="Vehicle inspection at auction"
                    className="hero__image hero__image--blueprint"
                    onError={handleHeroImageError}
                  />

                  <div className="hero__fallback" aria-hidden>
                    <div className="hero__fallback-shape hero__fallback-shape--1" />
                    <div className="hero__fallback-shape hero__fallback-shape--2" />
                    <div className="hero__fallback-shape hero__fallback-shape--3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__bottom-line" aria-hidden />
    </section>
  );
}

export default HeroSection;
