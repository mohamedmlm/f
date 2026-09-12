import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { itemsApi, commentsApi } from "../api/endpoints";
import { extractError, fileUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import StarRating from "../components/StarRating";
import EmptyState from "../components/EmptyState";

function toImageArray(images) {
  if (!images) return [];
  return Array.isArray(images) ? images : [images];
}

export default function ItemDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentsError, setCommentsError] = useState("");

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [posting, setPosting] = useState(false);
  const [commentMsg, setCommentMsg] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  const loadItem = useCallback(() => {
    setLoading(true);
    setError("");
    itemsApi
      .details(id)
      .then(({ data }) => setItem(data.item))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const loadComments = useCallback(() => {
    commentsApi
      .forItem(id)
      .then(({ data }) => setComments(data.data || []))
      .catch((err) => setCommentsError(extractError(err)));
  }, [id]);

  useEffect(() => {
    loadItem();
    loadComments();
  }, [loadItem, loadComments]);

  const submitComment = async (e) => {
    e.preventDefault();
    setPosting(true);
    setCommentMsg("");
    try {
      await commentsApi.create(id, { content, rating });
      setContent("");
      setRating(5);
      setCommentMsg("تم إضافة تعليقك بنجاح");
      loadComments();
    } catch (err) {
      setCommentMsg(extractError(err));
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditContent(c.content);
    setEditRating(c.rating || 5);
  };

  const saveEdit = async (commentId) => {
    try {
      await commentsApi.update(commentId, { content: editContent, rating: editRating });
      setEditingId(null);
      loadComments();
    } catch (err) {
      setCommentsError(extractError(err));
    }
  };

  const removeComment = async (commentId) => {
    if (!confirm("هل تريد حذف هذا التعليق؟")) return;
    try {
      await commentsApi.remove(commentId);
      loadComments();
    } catch (err) {
      setCommentsError(extractError(err));
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container">
        <Alert>{error}</Alert>
      </div>
    );
  }
  if (!item) return null;

  const images = toImageArray(item.images);

  return (
    <div className="container">
      <div className="details-grid">
        <div>
          <div className="details-gallery-main">
            {images[activeImg] ? (
              <img src={fileUrl("item", images[activeImg])} alt={item.name} />
            ) : null}
          </div>
          {images.length > 1 && (
            <div className="details-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={i === activeImg ? "active" : ""}
                  onClick={() => setActiveImg(i)}
                  type="button"
                >
                  <img src={fileUrl("item", img)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="item-cat">{item.category}</span>
          <h1>{item.name}</h1>
          <div className="price-tag">{item.price} ج.م</div>
          <p className="mt-2">{item.description}</p>

          <div className="spec-row">
            <div className="spec">
              <span className="k">جميع المقاسات موجود مقاس</span>
              <span className="v">{item.min}</span>
            </div>
            <div className="spec">
              <span className="k">أقصى مقاس</span>
              <span className="v">{item.max}</span>
            </div>
          </div>

          {token ? (
            <Link to={`/checkout/${id}`} className="btn btn-primary btn-block">
              اطلب الآن
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-block">
              سجّل دخولك لتتمكن من الطلب
            </Link>
          )}
        </div>
      </div>

      <section className="mt-3">
        <div className="section-head">
          <h2>التقييمات والتعليقات</h2>
          <span className="eyebrow">{comments.length} تعليق</span>
        </div>

        <Alert>{commentsError}</Alert>

        {token && (
          <form className="panel mt-2" onSubmit={submitComment}>
            <div className="field">
              <label>تقييمك</label>
              <StarRating value={rating} onChange={setRating} size={22} />
            </div>
            <div className="field">
              <label>تعليقك</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={35}
                placeholder="شاركنا رأيك في هذه المنتج (٣٥ حرف كحد أقصى)"
                required
              />
            </div>
            <Alert type={commentMsg.includes("بنجاح") ? "success" : "error"}>{commentMsg}</Alert>
            <button className="btn btn-primary" disabled={posting}>
              {posting ? "جارِ الإرسال..." : "إضافة تعليق"}
            </button>
          </form>
        )}

        <div className="mt-3">
          {comments.length === 0 ? (
            <EmptyState title="لا توجد تعليقات بعد" hint="كن أول من يشارك رأيه في هذه المنتج." />
          ) : (
            comments.map((c) => {
              const isOwner = user && (
                c.user === user._id ||
                c.user?._id === user._id ||
                c.user?.toString?.() === user._id
              );
              const isEditing = editingId === c._id;
              return (
                <div className="comment" key={c._id}>
                  <div className="comment-head">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img
                        src={fileUrl("avatar", c.userAvatar) || "/lantern.svg"}
                        alt={c.username || "مستخدم"}
                        style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span className="comment-user">{c.username || "مستخدم"}</span>
                    </div>
                    <StarRating value={c.rating || 0} size={13} />
                  </div>
                  {isEditing ? (
                    <div className="stack">
                      <StarRating value={editRating} onChange={setEditRating} size={18} />
                      <textarea
                        value={editContent}
                        maxLength={35}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="row">
                        <button className="btn btn-primary btn-sm" onClick={() => saveEdit(c._id)}>
                          حفظ
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p style={{ margin: 0 }}>{c.content}</p>
                      {isOwner && (
                        <div className="comment-actions mt-1">
                          <button onClick={() => startEdit(c)}>تعديل</button>
                          <button onClick={() => removeComment(c._id)}>حذف</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
