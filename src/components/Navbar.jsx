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

  /* ================= Body scroll ================= */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      // منع اللمس خلف القائمة على iOS
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [menuOpen]);

  /* ================= Close on navigation ================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ================= Navigation ================= */

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  /* ================= Logout ================= */

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  /* ================= Theme ================= */

  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  /* ================= Menu ================= */

  const toggleMenu = () => {
    setMenuOpen((current) => !current);
  };

  return (
    <>
      {/* ===================================================== */}
      {/* ===================== BACKDROP ====================== */}
      {/* ===================================================== */}

      <div
        className={`nav-backdrop${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ===================================================== */}
      {/* ======================= NAVBAR ====================== */}
      {/* ===================================================== */}

      <header className="navbar">
        <div className="container navbar-inner">

          {/* ================= Brand ================= */}

          <button
            type="button"
            className="brand"
            onClick={() => handleNavigate("/")}
            aria-label="الذهاب إلى المتجر"
          >
            <span className="brand-mark">C</span>

            <span className="brand-name">
              Crocs Store
            </span>
          </button>

          {/* ================= Hamburger ================= */}

          <button
            type="button"
            className={`nav-toggle${menuOpen ? " is-open" : ""}`}
            onClick={toggleMenu}
            aria-label={
              menuOpen
                ? "إغلاق قائمة التنقل"
                : "فتح قائمة التنقل"
            }
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* ================================================= */}
          {/* ===================== MENU ====================== */}
          {/* ================================================= */}

          <nav
            id="main-navigation"
            className={`nav-links${menuOpen ? " open" : ""}`}
            aria-hidden={!menuOpen}
          >
            {/* زر إغلاق إضافي داخل القائمة (تحسين للموبايل) */}
            <button
              type="button"
              className="nav-close"
              onClick={() => setMenuOpen(false)}
              aria-label="إغلاق القائمة"
            >
              ✕
            </button>

            <button
              type="button"
              className="nav-link"
              onClick={() => handleNavigate("/")}
            >
              المتجر
            </button>

            <button
              type="button"
              className="nav-link"
              onClick={() => handleNavigate("/purchases")}
            >
              مشترياتي
            </button>

            {isStaff && (
              <button
                type="button"
                className="nav-link"
                onClick={() => handleNavigate("/admin")}
              >
                لوحة التحكم
              </button>
            )}

            {/* ================= Mobile User ================= */}

            <div className="nav-user-mobile">

              {token ? (
                <>
                  <button
                    type="button"
                    className="nav-link mobile-profile"
                    onClick={() => handleNavigate("/profile")}
                  >
                    <img
                      className="nav-avatar"
                      src={
                        fileUrl("avatar", user?.avatar) || "/lantern.svg"
                      }
                      alt="الملف الشخصي"
                    />

                    <span>
                      {user?.name || "..."}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-block"
                    onClick={handleLogout}
                  >
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-ghost btn-block"
                    onClick={() => handleNavigate("/login")}
                  >
                    دخول
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => handleNavigate("/register")}
                  >
                    حساب جديد
                  </button>
                </>
              )}

            </div>
          </nav>

          {/* ================================================= */}
          {/* ================= DESKTOP USER ================== */}
          {/* ================================================= */}

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
                  className="row"
                  onClick={() => handleNavigate("/profile")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    gap: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    className="nav-avatar"
                    src={
                      fileUrl("avatar", user?.avatar) || "/lantern.svg"
                    }
                    alt="الملف الشخصي"
                  />

                  <span
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 600,
                    }}
                  >
                    {user?.name || "..."}
                  </span>
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
    </>
  );
}