import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="message-card">
      <h1>Page not found</h1>
      <p>The page you requested has not been created yet.</p>

      <Link to="/" className="primary-button">
        Return to products
      </Link>
    </section>
  );
}

export default NotFoundPage;