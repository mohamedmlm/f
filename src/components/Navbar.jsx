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

  // ===== Theme =====
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ===== Body scroll =====
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  // ===== Close menu on navigation =====
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ===== Functions =====
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* ===== BACKDROP ===== */}
      <div
        className={`nav-backdrop${menuOpen ? " open" : ""}`}
        onClick={closeMenu}
        onTouchEnd={closeMenu} // مهم جداً للموبايل
      />

      {/* ===== NAVBAR ===== */}
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <button type="button" className="brand" onClick={() => handleNavigate("/")}>
            <span className="brand-mark">C</span>
            <span className="brand-name">Crocs Store</span>
          </button>

          {/* Hamburger Button */}
          <button
            type="button"
            className="nav-toggle"
            onClick={toggleMenu}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleMenu();
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* ===== MENU ===== */}
          <nav className={`nav-links${menuOpen ? " open" : ""}`}>
            {/* Close button inside menu */}
            <button
              type="button"
              className="nav-close"
              onClick={closeMenu}
              onTouchEnd={(e) => {
                e.preventDefault();
                closeMenu();
              }}
            >
              ✕
            </button>

            {/* Links */}
            <button type="button" className="nav-link" onClick={() => handleNavigate("/")}>
              المتجر
            </button>

            <button type="button" className="nav-link" onClick={() => handleNavigate("/purchases")}>
              مشترياتي
            </button>

            {isStaff && (
              <button type="button" className="nav-link" onClick={() => handleNavigate("/admin")}>
                لوحة التحكم
              </button>
            )}

            {/* Mobile User */}
            <div className="nav-user-mobile">
              {token ? (
                <>
                  <button type="button" className="nav-link mobile-profile" onClick={() => handleNavigate("/profile")}>
                    <img className="nav-avatar" src={fileUrl("avatar", user?.avatar) || "/lantern.svg"} alt="Profile" />
                    <span>{user?.name || "..."}</span>
                  </button>
                  <button type="button" className="btn btn-ghost btn-block" onClick={handleLogout}>
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-ghost btn-block" onClick={() => handleNavigate("/login")}>
                    دخول
                  </button>
                  <button type="button" className="btn btn-primary btn-block" onClick={() => handleNavigate("/register")}>
                    حساب جديد
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Desktop User */}
          <div className="nav-user">
            <button type="button" className="theme-toggle" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {token ? (
              <>
                <button type="button" className="row" onClick={() => handleNavigate("/profile")} style={{ background: "none", border: "none", cursor: "pointer", gap: 8, display: "flex", alignItems: "center" }}>
                  <img className="nav-avatar" src={fileUrl("avatar", user?.avatar) || "/lantern.svg"} alt="Profile" />
                  <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{user?.name || "..."}</span>
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  خروج
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleNavigate("/login")}>
                  دخول
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => handleNavigate("/register")}>
                  حساب جديد
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}