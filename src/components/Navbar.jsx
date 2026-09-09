import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fileUrl } from "../api/client";

export default function Navbar() {
  const { user, token, logout, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  const closeTimerRef = useRef(null);

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

  // Close menu when navigation happens (page changes) - مع تأخير
  useEffect(() => {
    // Clear any existing timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    
    // تأخير إغلاق القائمة عشان الـ NavLink يخلص تنقل
    closeTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 200);
    
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
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
          aria-hidden={!menuOpen}
        />
      )}

      <header className="navbar">
        <div className="container navbar-inner">
          <NavLink
            to="/"
            className="brand"
            aria-label="العودة إلى الصفحة الرئيسية"
          >
            <span className="brand-mark">C</span>
            <span className="brand-name">Crocs Store</span>
          </NavLink>

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
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              المتجر
            </NavLink>
            <NavLink
              to="/purchases"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              مشترياتي
            </NavLink>
            {isStaff && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                لوحة التحكم
              </NavLink>
            )}
            {/* Mobile-only compact user/menu block shown inside the hamburger menu */}
            <div className="nav-user-mobile" aria-hidden={!menuOpen}>
              {token ? (
                <>
                  <NavLink to="/profile" className="nav-link mobile-profile">
                    <img
                      className="nav-avatar"
                      src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                      alt={user?.name || "الملف الشخصي"}
                    />
                    <span className="mobile-name">{user?.name || "..."}</span>
                  </NavLink>
                  <button
                    className="btn btn-ghost btn-block"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="btn btn-ghost btn-block">
                    دخول
                  </NavLink>
                  <NavLink to="/register" className="btn btn-primary btn-block">
                    حساب جديد
                  </NavLink>
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
                <NavLink to="/profile" className="row" style={{ gap: 8 }}>
                  <img
                    className="nav-avatar"
                    src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                    alt={user?.name || "الملف الشخصي"}
                  />
                  <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                    {user?.name || "..."}
                  </span>
                </NavLink>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  خروج
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-ghost btn-sm">
                  دخول
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">
                  حساب جديد
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}