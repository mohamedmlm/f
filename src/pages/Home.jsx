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
        <select
          className="input-select shrink"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">كل التصنيفات</option>
          <option value="men">رجالي</option>
          <option value="women">حريمي</option>
          <option value="boys">أولادي</option>
          <option value="girls">بناتي</option>
        </select>
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
      ) : items.length === 0 ? (
        <EmptyState
          title="لا توجد منتجات مطابقة"
          hint="جرّب كلمة بحث مختلفة أو وسّع نطاق السعر."
        />
      ) : (
        <>
          <div className="item-grid">
            {items.map((item, i) => (
              <ItemCard key={item._id || item.id || i} item={item} />
            ))}
          </div>
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
              disabled={items.length < LIMIT}
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
