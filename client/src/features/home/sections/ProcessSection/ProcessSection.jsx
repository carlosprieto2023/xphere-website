import { Fragment } from 'react';
import {
  IconFileCheck,
  IconInspection,
  IconSend,
  IconShieldCheck,
} from '../../../../components/icons/HomeIcons';
import './ProcessSection.css';

const STEPS = [
  {
    step: 'STEP 1',
    title: 'Request Inspection',
    desc: 'Submit vehicle details and location.',
    Icon: IconSend,
  },
  {
    step: 'STEP 2',
    title: 'Inspector Assigned',
    desc: 'Certified local inspector scheduled.',
    Icon: IconShieldCheck,
  },
  {
    step: 'STEP 3',
    title: 'Vehicle Evaluation',
    desc: 'Mechanical, cosmetic, and structural inspection.',
    Icon: IconInspection,
  },
  {
    step: 'STEP 4',
    title: 'Report Delivered',
    desc: 'Digital ECR delivered within 48 hours.',
    Icon: IconFileCheck,
  },
];

function ProcessSection() {
  return (
    <section
      id="process"
      className="section section--how section--blueprint home-section"
      style={{ animationDelay: '0.14s' }}
    >
      <div className="section__blueprint-bg blueprint-grid-fine" aria-hidden />
      <div className="section__how-overlay" aria-hidden />

      <div className="container section__content">
        <header className="how-header">
          <p className="section__eyebrow">◈ OPERATIONS</p>
          <h2 className="section__title">
            HOW IT <span className="section__title-accent">WORKS</span>
          </h2>
        </header>

        <div className="how-process">
          {STEPS.map(({ step, title, desc, Icon }, index) => (
            <Fragment key={step}>
              <article className="service-card service-card--specs how-process__card">
                <p className="how-process__step-label">{step}</p>

                <div className="service-card__header">
                  <div
                    className="service-card__icon service-card__icon--specs"
                    aria-hidden
                  >
                    <Icon />
                  </div>
                  <h3 className="service-card__title">{title}</h3>
                </div>

                <p className="service-card__desc">{desc}</p>
              </article>

              {index < STEPS.length - 1 ? (
                <span className="how-process__connector" aria-hidden />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="section__bottom-line" aria-hidden />
    </section>
  );
}

export default ProcessSection;
