export const PRIMARY_NAV_SECTIONS = [
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'vehicles', label: 'Vehicles', href: '#vehicles' },
  { id: 'process', label: 'Process', href: '#process' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'markets', label: 'Markets', href: '#markets' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export function computeActiveSection() {
  const header = document.querySelector('header.navbar');
  const offset = header ? header.getBoundingClientRect().bottom + 8 : 80;
  let current = '';
  for (const { id } of PRIMARY_NAV_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= offset) {
      current = id;
    }
  }
  return current;
}
