import './HomePage.css';
import './ReducedMotion.css';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { submitContactForm } from '../../services/api';
import AboutSection from './sections/AboutSection/AboutSection';
import ContactSection from './sections/ContactSection/ContactSection';
import HeroSection from './sections/HeroSection/HeroSection';
import './HomeResponsive.css';
import MarketsSection from './sections/MarketsSection/MarketsSection';
import ProcessSection from './sections/ProcessSection/ProcessSection';
import ServicesSection from './sections/ServicesSection/ServicesSection';
import SiteFooter from './SiteFooter';
import VehicleCoverageSection from './VehicleCoverageSection';

/** US phone display: strip non-digits, cap at 10, then format. */
function formatUsPhoneInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const len = digits.length;
  if (len === 0) return '';
  if (len <= 3) return `(${digits}`;
  if (len <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function HomePage() {
  const { hash } = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    serviceTypeDetail: '',
    location: '',
    message: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    message: '',
    error: false,
  });
  const [success, setSuccess] = useState(false);
  const successRef = useRef(null);

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';

    /*
     * About: start (framed section + scroll-margin).
     * Contact: center — long form + CTA + trust row stay in view far more often than block:start.
     * Services / Vehicles: center tall stacks.
     */
    const block =
      id === 'about'
        ? 'start'
        : id === 'contact'
          ? 'center'
          : id === 'services' || id === 'vehicles'
            ? 'center'
            : 'start';
    el.scrollIntoView({
      behavior,
      block,
      inline: 'nearest',
    });
  }, [hash]);

  /* About only: pixel min-height when #about (Contact grows with content; no viewport frame). */
  useLayoutEffect(() => {
    const about = document.getElementById('about');

    const syncAboutFrame = () => {
      const raw = window.location.hash.replace(/^#/, '');
      const nav = document.querySelector('header.navbar');
      const navH = nav ? Math.round(nav.getBoundingClientRect().height) : 0;
      const px = Math.max(320, window.innerHeight - navH);

      if (!about) return;
      if (raw === 'about') {
        about.style.setProperty('--about-framed-min-height', `${px}px`);
      } else {
        about.style.removeProperty('--about-framed-min-height');
      }
    };

    syncAboutFrame();
    window.addEventListener('resize', syncAboutFrame);
    return () => {
      window.removeEventListener('resize', syncAboutFrame);
      about?.style.removeProperty('--about-framed-min-height');
    };
  }, [hash]);

  useEffect(() => {
    if (success && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [success]);

  function handleChange(event) {
    setSuccess(false);
    const { name, value } = event.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'serviceType' && value !== 'other') {
        next.serviceTypeDetail = '';
      }
      return next;
    });
  }

  function handlePhoneChange(event) {
    setSuccess(false);
    const formatted = formatUsPhoneInput(event.target.value);
    setFormData((prev) => ({
      ...prev,
      phone: formatted,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus({
      loading: true,
      message: '',
      error: false,
    });

    try {
      await submitContactForm(formData);

      setStatus({
        loading: false,
        message: '',
        error: false,
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        serviceTypeDetail: '',
        location: '',
        message: '',
      });
      setSuccess(true);
    } catch (error) {
      setStatus({
        loading: false,
        message: error.message || 'Something went wrong.',
        error: true,
      });
    }
  }

  return (
    <main id="main" className="home">
      <HeroSection />
      <ServicesSection />
      <VehicleCoverageSection />
      <ProcessSection />
      <AboutSection />
      <MarketsSection />
      <ContactSection
        formData={formData}
        status={status}
        success={success}
        successRef={successRef}
        onChange={handleChange}
        onPhoneChange={handlePhoneChange}
        onSubmit={handleSubmit}
      />
      <SiteFooter />
    </main>
  );
}

export default HomePage;
