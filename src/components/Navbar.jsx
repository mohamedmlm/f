import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fileUrl } from "../api/client";

export default function Navbar() {
  const { user, token, logout, isStaff } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const navToggleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia
      ? window.matchMedia("(max-width: 899px)").matches
      : false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 899px)");
    const handler = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  const handleNavClick = (to, e) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      navigate(to);
    }, 100);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <>
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={closeMenu}
          aria-hidden={!menuOpen}
        />
      )}

      <header className="navbar">
        <div className="container navbar-inner">
          <button
            onClick={() => {
              closeMenu();
              navigate("/");
            }}
            className="brand"
            aria-label="العودة إلى الصفحة الرئيسية"
          >
            <span className="brand-mark">C</span>
            <span className="brand-name">Crocs Store</span>
          </button>

          <button
            ref={navToggleRef}
            className={`nav-toggle${menuOpen ? " is-open" : ""}`}
            aria-label={menuOpen ? "إغلاق القائمة" : "قائمة التنقل"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "×" : "☰"}
          </button>

          <nav className={`nav-links${menuOpen ? " open" : ""}`}>
            <button
              onClick={(e) => handleNavClick("/", e)}
              className="nav-link"
            >
              المتجر
            </button>
            <button
              onClick={(e) => handleNavClick("/purchases", e)}
              className="nav-link"
            >
              مشترياتي
            </button>
            {isStaff && (
              <button
                onClick={(e) => handleNavClick("/admin", e)}
                className="nav-link"
              >
                لوحة التحكم
              </button>
            )}
            <div className="nav-user-mobile" aria-hidden={!menuOpen}>
              {token ? (
                <>
                  <button
                    onClick={(e) => handleNavClick("/profile", e)}
                    className="nav-link mobile-profile"
                  >
                    <img
                      className="nav-avatar"
                      src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                      alt={user?.name || "الملف الشخصي"}
                    />
                    <span className="mobile-name">{user?.name || "..."}</span>
                  </button>
                  <button
                    className="btn btn-ghost btn-block"
                    onClick={handleLogout}
                  >
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => handleNavClick("/login", e)}
                    className="btn btn-ghost btn-block"
                  >
                    دخول
                  </button>
                  <button
                    onClick={(e) => handleNavClick("/register", e)}
                    className="btn btn-primary btn-block"
                  >
                    حساب جديد
                  </button>
                </>
              )}
            </div>
          </nav>

          <div className="nav-user">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "تبديل إلى الوضع المضيء"
                  : "تبديل إلى الوضع الداكن"
              }
            >
              {theme === "dark" ? "☀️" : "🌙"}
              <span className="theme-label">
                {theme === "dark" ? " Light" : " Dark"}
              </span>
            </button>

            {token ? (
              <>
                <button
                  onClick={(e) => handleNavClick("/profile", e)}
                  className="row"
                  style={{ gap: 8 }}
                >
                  <img
                    className="nav-avatar"
                    src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                    alt={user?.name || "الملف الشخصي"}
                  />
                  <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                    {user?.name || "..."}
                  </span>
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  خروج
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => handleNavClick("/login", e)}
                  className="btn btn-ghost btn-sm"
                >
                  دخول
                </button>
                <button
                  onClick={(e) => handleNavClick("/register", e)}
                  className="btn btn-primary btn-sm"
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