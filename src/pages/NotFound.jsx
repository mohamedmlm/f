import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <section className="not-found-page">
        <div className="not-found-card">
          <div className="not-found-badge">404</div>
          <div className="not-found-illustration" aria-hidden="true">
            <span className="not-found-glow" />
            <span className="not-found-shape" />
          </div>
          <h1>هذه الصفحة غير موجودة</h1>
          <p>
            يبدو أنك ضللت الطريق. لنعدك إلى أفضل المنتجات بسرعة.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              العودة للرئيسية
            </Link>
            <Link to="/" className="btn btn-ghost">
              تصفح المتجر
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
