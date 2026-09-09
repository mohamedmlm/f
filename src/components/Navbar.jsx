import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
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
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 900;
  });
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);

  // Check window size for desktop view
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      const desktop = window.innerWidth >= 900;
      setIsDesktop(desktop);
      if (desktop) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close menu on location change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  // Handle navigation with menu close
  const handleNavigate = useCallback((path) => {
    setMenuOpen(false);
    navigate(path);
  }, [navigate]);

  // Auth buttons component (reused for mobile and desktop)
  const AuthButtons = ({ isMobile = false }) => {
    if (token) {
      return (
        <>
          <button
            className={`nav-link mobile-profile ${isMobile ? "" : ""}`}
            onClick={() => handleNavigate("/profile")}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img
              className="nav-avatar"
              src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
              alt={user?.name || "الملف الشخصي"}
            />
            {isMobile && (
              <span className="mobile-name">{user?.name || "..."}</span>
            )}
          </button>
          <button
            className={`btn btn-ghost ${isMobile ? "btn-block" : "btn-sm"}`}
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
          >
            خروج
          </button>
        </>
      );
    }

    return (
      <>
        <button
          onClick={() => handleNavigate("/login")}
          className={`btn btn-ghost ${isMobile ? "btn-block" : "btn-sm"}`}
        >
          دخول
        </button>
        <button
          onClick={() => handleNavigate("/register")}
          className={`btn btn-primary ${isMobile ? "btn-block" : "btn-sm"}`}
        >
          حساب جديد
        </button>
      </>
    );
  };

  return (
    <>
      {menuOpen && (
        <div
          className="nav-backdrop"
          aria-hidden={!menuOpen}
        />
      )}

      <header className="navbar">
        <div className="container navbar-inner">
          <button
            onClick={() => handleNavigate("/")}
            className="brand"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
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
            onClick={toggleMenu}
          >
            {menuOpen ? "×" : "☰"}
          </button>

          {/* Only render nav when menu is open on mobile, but always show on desktop */}
          {(menuOpen || isDesktop) && (
            <nav ref={navLinksRef} className={`nav-links${menuOpen ? " open" : ""}`}>
              <button
                onClick={() => handleNavigate("/")}
                className="nav-link"
              >
                المتجر
              </button>
              <button
                onClick={() => handleNavigate("/purchases")}
                className="nav-link"
              >
                مشترياتي
              </button>
              {isStaff && (
                <button
                  onClick={() => handleNavigate("/admin")}
                  className="nav-link"
                >
                  لوحة التحكم
                </button>
              )}
              
              {/* Mobile-only user menu */}
              <div className="nav-user-mobile" aria-hidden={!menuOpen}>
                <AuthButtons isMobile={true} />
              </div>
            </nav>
          )}

          {/* Desktop user section */}
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
              {theme === "dark" ? "🌙" : "☀️"}
              <span className="theme-label">
                {theme === "dark" ? " Dark" : " Light"}
              </span>
            </button>

            <AuthButtons />
          </div>
        </div>
      </header>
    </>
  );
}