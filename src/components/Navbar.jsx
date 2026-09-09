import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fileUrl } from "../api/client";
import Menu from "./Menu"; // استيراد المكون الجديد

export default function Navbar() {
  const { user, token, logout, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <button
            type="button"
            className="brand"
            onClick={() => handleNavigate("/")}
            aria-label="الذهاب إلى المتجر"
          >
            <span className="brand-mark">C</span>
            <span className="brand-name">Crocs Store</span>
          </button>

          {/* Hamburger Button */}
          <button
            type="button"
            className="nav-toggle"
            onClick={toggleMenu}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop User */}
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
                    src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                    alt="الملف الشخصي"
                  />
                  <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
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

      {/* ===== Menu Component ===== */}
      <Menu isOpen={menuOpen} onClose={closeMenu}>
        {/* Close Button */}
        <button
          type="button"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "40px",
            height: "40px",
            border: "none",
            borderRadius: "50%",
            background: "var(--surface-hi)",
            fontSize: "1.4rem",
            cursor: "pointer",
            color: "var(--text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeMenu}
        >
          ✕
        </button>

        {/* Navigation Links */}
        <button
          type="button"
          className="nav-link"
          onClick={() => handleNavigate("/")}
          style={{
            display: "flex",
            width: "100%",
            padding: "12px 14px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            fontSize: "1rem",
            color: "var(--text)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          المتجر
        </button>

        <button
          type="button"
          className="nav-link"
          onClick={() => handleNavigate("/purchases")}
          style={{
            display: "flex",
            width: "100%",
            padding: "12px 14px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            fontSize: "1rem",
            color: "var(--text)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          مشترياتي
        </button>

        {isStaff && (
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavigate("/admin")}
            style={{
              display: "flex",
              width: "100%",
              padding: "12px 14px",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              fontSize: "1rem",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            لوحة التحكم
          </button>
        )}

        {/* Mobile User */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid var(--line)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {token ? (
            <>
              <button
                type="button"
                className="nav-link"
                onClick={() => handleNavigate("/profile")}
                style={{
                  display: "flex",
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "none",
                  fontSize: "1rem",
                  color: "var(--text)",
                  cursor: "pointer",
                  textAlign: "left",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  className="nav-avatar"
                  src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                  alt="Profile"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid var(--line)",
                  }}
                />
                <span>{user?.name || "..."}</span>
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
      </Menu>
    </>
  );
}