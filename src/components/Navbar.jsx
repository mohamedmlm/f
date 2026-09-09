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
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const navBackdropRef = useRef(null);

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

  // Close menu on outside click
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

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
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

  // Auth buttons component (reused for mobile and desktop)
  const AuthButtons = ({ isMobile = false, className = "" }) => {
    if (token) {
      return (
        <>
          <NavLink
            to="/profile"
            className={`nav-link mobile-profile ${className}`}
            onClick={closeMenu}
          >
            <img
              className="nav-avatar"
              src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
              alt={user?.name || "الملف الشخصي"}
            />
            {isMobile && (
              <span className="mobile-name">{user?.name || "..."}</span>
            )}
          </NavLink>
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
        <NavLink
          to="/login"
          onClick={closeMenu}
          className={`btn btn-ghost ${isMobile ? "btn-block" : "btn-sm"}`}
        >
          دخول
        </NavLink>
        <NavLink
          to="/register"
          onClick={closeMenu}
          className={`btn btn-primary ${isMobile ? "btn-block" : "btn-sm"}`}
        >
          حساب جديد
        </NavLink>
      </>
    );
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
          <NavLink
            to="/"
            className="brand"
            onClick={closeMenu}
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
            onClick={toggleMenu}
          >
            {menuOpen ? "×" : "☰"}
          </button>

          <nav ref={navLinksRef} className={`nav-links${menuOpen ? " open" : ""}`}>
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              المتجر
            </NavLink>
            <NavLink
              to="/purchases"
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              مشترياتي
            </NavLink>
            {isStaff && (
              <NavLink
                to="/admin"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                لوحة التحكم
              </NavLink>
            )}
            
            {/* Mobile-only user menu */}
            <div className="nav-user-mobile" aria-hidden={!menuOpen}>
              <AuthButtons isMobile={true} />
            </div>
          </nav>

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