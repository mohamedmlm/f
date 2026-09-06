import { Link } from "react-router-dom";
import { fileUrl } from "../api/client";

export default function ItemCard({ item }) {
  const image = Array.isArray(item.images) ? item.images[0] : item.images;
  const itemId = item._id || item.id;
  return (
    <Link to={itemId ? `/items/${itemId}` : "#"} className="item-card">
      <div className="item-thumb">
        {image ? (
          <img src={fileUrl("item", image)} alt={item.name} loading="lazy" />
        ) : (
          <div className="loader-wrap" style={{ padding: 0, height: "100%" }} />
        )}
      </div>
      <div className="item-body">
        <span className="item-cat">{item.category}</span>
        <span className="item-name">{item.name}</span>
        <div className="row" style={{ gap: 8 }}>
          <span className="range-chip">
            <span className="dot" /> {item.min}–{item.max}
          </span>
        </div>
        <div className="item-meta">
          <span className="item-price mono">{item.price} ج.م</span>
        </div>
      </div>
    </Link>
  );
}
