import './MarketsSection.css';

import {
  IconAppraisal,
  IconCar,
  IconDollar,
  IconInspection,
  IconShieldCheck,
  IconUser,
} from '../../../../components/icons/HomeIcons';

const MARKET_SEGMENTS = [
  {
    title: 'DEALER INSPECTIONS',
    desc: 'For franchise and independent dealers.',
    Icon: IconInspection,
  },
  {
    title: 'AUCTION INSPECTIONS',
    desc: 'Pre-sale and post-purchase condition reports.',
    Icon: IconCar,
  },
  {
    title: 'WHOLESALE BUYERS',
    desc: 'Remote purchase verification.',
    Icon: IconDollar,
  },
  {
    title: 'FLEET PURCHASES',
    desc: 'Multi-vehicle acquisition support.',
    Icon: IconShieldCheck,
  },
  {
    title: 'INSURANCE EVALUATIONS',
    desc: 'Condition documentation.',
    Icon: IconAppraisal,
  },
  {
    title: 'PRIVATE BUYERS',
    desc: 'Pre-purchase inspections for individual buyers.',
    Icon: IconUser,
  },
];

function MarketsSection() {
  return (
    <section
      id="markets"
      className="section section--markets section--blueprint section--centered home-section"
      style={{ animationDelay: '0.19s' }}
    >
      <div className="section__blueprint-bg blueprint-grid" aria-hidden />
      <div className="section__markets-overlay" aria-hidden />
      <div className="container section__content">
        <header className="markets__header">
          <p className="markets__eyebrow section__eyebrow">◈ MARKETS</p>
          <h2 className="markets__title section__title">Who We Serve</h2>
          <p className="markets__intro section__text">
            Independent inspections for retail, auction, wholesale, fleet, and
            remote acquisition teams.
          </p>
        </header>
        <div className="markets__grid">
          {MARKET_SEGMENTS.map(({ title, desc, Icon }) => (
            <article
              key={title}
              className="service-card service-card--specs markets__card"
            >
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
          ))}
        </div>
      </div>
      <div
        className="section__bottom-line section__bottom-line--markets"
        aria-hidden
      />
    </section>
  );
}

export default MarketsSection;
