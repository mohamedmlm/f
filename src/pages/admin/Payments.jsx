import { useEffect, useState } from "react";
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

  const load = () => {
    setLoading(true);
    setError("");
    const call = onlyUnpaid ? payApi.unpaid : payApi.all;
    const params = { ...(search && { search }), older: true };

    call(params)
      .then(({ data }) => setPays(data.pays || []))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [onlyUnpaid]);

  const search_submit = (e) => {
    e.preventDefault();
    load();
  };
  const confirmPay = async (id) => {
    if (!confirm("هل تريد تأكيد استلام هذا الدفع وتغيير حالته إلى مدفوع؟")) return;
    try {
      await payApi.confirm(id);
      load();
    } catch (err) {
      setError(extractError(err));
    }
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
        <EmptyState title="لا توجد طلبات حجز" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>المنتج</th>
                <th>السعر</th>
                <th>العنوان</th>
                <th>الهاتف</th>
                <th>الحالة</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pays.map((p) => (
                <tr key={p._id}>
                  <td>{p.username}</td>
                  <td>{p.itemname}</td>
                  <td className="mono">{p.itemprice} ج.م</td>
                  <td className="text-faint" style={{ fontSize: "0.82rem" }}>
                    {p.addressDetails?.city} — {p.addressDetails?.district} — {p.addressDetails?.street}
                  </td>
                  <td className="mono">{p.callnumber}</td>
                  <td>
                    <span className={`badge ${p.ispayed ? "badge-paid" : "badge-unpaid"}`}>
                      {p.ispayed ? "مدفوع" : "غير مدفوع"}
                    </span>
                  </td>
                  <td>
                    {!p.ispayed && (
                      <button className="btn btn-success btn-sm" onClick={() => confirmPay(p._id)}>
                        تم الاستلام
                      </button>
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
