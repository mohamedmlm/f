import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { isAdmin } = useAuth();

  return (
    <div className="container">
      <div className="section-head">
        <h2>لوحة التحكم</h2>
        <span className="eyebrow">{isAdmin ? "مسؤول" : "مدير"}</span>
      </div>

      <div className="tabs">
        <NavLink to="/admin/items" className={({ isActive }) => `tab${isActive ? " active" : ""}`}>
          المنتجات
        </NavLink>
        <NavLink to="/admin/payments" className={({ isActive }) => `tab${isActive ? " active" : ""}`}>
          طلبات الحجز
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `tab${isActive ? " active" : ""}`}>
          المستخدمون
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}
