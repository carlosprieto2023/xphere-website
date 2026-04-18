import { Link } from 'react-router-dom';

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <div className="site-footer__brand">
            XPHERE<span className="site-footer__accent"> GRP</span>
          </div>
          <p className="site-footer__copy">
            © {new Date().getFullYear()} Xphere Group
          </p>
        </div>
        <nav className="site-footer__links" aria-label="Footer">
          <a className="site-footer__link" href="#services">
            Services
          </a>
          <a className="site-footer__link" href="#contact">
            Contact
          </a>
          <Link className="site-footer__staff" to="/admin/login">
            Staff
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default SiteFooter;
