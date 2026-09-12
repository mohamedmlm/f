import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { itemsApi } from "../../api/endpoints";
import { extractError } from "../../api/client";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";

const emptyForm = { name: "", description: "", min: "", max: "", price: "", category: "" };

export default function ItemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    itemsApi
      .getForEdit(id)
      .then(({ data }) => {
        const it = data.item;
        setForm({
          name: it.name || "",
          description: it.description || "",
          min: it.min ?? "",
          max: it.max ?? "",
          price: it.price ?? "",
          category: it.category || "",
        });
      })
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((file) => fd.append("images", file));
      if (isEdit) {
        await itemsApi.update(id, fd);
      } else {
        await itemsApi.create(fd);
      }
      navigate("/admin/items");
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="panel" style={{ maxWidth: 640 }}>
      <h2>{isEdit ? "تعديل منتج" : "إضافة منتج جديدة"}</h2>
      <Alert>{error}</Alert>

      <form onSubmit={submit}>
        <div className="field">
          <label>الاسم</label>
          <input type="text" required minLength={3} maxLength={50} value={form.name} onChange={update("name")} />
        </div>
        <div className="field">
          <label>الوصف</label>
          <textarea maxLength={500} value={form.description} onChange={update("description")} />
        </div>
        <div className="field">
          <label>الفئة</label>
          <input type="text" required minLength={3} maxLength={30} value={form.category} onChange={update("category")} />
        </div>
        <div className="field-row">
          <div className="field">
            <label> جميع المقاسات موجودة من(min)</label>
            <input type="number" required value={form.min} onChange={update("min")} />
          </div>
          <div className="field">
            <label>  ال (max)</label>
            <input type="number" required value={form.max} onChange={update("max")} />
          </div>
        </div>
        <div className="field">
          <label>السعر</label>
          <input type="number" required min="0.01" step="0.01" value={form.price} onChange={update("price")} />
        </div>
        <div className="field">
          <label>الصور {isEdit && "(اختر صورًا جديدة لاستبدال القديمة)"}</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="input-file"
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
          <span className="field-hint">حتى ٥ صور، بحد أقصى ٥ ميجابايت للصورة الواحدة.</span>
        </div>
        <button className="btn btn-primary btn-block" disabled={saving}>
          {saving ? "جارِ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
}
