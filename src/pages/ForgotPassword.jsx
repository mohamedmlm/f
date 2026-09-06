import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { extractError } from "../api/client";
import Alert from "../components/Alert";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      navigate("/verify-forgot-password", { state: { email } });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2>نسيت كلمة المرور؟</h2>
        <p className="auth-sub">أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق لإعادة تعيين كلمة المرور.</p>

        <Alert>{error}</Alert>

        <form onSubmit={submit}>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "جارِ الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">رجوع لتسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
