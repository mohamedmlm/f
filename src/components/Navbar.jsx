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
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const navBackdropRef = useRef(null);
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
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event) => {
      const target = event.target;
      const clickedInsideMenu = navLinksRef.current?.contains(target);
      const clickedToggle = navToggleRef.current?.contains(target);
      const clickedBackdrop = navBackdropRef.current?.contains(target);

      if (!clickedInsideMenu && !clickedToggle && !clickedBackdrop) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleNavClick = (path) => {
    closeMenu();
    navigate(path);
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
          ref={navBackdropRef}
          className="nav-backdrop"
          onClick={closeMenu}
          aria-hidden={!menuOpen}
        />
      )}

      <header className="navbar">
        <div className="container navbar-inner">
          <button
            onClick={() => handleNavClick("/")}
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

          <nav
            ref={navLinksRef}
            className={`nav-links${menuOpen ? " open" : ""}`}
          >
            <button
              onClick={() => handleNavClick("/")}
              className="nav-link"
            >
              المتجر
            </button>
            <button
              onClick={() => handleNavClick("/purchases")}
              className="nav-link"
            >
              مشترياتي
            </button>
            {isStaff && (
              <button
                onClick={() => handleNavClick("/admin")}
                className="nav-link"
              >
                لوحة التحكم
              </button>
            )}
            <div className="nav-user-mobile" aria-hidden={!menuOpen}>
              {token ? (
                <>
                  <button
                    onClick={() => handleNavClick("/profile")}
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
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                  >
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick("/login")}
                    className="btn btn-ghost btn-block"
                  >
                    دخول
                  </button>
                  <button
                    onClick={() => handleNavClick("/register")}
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
                  onClick={() => handleNavClick("/profile")}
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
                  onClick={() => handleNavClick("/login")}
                  className="btn btn-ghost btn-sm"
                >
                  دخول
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
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