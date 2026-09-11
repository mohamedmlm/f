import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { itemsApi } from "../../api/endpoints";
import { extractError, fileUrl } from "../../api/client";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";
import EmptyState from "../../components/EmptyState";

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    itemsApi
      .list({ limit: 50 })
      .then(({ data }) => setItems(data.items || []))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!id) {
      alert("لا يمكن تحديد هذه المنتج — رقمها غير متوفر في استجابة السيرفر.");
      return;
    }
    if (!confirm("هل تريد حذف هذه المنتج")) return;
    try {
      await itemsApi.remove(id);
      load();
    } catch (err) {
      setError(extractError(err));
    }
  };

  return (
    <div>
      <div className="row between mt-1" style={{ marginBottom: 18 }}>
        <span className="text-faint">{items.length} المنتج</span>
        <Link to="/admin/items/new" className="btn btn-primary btn-sm">
          + إضافة منتجات جديدة
        </Link>
      </div>

      <Alert>{error}</Alert>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="لا توجد منتجات بعد" hint="ابدأ بإضافة أول المنتج إلى المتجر." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>الاسم</th>
                <th>الفئة</th>
                <th>السعر</th>
                <th>المقاس</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const id = item._id || item.id;
                const image = Array.isArray(item.images) ? item.images[0] : item.images;
                return (
                  <tr key={id || i}>
                    <td>
                      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "var(--bg-soft)" }}>
                        {image && <img src={fileUrl("item", image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                      </div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td className="mono">{item.price} ج.م</td>
                    <td>{item.min}–{item.max}</td>
                    <td>
                      <div className="row">
                        {id ? (
                          <Link to={`/admin/items/${id}/edit`} className="btn btn-ghost btn-sm">
                            تعديل
                          </Link>
                        ) : (
                          <span className="text-faint" style={{ fontSize: "0.75rem" }}>
                            بلا معرّف
                          </span>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => remove(id)}>
                          حذف
                        </button>
                      </div>
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
