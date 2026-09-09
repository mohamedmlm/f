// components/Menu.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Menu({ isOpen, onClose, children }) {
  // منع التمرير
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isOpen]);

  // إغلاق بالـ Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 9998,
          animation: "fadeIn 0.2s ease",
        }}
        onClick={onClose}
        onTouchEnd={(e) => {
          e.preventDefault();
          onClose();
        }}
      />

      {/* Menu Content */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "75%",
          maxWidth: "380px",
          height: "100vh",
          backgroundColor: "var(--surface)",
          zIndex: 9999,
          padding: "70px 20px 20px",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.2)",
          transform: "translateX(0)",
          animation: "slideIn 0.3s ease",
          overflowY: "auto",
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>,
    document.body
  );
}