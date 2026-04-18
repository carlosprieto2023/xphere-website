import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    PRIMARY_NAV_SECTIONS,
    computeActiveSection,
} from '../../../constants/navigation';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return undefined;
    }
    function syncActive() {
      setActiveSection(computeActiveSection());
    }
    syncActive();
    window.addEventListener('scroll', syncActive, { passive: true });
    return () => window.removeEventListener('scroll', syncActive);
  }, [location.pathname, location.hash]);
  const token = localStorage.getItem('token');
  const adminData = localStorage.getItem('admin');
  const isAdmin = !!token && !!adminData;

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setMenuOpen(false);
    navigate('/admin/login');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link
          to={isAdmin ? '/admin' : '/'}
          className="navbar__logo"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            const target = isAdmin ? '/admin' : '/';
            navigate(target);
            window.scrollTo(0, 0);
          }}
          aria-label={isAdmin ? 'Go to admin dashboard' : 'Go to home'}
        >
          <span className="logo">
            {isAdmin ? (
              'Xphere Admin'
            ) : (
              <>
                <span>XPHERE</span>
                <span className="navbar__logo-accent"> GRP</span>
              </>
            )}
          </span>
        </Link>

        <button
          type="button"
          className="navbar__hamburger"
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar__hamburger-icon" aria-hidden>
            {menuOpen ? '✕' : '☰'}
          </span>
        </button>

        <div
          id="navbar-menu"
          className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}
        >
          {isAdmin ? (
            <>
              <nav
                className="navbar__nav navbar__nav--center"
                aria-label="Admin"
              >
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `navbar__admin-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) =>
                    `navbar__admin-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Inquiries
                </NavLink>
                <NavLink
                  to="/admin/reports"
                  className={({ isActive }) =>
                    `navbar__admin-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Reports
                </NavLink>
                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    `navbar__admin-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Settings
                </NavLink>
              </nav>
              <div className="navbar__actions">
                <button
                  type="button"
                  className="navbar__logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <nav
                className="navbar__nav navbar__nav--center"
                aria-label="Primary"
              >
                <ul className="navbar__nav-list">
                  {PRIMARY_NAV_SECTIONS.map(({ id, label, href }) => (
                    <li key={id}>
                      <a
                        href={href}
                        className={activeSection === id ? 'active' : undefined}
                        onClick={closeMenu}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="navbar__actions">
                <a
                  href="/#contact"
                  className="button navbar__cta"
                  onClick={closeMenu}
                >
                  Request Inspection
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
