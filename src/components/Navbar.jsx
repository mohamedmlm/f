import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fileUrl } from "../api/client";

export default function Navbar() {
  const { user, token, logout, isStaff } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [menuOpen, setMenuOpen] = useState(false);

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
          className="nav-toggle"
          aria-label={menuOpen ? "إغلاق القائمة" : "قائمة التنقل"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>

        <nav className={`nav-links${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            المتجر
          </NavLink>
          <NavLink
            to="/purchases"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
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
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
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
  );
}
