import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { extractError } from "../api/client";
import Alert from "../components/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login({ username, password });
      navigate("/verify-login", { state: { email: data.email } });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2>تسجيل الدخول</h2>
        <p className="auth-sub">أهلاً بعودتك، جهّز رمز التحقق من بريدك بعد تسجيل الدخول.</p>

        <Alert>{error}</Alert>

        <form onSubmit={submit}>
          <div className="field">
            <label>اسم المستخدم أو البريد الإلكتروني</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "جارِ الدخول..." : "دخول"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
          <Link to="/register">إنشاء حساب جديد</Link>
        </div>
      </div>
    </div>
  );
}
