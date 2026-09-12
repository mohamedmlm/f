import { useEffect, useRef, useState } from "react";
import { payApi } from "../api/endpoints";
import { extractError } from "../api/client";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Purchases() {
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  const load = async () => {
    const thisRequestId = ++requestIdRef.current;
    setLoading(true);
    setError("");
    try {
      const { data } = await payApi.my();
      if (thisRequestId === requestIdRef.current) {
        setPays(data.pays || []);
      }
    } catch (err) {
      if (thisRequestId === requestIdRef.current) {
        setError(extractError(err));
      }
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removePay = async (id) => {
    if (!confirm("هل تريد حذف هذا الطلب؟")) return;
    try {
      await payApi.remove(id);
      load();
    } catch (err) {
      setError(extractError(err));
    }
  };

  const statusOf = (p) => {
    if (p.isRejected) return { label: "مرفوض", className: "badge-rejected" };
    if (p.ispayed) return { label: "مدفوع", className: "badge-paid" };
    return { label: "قيد الانتظار", className: "badge-unpaid" };
  };

  return (
    <div className="container">
      <h2>مشترياتي</h2>
      {error && <div className="alert">{error}</div>}
      {loading ? (
        <Loader />
      ) : pays.length === 0 ? (
        <EmptyState title="لا توجد مشتريات" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>السعر</th>
                <th>العنوان</th>
                <th>الهاتف</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pays.map((p) => {
                const status = statusOf(p);
                return (
                  <tr key={p._id}>
                    <td>{p.itemname}</td>
                    <td className="mono">{p.itemprice} ج.م</td>
                    <td className="text-faint" style={{ fontSize: "0.82rem" }}>
                      {p.addressDetails?.city} — {p.addressDetails?.district} — {p.addressDetails?.street}
                    </td>
                    <td className="mono">{p.callnumber}</td>
                    <td className="text-faint">{new Date(p.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${status.className}`}>{status.label}</span>
                      {p.isRejected && p.rejectionReason && (
                        <div className="text-faint" style={{ fontSize: "0.75rem", marginTop: 4 }}>
                          {p.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      {!p.ispayed && !p.isRejected && p.createdAt && Date.now() - new Date(p.createdAt).getTime() < 30 * 60 * 1000 ? (
                        <button className="btn btn-danger btn-sm" onClick={() => removePay(p._id)}>حذف</button>
                      ) : !p.ispayed && !p.isRejected ? (
                        <span className="text-faint">انقضى وقت الحذف</span>
                      ) : null}
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