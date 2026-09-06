export default function StarRating({ value = 0, onChange, size = 16 }) {
  const interactive = typeof onChange === "function";
  const stars = [1, 2, 3, 4, 5];

  return (
    <span className={`stars${interactive ? " interactive" : ""}`} style={{ fontSize: size }}>
      {stars.map((s) => (
        <span
          key={s}
          className={s > value ? "star-off" : ""}
          onClick={interactive ? () => onChange(s) : undefined}
          role={interactive ? "button" : undefined}
          aria-label={interactive ? `تقييم ${s} من 5` : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}
