import { useEffect, useLayoutEffect } from 'react';

export function useHomeHashScroll(hash) {
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
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
}

/* About only: pixel min-height when #about (Contact grows with content; no viewport frame). */
export function useAboutFramedMinHeight(hash) {
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
}
