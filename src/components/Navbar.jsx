import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fileUrl } from "../api/client";

export default function Navbar() {
  const { user, token, logout, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  const [menuOpen, setMenuOpen] = useState(false);

  /* ================= Theme ================= */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ================= Body scroll lock ================= */
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  /* ================= Close on navigation ================= */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ================= Handlers ================= */
  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleMenu = () => setMenuOpen((c) => !c);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ============================================================ */}
      {/* ======================== NAVBAR ============================= */}
      {/* ============================================================ */}
      <header className="navbar">
        <div className="container navbar-inner">

          {/* Brand */}
          <button
            type="button"
            className="brand"
            onClick={() => handleNavigate("/")}
            aria-label="الذهاب إلى المتجر"
          >
            <span className="brand-mark">C</span>
            <span className="brand-name">Crocs Store</span>
          </button>

          {/* Desktop Links */}
          <nav className="nav-links">
            <button
              type="button"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => handleNavigate("/")}
            >
              المتجر
            </button>
            <button
              type="button"
              className={`nav-link ${isActive("/purchases") ? "active" : ""}`}
              onClick={() => handleNavigate("/purchases")}
            >
              مشترياتي
            </button>
            {isStaff && (
              <button
                type="button"
                className={`nav-link ${isActive("/admin") ? "active" : ""}`}
                onClick={() => handleNavigate("/admin")}
              >
                لوحة التحكم
              </button>
            )}
          </nav>

          {/* Desktop User */}
          <div className="nav-user">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="تغيير المظهر"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {token ? (
              <>
                <button
                  type="button"
                  className="nav-profile"
                  onClick={() => handleNavigate("/profile")}
                >
                  <img
                    className="nav-avatar"
                    src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                    alt="الملف الشخصي"
                  />
                  <span className="nav-username">{user?.name || "..."}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleNavigate("/login")}
                >
                  دخول
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleNavigate("/register")}
                >
                  حساب جديد
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* ==================== MOBILE BOTTOM NAV ====================== */}
      {/* ============================================================ */}
      <nav className="mobile-bottom-nav">
        <button
          type="button"
          className={`bottom-nav-item ${isActive("/") ? "active" : ""}`}
          onClick={() => handleNavigate("/")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>المتجر</span>
        </button>

        <button
          type="button"
          className={`bottom-nav-item ${isActive("/purchases") ? "active" : ""}`}
          onClick={() => handleNavigate("/purchases")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>مشترياتي</span>
        </button>

        {token ? (
          <button
            type="button"
            className={`bottom-nav-item ${isActive("/profile") ? "active" : ""}`}
            onClick={() => handleNavigate("/profile")}
          >
            <img
              className="bottom-nav-avatar"
              src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
              alt="حسابي"
            />
            <span>حسابي</span>
          </button>
        ) : (
          <button
            type="button"
            className={`bottom-nav-item ${isActive("/login") ? "active" : ""}`}
            onClick={() => handleNavigate("/login")}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>دخول</span>
          </button>
        )}

        <button
          type="button"
          className={`bottom-nav-item ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" />
          </svg>
          <span>المزيد</span>
        </button>
      </nav>

      {/* ============================================================ */}
      {/* ==================== BOTTOM SHEET =========================== */}
      {/* ============================================================ */}
      <div
        className={`mobile-sheet-overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`mobile-sheet ${menuOpen ? "active" : ""}`}>
        <div className="sheet-handle" />

        {token ? (
          <>
            <div className="sheet-profile">
              <img
                className="sheet-avatar"
                src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                alt={user?.name}
              />
              <div className="sheet-user-info">
                <span className="sheet-user-name">{user?.name || "..."}</span>
                <span className="sheet-user-email">{user?.email}</span>
              </div>
            </div>

            <div className="sheet-links">
              <button
                className="sheet-link"
                onClick={() => handleNavigate("/profile")}
              >
                <span className="sheet-icon">👤</span>
                <span>الملف الشخصي</span>
              </button>

              <button
                className="sheet-link"
                onClick={() => handleNavigate("/purchases")}
              >
                <span className="sheet-icon">🛍️</span>
                <span>مشترياتي</span>
              </button>

              {isStaff && (
                <button
                  className="sheet-link"
                  onClick={() => handleNavigate("/admin")}
                >
                  <span className="sheet-icon">⚙️</span>
                  <span>لوحة التحكم</span>
                </button>
              )}

              <button className="sheet-link" onClick={toggleTheme}>
                <span className="sheet-icon">
                  {theme === "dark" ? "☀️" : "🌙"}
                </span>
                <span>
                  {theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
                </span>
              </button>

              <button
                className="sheet-link sheet-link-danger"
                onClick={handleLogout}
              >
                <span className="sheet-icon">🚪</span>
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </>
        ) : (
          <div className="sheet-links">
            <button
              className="sheet-link"
              onClick={() => handleNavigate("/login")}
            >
              <span className="sheet-icon">🔑</span>
              <span>تسجيل الدخول</span>
            </button>

            <button
              className="sheet-link"
              onClick={() => handleNavigate("/register")}
            >
              <span className="sheet-icon">✨</span>
              <span>إنشاء حساب جديد</span>
            </button>

            <button className="sheet-link" onClick={toggleTheme}>
              <span className="sheet-icon">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
              <span>
                {theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}