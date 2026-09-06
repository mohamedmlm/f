import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { extractError } from "../api/client";
import Alert from "../components/Alert";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append("avatar", avatar);
      const { data } = await authApi.register(fd);
      navigate("/verify-register", { state: { email: data.email || form.email } });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2>إنشاء حساب جديد</h2>
        <p className="auth-sub">انضم لـ Shopify وابدأ باستئجار أدواتك المفضّلة.</p>

        <Alert>{error}</Alert>

        <form onSubmit={submit}>
          <div className="field">
            <label>الاسم الكامل</label>
            <input type="text" required minLength={3} maxLength={20} value={form.name} onChange={update("name")} />
          </div>
          <div className="field">
            <label>اسم المستخدم</label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={20}
              value={form.username}
              onChange={update("username")}
            />
          </div>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input type="email" required value={form.email} onChange={update("email")} />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={25}
              value={form.password}
              onChange={update("password")}
            />
            <span className="field-hint">٨ أحرف على الأقل، ويُفضّل مزج حروف وأرقام ورموز.</span>
          </div>
          <div className="field">
            <label>الصورة الشخصية (اختياري)</label>
            <input
              type="file"
              accept="image/*"
              className="input-file"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "جارِ الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="auth-links">
          <span>لديك حساب بالفعل؟</span>
          <Link to="/login">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
