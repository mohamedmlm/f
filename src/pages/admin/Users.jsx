import { useEffect, useState } from "react";
import { authApi } from "../../api/endpoints";
import { extractError, fileUrl } from "../../api/client";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";

const LIMIT = 15;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    authApi
      .all({ page, limit: LIMIT })
      .then(({ data }) => setUsers(data.safeUsers || []))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, [page]);

  const badgeClass = (role) => {
    const r = (role || "").toUpperCase();
    if (r === "ADMIN") return "badge badge-admin";
    if (r === "MANAGER") return "badge badge-manager";
    return "badge";
  };

  return (
    <div>
      <Alert>{error}</Alert>
      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <EmptyState title="لا يوجد مستخدمون في هذه الصفحة" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>الاسم</th>
                  <th>اسم المستخدم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الدور</th>
                  <th>تحقق البريد</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <img
                        src={fileUrl("avatar", u.avatar) || "/lantern.svg"}
                        alt={u.name}
                        style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                      />
                    </td>
                    <td>{u.name}</td>
                    <td>@{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={badgeClass(u.role)}>{u.role}</span>
                    </td>
                    <td>{u.isEmailVerified ? "✅" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              السابق
            </button>
            <span className="page-num">صفحة {page}</span>
            <button className="btn btn-ghost btn-sm" disabled={users.length < LIMIT} onClick={() => setPage((p) => p + 1)}>
              التالي
            </button>
          </div>
        </>
      )}
    </div>
  );
}
