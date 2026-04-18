import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main id="main" className="home" style={{ padding: '6rem 1.5rem' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="section__title">Page not found</h1>
        <p className="section__text" style={{ marginBottom: '1.5rem' }}>
          The page you requested does not exist.
        </p>
        <Link className="button" to="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
