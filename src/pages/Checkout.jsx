import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { itemsApi, payApi } from "../api/endpoints";
import { extractError, fileUrl } from "../api/client";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

const emptyAddress = {
  street: "",
  city: "",
  district: "",
  buildingNumber: "",
  apartmentNumber: "",
  distinctiveMark: "",
};

export default function Checkout() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [address, setAddress] = useState(emptyAddress);
  const [callnumber, setCallnumber] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // refs بتاعة الحماية من race conditions (فحص فوري، مش بينتظر re-render زي الـ state)
  const submittingRef = useRef(false);
  const cancellingRef = useRef(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setLoadError("");

    itemsApi
      .details(itemId)
      .then(({ data }) => {
        if (ignore) return;
        setItem(data.item);
        setMin(data.item.min ?? "");
        setMax(data.item.max ?? "");
      })
      .catch((err) => {
        if (!ignore) setLoadError(extractError(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [itemId]);

  const updateAddress = (key) => (e) => setAddress((a) => ({ ...a, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;

    setError("");
    setSubmitting(true);
    try {
      const { data } = await payApi.create(itemId, { addressDetails: address, callnumber, min, max });
      setConfirmation(data.pay);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  const cancelRequest = async () => {
    if (!confirmation?._id || cancellingRef.current) return;
    cancellingRef.current = true;
    setCancelling(true);
    try {
      await payApi.remove(confirmation._id);
      setConfirmation({ ...confirmation, cancelled: true });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setCancelling(false);
      cancellingRef.current = false;
    }
  };

  if (loading) return <Loader />;
  if (loadError) {
    return (
      <div className="container">
        <Alert>{loadError}</Alert>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="container">
        <div className="auth-card">
          {confirmation.cancelled ? (
            <>
              <h2>تم إلغاء الطلب</h2>
              <p>تم إلغاء الطلب بنجاح.</p>
            </>
          ) : (
            <>
              <h2>تم إرسال طلب المنتج 🎉</h2>
              <p className="auth-sub">سيتم التواصل معك على الرقم المُدخل.</p>
              <div className="panel">
                <div className="row between">
                  <span className="text-faint">المنتج</span>
                  <strong>{confirmation.itemname}</strong>
                </div>
                <div className="row between mt-1">
                  <span className="text-faint">السعر</span>
                  <strong className="mono">{confirmation.itemprice} ج.م</strong>
                </div>
                {/*<div className="row between mt-1">
                  <span className="text-faint">رقم التواصل</span>
                  <strong className="mono">{confirmation.callnumber}</strong>
                </div>*/}
              </div>
              <Alert>{error}</Alert>
              <button className="btn btn-danger btn-block mt-2" onClick={cancelRequest} disabled={cancelling}>
                {cancelling ? "جارِ الإلغاء..." : "إلغاء طلب (خلال ٣٠ دقيقة)"}
              </button>
            </>
          )}
          <Link to="/" className="btn btn-ghost btn-block mt-2">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="details-grid">
        <div className="panel">
          <h2>تأكيد بيانات الطلب</h2>
          <Alert>{error}</Alert>
          <form onSubmit={submit}>
            <div className="field-row">
              <div className="field">
                <label>المدينة</label>
                <input type="text" required value={address.city} onChange={updateAddress("city")} />
              </div>
              <div className="field">
                <label>الحي</label>
                <input type="text" required value={address.district} onChange={updateAddress("district")} />
              </div>
            </div>
            <div className="field">
              <label>الشارع</label>
              <input type="text" required value={address.street} onChange={updateAddress("street")} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>رقم المبنى</label>
                <input type="text" required value={address.buildingNumber} onChange={updateAddress("buildingNumber")} />
              </div>
              <div className="field">
                <label>رقم الشقة (اختياري)</label>
                <input type="text" value={address.apartmentNumber} onChange={updateAddress("apartmentNumber")} />
              </div>
            </div>
            <div className="field">
              <label>علامة مميزة (اختياري)</label>
              <input type="text" value={address.distinctiveMark} onChange={updateAddress("distinctiveMark")} />
            </div>
            <div className="field-row">
              <div className="field">
                <label>اصغر مقاس</label>
                <input type="number" required value={min} onChange={(e) => setMin(e.target.value)} />
              </div>
              <div className="field">
                <label>اكبر مقاس</label>
                <input type="number" required value={max} onChange={(e) => setMax(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>رقم التواصل</label>
              <input
                type="tel"
                required
                minLength={6}
                maxLength={20}
                value={callnumber}
                onChange={(e) => setCallnumber(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "جارِ الإرسال..." : "تأكيد الطلب"}
            </button>
          </form>
        </div>

        {item && (
          <div className="panel" style={{ alignSelf: "start" }}>
            <span className="eyebrow">ملخص الطلب</span>
            <div className="details-gallery-main mt-2" style={{ aspectRatio: "16/10" }}>
              {item.images && (
                <img
                  src={fileUrl("item", Array.isArray(item.images) ? item.images[0] : item.images)}
                  alt={item.name}
                />
              )}
            </div>
            <h3 className="mt-2">{item.name}</h3>
            <div className="price-tag">{item.price} ج.م</div>
          </div>
        )}
      </div>
    </div>
  );
}