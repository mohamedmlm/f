import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/endpoints";
import { extractError } from "../api/client";
import Alert from "../components/Alert";

export default function VerifyForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authApi.verifyForgotPassword({ email, verificationCode: code, newPassword });
      setSuccess("تم تغيير كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2>إعادة تعيين كلمة المرور</h2>
        <p className="auth-sub">أدخل رمز التحقق وكلمة المرور الجديدة.</p>

        <Alert>{error}</Alert>
        <Alert type="success">{success}</Alert>

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
          <div className="field">
            <label>كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={25}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "جارِ الحفظ..." : "تغيير كلمة المرور"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">رجوع لتسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
}
