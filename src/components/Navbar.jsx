import { useNavigate, useLocation } from "react-router-dom";
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
  const navLinksRef = useRef(null);

  // ===== Debugging =====
  console.log("🟢 Navbar rendered, menuOpen:", menuOpen);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    console.log("📱 Menu state changed:", menuOpen);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu when navigation happens
  useEffect(() => {
    console.log("📍 Location changed to:", location.pathname);
    console.log("🔴 Closing menu due to navigation...");
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    logout();
    navigate("/");
  };

  const toggleTheme = () => {
    console.log("🎨 Toggling theme...");
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleMenu = () => {
    console.log("📱 Toggle menu clicked, current state:", menuOpen);
    setMenuOpen(!menuOpen);
  };

  // دالة للتنقل مع إغلاق القائمة
  const handleNavigate = (path) => {
    alert("🖱️ Clicked on: " + path); // ← أضف alert عشان تتأكد من الشغل
    console.log("🖱️ Clicked on:", path);
    console.log("🔴 Closing menu first...");
    setMenuOpen(false);
    console.log("🔄 Navigating to:", path);
    navigate(path);
  };

  return (
    <>
      {/* الخلفية */}
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => {
            console.log("🔙 Backdrop clicked, closing menu");
            setMenuOpen(false);
          }}
        />
      )}

      <header className="navbar">
        <div className="container navbar-inner">
          {/* البراند */}
          <button
            className="brand"
            onClick={() => handleNavigate("/")}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span className="brand-mark">C</span>
            <span className="brand-name">Crocs Store</span>
          </button>

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
          <nav 
            ref={navLinksRef}
            className={`nav-links${menuOpen ? " open" : ""}`}
            onClick={() => console.log("🟢 Nav clicked!")}
          >
            <button
              className="nav-link"
              onClick={() => {
                alert("Test click - المتجر!");
                handleNavigate("/");
              }}
            >
              المتجر
            </button>
            <button
              className="nav-link"
              onClick={() => {
                alert("Test click - مشترياتي!");
                handleNavigate("/purchases");
              }}
            >
              مشترياتي
            </button>
            {isStaff && (
              <button
                className="nav-link"
                onClick={() => {
                  alert("Test click - لوحة التحكم!");
                  handleNavigate("/admin");
                }}
              >
                لوحة التحكم
              </button>
            )}

            {/* موبايل */}
            <div className="nav-user-mobile">
              {token ? (
                <>
                  <button
                    className="nav-link mobile-profile"
                    onClick={() => handleNavigate("/profile")}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <img
                      className="nav-avatar"
                      src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
                      alt="الملف الشخصي"
                    />
                    <span>{user?.name || "..."}</span>
                  </button>
                  <button className="btn btn-ghost btn-block" onClick={handleLogout}>
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-ghost btn-block"
                    onClick={() => handleNavigate("/login")}
                  >
                    دخول
                  </button>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleNavigate("/register")}
                  >
                    حساب جديد
                  </button>
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
                <button
                  className="row"
                  onClick={() => handleNavigate("/profile")}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', gap: 8, display: 'flex', alignItems: 'center' }}
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
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  خروج
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleNavigate("/login")}
                >
                  دخول
                </button>
                <button
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