import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { fileUrl } from "../api/client";

export default function Navbar() {
  const { user, token, logout, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // ===== Theme =====
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ===== منع التمرير =====
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [isOpen]);

  // ===== إغلاق عند تغيير المسار =====
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // ===== إغلاق بالـ Escape =====
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // ===== Functions =====
  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* ======================== OVERLAY ============================ */}
      {/* ============================================================ */}
      <div
        className={`menu-overlay ${isOpen ? "active" : ""}`}
        onClick={closeMenu}
      />

      {/* ============================================================ */}
      {/* ======================== MENU =============================== */}
      {/* ============================================================ */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        {/* Close Button */}
        <button className="menu-close" onClick={closeMenu} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Brand in Menu */}
        <div className="menu-brand">
          <span className="brand-mark">C</span>
          <span className="brand-name">Crocs Store</span>
        </div>

        {/* Links */}
        <nav className="menu-nav">
          <button
            type="button"
            className={`menu-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => handleNavigate("/")}
          >
            <span className="menu-icon">🏠</span>
            المتجر
          </button>

          <button
            type="button"
            className={`menu-link ${location.pathname === "/purchases" ? "active" : ""}`}
            onClick={() => handleNavigate("/purchases")}
          >
            <span className="menu-icon">🛍️</span>
            مشترياتي
          </button>

          {isStaff && (
            <button
              type="button"
              className={`menu-link ${location.pathname === "/admin" ? "active" : ""}`}
              onClick={() => handleNavigate("/admin")}
            >
              <span className="menu-icon">⚙️</span>
              لوحة التحكم
            </button>
          )}
        </nav>

        {/* Divider */}
        <div className="menu-divider" />

        {/* User Section */}
        <div className="menu-user">
          {token ? (
            <>
              <button
                type="button"
                className="menu-profile"
                onClick={() => handleNavigate("/profile")}
              >
                <img
                  src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                  alt={user?.name}
                  className="menu-avatar"
                />
                <div className="menu-user-info">
                  <span className="menu-user-name">{user?.name || "..."}</span>
                  <span className="menu-user-email">{user?.email}</span>
                </div>
              </button>
              <button
                type="button"
                className="menu-logout"
                onClick={handleLogout}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <div className="menu-auth">
              <button
                type="button"
                className="menu-login"
                onClick={() => handleNavigate("/login")}
              >
                دخول
              </button>
              <button
                type="button"
                className="menu-register"
                onClick={() => handleNavigate("/register")}
              >
                حساب جديد
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* ======================== NAVBAR ============================= */}
      {/* ============================================================ */}
      <header className="navbar">
        <div className="container navbar-inner">
          {/* ===== Brand ===== */}
          <button
            type="button"
            className="brand"
            onClick={() => handleNavigate("/")}
          >
            <span className="brand-mark">C</span>
            <span className="brand-name">Crocs Store</span>
          </button>

          {/* ===== Desktop Actions ===== */}
          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
              <span className="theme-label">
                {theme === "dark" ? "فاتح" : "داكن"}
              </span>
            </button>

            {token ? (
              <div className="nav-user">
                <button
                  type="button"
                  className="nav-profile"
                  onClick={() => handleNavigate("/profile")}
                >
                  <img
                    src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                    alt={user?.name}
                    className="nav-avatar"
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
              </div>
            ) : (
              <div className="nav-user">
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
              </div>
            )}

            {/* ===== Hamburger ===== */}
            <button
              ref={toggleRef}
              type="button"
              className={`hamburger ${isOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}