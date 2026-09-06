import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { extractError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function VerifyRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.verifyRegister({ email, verificationCode: code });
      login(data.token);
      navigate("/");
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2>تأكيد البريد الإلكتروني</h2>
        <p className="auth-sub">أرسلنا رمز تحقق مكوّن من ٦ أرقام إلى بريدك. الرمز صالح لمدة ١٠ دقائق.</p>

        <Alert>{error}</Alert>

        <form onSubmit={submit}>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>رمز التحقق</label>
            <input
              type="text"
              required
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mono"
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "جارِ التحقق..." : "تأكيد الحساب"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register">إنشاء حساب آخر</Link>
          <Link to="/login">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
