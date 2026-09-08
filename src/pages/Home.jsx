import { useEffect, useState } from "react";
import { itemsApi } from "../api/endpoints";
import { extractError } from "../api/client";
import ItemCard from "../components/ItemCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Alert from "../components/Alert";

const LIMIT = 12;

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({});

  const isMobileItem = (item) => {
    const category = String(item?.category || "").toLowerCase();
    const name = String(item?.name || "").toLowerCase();
    return (
      category.includes("mobile") ||
      category.includes("mobi") ||
      category.includes("phone") ||
      category.includes("smartphone") ||
      category.includes("iphone") ||
      category.includes("android") ||
      category.includes("samsung") ||
      category.includes("موبايل") ||
      name.includes("mobile") ||
      name.includes("phone") ||
      name.includes("موبايل") ||
      name.includes("هاتف")
    );
  };

  const mobileItems = items.filter(isMobileItem);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    itemsApi
      .list({ page, limit: LIMIT, ...appliedFilters })
      .then(({ data }) => {
        if (!cancelled) setItems(data.items || []);
      })
      .catch((err) => {
        if (!cancelled) setError(extractError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, appliedFilters]);

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    setAppliedFilters({
      ...(search.trim() && { search: search.trim() }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    });
  };

  return (
    <div className="container">
      <section className="hero">
        <div>
          <span className="hero-eyebrow">Crocs store</span>
        </div>
      </section>

      <form className="toolbar" onSubmit={applyFilters}>
        <input
          type="search"
          className="grow"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          className="shrink"
          placeholder="أقل سعر"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min="0"
        />
        <input
          type="number"
          className="shrink"
          placeholder="أعلى سعر"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
        />
        <button className="btn btn-primary" type="submit">
          بحث
        </button>
      </form>

      <Alert>{error}</Alert>

      {loading ? (
        <Loader />
      ) : mobileItems.length === 0 ? (
        <EmptyState
          title="لا توجد منتجات موبايل"
          hint="لا يوجد منتجات هاتف حاليا، جرّب لاحقًا أو استخدم بحثًا مختلفًا."
        />
      ) : (
        <>
          <section className="mobile-showcase">
            <div className="section-head">
              <div>
                <span className="section-tag">Mobile</span>
                <h2>منتجات الموبايل</h2>
              </div>
              <span className="section-count">{mobileItems.length} منتج</span>
            </div>

            <div className="mobile-showcase-grid">
              {mobileItems.map((item, i) => (
                <ItemCard key={item._id || item.id || i} item={item} />
              ))}
            </div>
          </section>

          <div className="pagination">
            <button
              className="btn btn-ghost btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              السابق
            </button>
            <span className="page-num">صفحة {page}</span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={mobileItems.length < LIMIT}
              onClick={() => setPage((p) => p + 1)}
            >
              التالي
            </button>
          </div>
        </>
      )}
    </div>
  );
}
