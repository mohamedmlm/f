import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { payApi } from "../../api/endpoints";
import { extractError } from "../../api/client";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";

export default function AdminPayments() {
  const [pays, setPays] = useState([]);
  const [onlyUnpaid, setOnlyUnpaid] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyIds, setBusyIds] = useState(new Set());

  const requestIdRef = useRef(0);

  const load = () => {
    const thisRequestId = ++requestIdRef.current;
    setLoading(true);
    setError("");
    const call = onlyUnpaid ? payApi.unpaid : payApi.all;
    const params = { ...(search && { search }), older: true };

    call(params)
      .then(({ data }) => {
        if (thisRequestId === requestIdRef.current) {
          setPays(data.pays || []);
        }
      })
      .catch((err) => {
        if (thisRequestId === requestIdRef.current) {
          setError(extractError(err));
        }
      })
      .finally(() => {
        if (thisRequestId === requestIdRef.current) {
          setLoading(false);
        }
      });
  };

  useEffect(load, [onlyUnpaid]);

  const search_submit = (e) => {
    e.preventDefault();
    load();
  };

  const markBusy = (id, isBusy) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (isBusy) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const confirmPay = async (id) => {
    if (busyIds.has(id)) return;
    if (!confirm("هل تريد تأكيد استلام هذا الدفع وتغيير حالته إلى مدفوع؟")) return;

    markBusy(id, true);
    try {
      await payApi.confirm(id);
      load();
    } catch (err) {
      setError(extractError(err));
    } finally {
      markBusy(id, false);
    }
  };

  const rejectPay = async (id) => {
    if (busyIds.has(id)) return;

    const reason = prompt("سبب الرفض (اختياري):", "");
    if (reason === null) return;
    if (!confirm("هل تريد رفض هذا الطلب؟")) return;

    markBusy(id, true);
    try {
      await payApi.reject(id, reason);
      load();
    } catch (err) {
      setError(extractError(err));
    } finally {
      markBusy(id, false);
    }
  };

  const statusOf = (p) => {
    if (p.isRejected) return { label: "مرفوض", className: "badge-rejected" };
    if (p.ispayed) return { label: "مدفوع", className: "badge-paid" };
    return { label: "غير مدفوع", className: "badge-unpaid" };
  };

  return (
    <div>
      <form className="toolbar" onSubmit={search_submit}>
        <input
          type="search"
          className="grow"
          placeholder="ابحث باسم المستخدم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="row" style={{ gap: 8, whiteSpace: "nowrap" }}>
          <input type="checkbox" checked={onlyUnpaid} onChange={(e) => setOnlyUnpaid(e.target.checked)} />
          غير المدفوعة فقط
        </label>
        <button className="btn btn-primary" type="submit">
          بحث
        </button>
      </form>

      <Alert>{error}</Alert>

      {loading ? (
        <Loader />
      ) : pays.length === 0 ? (
        <EmptyState title="لا توجد طلبات " />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>الأداة</th>
                <th>السعر</th>
                <th>العنوان</th>
                <th>الهاتف</th>
                <th>الحالة</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pays.map((p) => {
                const status = statusOf(p);
                const isBusy = busyIds.has(p._id);
                return (
                  <tr key={p._id}>
                    <td>{p.username}</td>
                    <td>
                      {p.itemId ? (
                        <Link to={`/items/${p.itemId}`} className="link">
                          {p.itemname}
                        </Link>
                      ) : (
                        p.itemname
                      )}
                    </td>
                    <td className="mono">{p.itemprice} ج.م</td>
                    <td className="text-faint" style={{ fontSize: "0.82rem" }}>
                      {p.addressDetails?.city} — {p.addressDetails?.district} — {p.addressDetails?.street}
                    </td>
                    <td className="mono">{p.callnumber}</td>
                    <td>
                      <span className={`badge ${status.className}`}>{status.label}</span>
                      {p.isRejected && p.rejectionReason && (
                        <div className="text-faint" style={{ fontSize: "0.75rem", marginTop: 4 }}>
                          {p.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      {!p.ispayed && !p.isRejected && (
                        <div className="row" style={{ gap: 6 }}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => confirmPay(p._id)}
                            disabled={isBusy}
                          >
                            {isBusy ? "..." : "تم الاستلام"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => rejectPay(p._id)}
                            disabled={isBusy}
                          >
                            {isBusy ? "..." : "رفض"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}