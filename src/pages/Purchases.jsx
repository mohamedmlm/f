import { useEffect, useState } from "react";
import { payApi } from "../api/endpoints";
import { extractError } from "../api/client";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Purchases() {
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await payApi.my();
      setPays(data.pays || []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
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
                <th>الأداة</th>
                <th>السعر</th>
                <th>العنوان</th>
                <th>الهاتف</th>
                <th>التاريخ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pays.map((p) => (
                <tr key={p._id}>
                  <td>{p.itemname}</td>
                  <td className="mono">{p.itemprice} ج.م</td>
                  <td className="text-faint" style={{ fontSize: "0.82rem" }}>
                    {p.addressDetails?.city} — {p.addressDetails?.district} — {p.addressDetails?.street}
                  </td>
                  <td className="mono">{p.callnumber}</td>
                  <td className="text-faint">{new Date(p.createdAt).toLocaleString()}</td>
                  <td>
                    {p.createdAt && Date.now() - new Date(p.createdAt).getTime() < 30 * 60 * 1000 ? (
                      <button className="btn btn-danger btn-sm" onClick={() => removePay(p._id)}>حذف</button>
                    ) : (
                      <span className="text-faint">انقضى وقت الحذف</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
