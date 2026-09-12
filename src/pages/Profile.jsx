import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, payApi } from "../api/endpoints";
import { extractError, fileUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Profile() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [myPays, setMyPays] = useState([]);
  const [paysLoading, setPaysLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("password", password);
      if (avatar) fd.append("avatar", avatar);
      await authApi.edit(fd);
      setSuccess("تم تحديث بياناتك بنجاح");
      setPassword("");
      refresh();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadMyPays = async () => {
    setPaysLoading(true);
    setError("");
    try {
      const { data } = await payApi.my();
      const pays = data.pays || [];
      setMyPays(pays);
      return pays;
    } catch (err) {
      setError(extractError(err));
      return [];
    } finally {
      setPaysLoading(false);
    }
  };

  useEffect(() => {
    loadMyPays();
  }, []);

  const removeMyPay = async (id) => {
    if (!confirm("هل تريد حذف هذا الطلب؟")) return;
    try {
      await payApi.remove(id);
      loadMyPays();
    } catch (err) {
      setError(extractError(err));
    }
  };

  const removeAccount = async () => {
    const pays = await loadMyPays();
    
    const blockingPay = pays.find(
  (p) => !p.ispayed && !p.isRejected && Date.now() - new Date(p.createdAt).getTime() >= 30 * 60 * 1000
);

    if (blockingPay) {
      setError("لا يمكنك حذف حسابك — لديك طلب غير مدفوع أقدم من ٣٠ دقيقة.");
      return;
    }
    
    if (!confirm("سيتم حذف حسابك نهائيًا. هل أنت متأكد؟")) return;
    setDeleting(true);
    try {
      await authApi.remove();
      logout();
      navigate("/");
    } catch (err) {
      setError(extractError(err));
      setDeleting(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <div className="profile-head">
          <img
            className="profile-avatar-lg"
            src={fileUrl("avatar", user?.avatar) || "/lantern.svg"}
            alt={user?.name}
          />
          <div>
            <h2 style={{ marginBottom: 2 }}>{user?.name}</h2>
            <span className="text-faint">@{user?.username} · {user?.email}</span>
          </div>
        </div>

        <Alert>{error}</Alert>
        <Alert type="success">{success}</Alert>

        <form onSubmit={submit}>
          <div className="field">
            <label>الاسم</label>
            <input type="text" required minLength={3} maxLength={20} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>كلمة المرور الحالية أو الجديدة</label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={25}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="field-hint">مطلوبة لتأكيد أي تعديل — أدخل نفس كلمة المرور إن لم ترغب بتغييرها.</span>
          </div>
          <div className="field">
            <label>تغيير الصورة الشخصية</label>
            <input type="file" accept="image/*" className="input-file" onChange={(e) => setAvatar(e.target.files[0])} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "جارِ الحفظ..." : "حفظ التعديلات"}
          </button>
        </form>

        <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "26px 0" }} />

        <div className="row between">
          <div>
            <strong>حذف الحساب</strong>
            <p style={{ marginBottom: 0 }} className="text-faint">
              إجراء نهائي ولا يمكن التراجع عنه.
            </p>
          </div>
          <button className="btn btn-danger" onClick={removeAccount} disabled={deleting}>
            {deleting ? "جارِ الحذف..." : "حذف حسابي"}
          </button>
        </div>
      </div>
    </div>
  );
}
