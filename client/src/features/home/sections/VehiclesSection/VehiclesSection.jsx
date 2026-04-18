import './VehiclesSection.css';

import {
  IconCheck,
  IconCommercialVehicle,
  IconExoticCollectorVehicle,
  IconLuxuryVehicle,
  IconPassengerVehicle,
  IconPowersportVehicle,
} from '../../../../components/icons/HomeIcons';

const VEHICLE_TYPES = [
  {
    Icon: IconPassengerVehicle,
    title: 'PASSENGER VEHICLES',
    text: 'Sedans, SUVs, trucks, minivans, and more',
  },
  {
    Icon: IconCommercialVehicle,
    title: 'COMMERCIAL & FLEET VEHICLES',
    text: 'Vans, box trucks, fleet vehicles, and work vehicles',
  },
  {
    Icon: IconPowersportVehicle,
    title: 'POWERSPORT VEHICLES',
    text: 'Motorcycles, ATVs, UTVs, and personal watercraft',
  },
  {
    Icon: IconLuxuryVehicle,
    title: 'LUXURY & PREMIUM VEHICLES',
    text: 'Luxury cars and premium vehicles requiring specialized care',
  },
  {
    Icon: IconExoticCollectorVehicle,
    title: 'EXOTIC & COLLECTOR VEHICLES',
    text: 'Supercars, limited editions, and collector vehicles',
  },
];

const INSPECTION_CAPABILITIES = [
  'Dealer inventory inspections',
  'Auction condition reports',
  'Fleet vehicle inspections',
  'Insurance documentation',
  'Pre-purchase inspections',
];

const TRUST_ITEMS = [
  'NAAA-aligned reporting',
  'Licensed inspectors',
  'Nationwide coverage',
];

function VehiclesSection() {
  return (
    <section
      id="vehicles"
      className="section section--vehicle-coverage section--blueprint home-section"
      style={{ animationDelay: '0.13s' }}
    >
      <div className="section__blueprint-bg blueprint-grid-fine" aria-hidden />
      <div className="section__vehicle-coverage-overlay" aria-hidden />

      <div className="container section__content">
        <div className="vehicle-coverage__grid">
          <div className="vehicle-coverage__intro-column">
            <div className="vehicle-coverage__intro-head">
              <p className="vehicle-coverage__eyebrow section__eyebrow">
                ◈ VEHICLE COVERAGE
              </p>

              <h2 className="vehicle-coverage__title section__title">
                Vehicle Types We{' '}
                <span className="section__title-accent">Inspect</span>
              </h2>

              <p className="vehicle-coverage__text section__text">
                From everyday passenger cars to commercial fleets and specialty
                units, Xphere Group inspects a wide range of vehicle categories
                with consistent standards and condition-report discipline.
              </p>
            </div>

            <div className="vehicle-coverage__intro-body">
              <ul className="vehicle-coverage__list">
                {VEHICLE_TYPES.map(({ Icon, title, text }) => (
                  <li key={title} className="vehicle-coverage__item">
                    <span className="vehicle-coverage__item-icon" aria-hidden>
                      <Icon />
                    </span>

                    <div className="vehicle-coverage__item-body">
                      <h3 className="vehicle-coverage__item-title">{title}</h3>
                      <p className="vehicle-coverage__item-text">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="vehicle-coverage__panel">
            <p className="vehicle-coverage__panel-eyebrow">◈ CAPABILITIES</p>

            <h3 className="vehicle-coverage__panel-title">
              Inspection Capabilities
            </h3>

            <p className="vehicle-coverage__panel-text">
              Operational support built for dealers, auctions, fleets, and
              pre-purchase decision-making.
            </p>

            <ul
              className="vehicle-coverage__capabilities"
              aria-label="Inspection capabilities"
            >
              {INSPECTION_CAPABILITIES.map((item) => (
                <li key={item} className="vehicle-coverage__capability">
                  <span
                    className="vehicle-coverage__capability-icon"
                    aria-hidden
                  >
                    <IconCheck />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="vehicle-coverage__panel-actions">
              <a href="#contact" className="button button--hero">
                REQUEST VEHICLE INSPECTION
              </a>
            </div>

            <ul
              className="vehicle-coverage__panel-trust"
              aria-label="Vehicle inspection trust markers"
            >
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="vehicle-coverage__panel-trust-item">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      <div
        className="section__bottom-line section__bottom-line--vehicle-coverage"
        aria-hidden
      />
    </section>
  );
}

export default VehiclesSection;
