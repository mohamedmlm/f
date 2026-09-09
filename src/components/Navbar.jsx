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
  const navToggleRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // منع scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* الخلفية */}
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header className="navbar">
        <div className="container navbar-inner">
          {/* البراند */}
          <NavLink to="/" className="brand">
            <span className="brand-mark">C</span>
            <span className="brand-name">Crocs Store</span>
          </NavLink>

          {/* زر الهامبرغر */}
          <button
            ref={navToggleRef}
            className={`nav-toggle${menuOpen ? " is-open" : ""}`}
            onClick={toggleMenu}
            aria-label="قائمة التنقل"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* القائمة */}
          <nav className={`nav-links${menuOpen ? " open" : ""}`}>
            <NavLink to="/" end className="nav-link">
              المتجر
            </NavLink>
            <NavLink to="/purchases" className="nav-link">
              مشترياتي
            </NavLink>
            {isStaff && (
              <NavLink to="/admin" className="nav-link">
                لوحة التحكم
              </NavLink>
            )}

            {/* موبايل */}
            <div className="nav-user-mobile">
              {token ? (
                <>
                  <NavLink to="/profile" className="nav-link mobile-profile">
                    <img
                      className="nav-avatar"
                      src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                      alt="الملف الشخصي"
                    />
                    <span>{user?.name || "..."}</span>
                  </NavLink>
                  <button className="btn btn-ghost btn-block" onClick={handleLogout}>
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

          {/* ديسكتوب */}
          <div className="nav-user">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {token ? (
              <>
                <NavLink to="/profile" className="row" style={{ gap: 8 }}>
                  <img
                    className="nav-avatar"
                    src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                    alt="الملف الشخصي"
                  />
                  <span>{user?.name || "..."}</span>
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