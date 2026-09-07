export default async function handler(req, res) {
  // Allow a configurable origin (set ALLOWED_ORIGIN in environment), default to localhost dev.
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5174";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST,PUT,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );

  // handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    // Parse query params safely — they may be strings or arrays depending on platform
    const rawPage = Array.isArray(req.query?.page)
      ? req.query.page[0]
      : req.query?.page;
    const rawLimit = Array.isArray(req.query?.limit)
      ? req.query.limit[0]
      : req.query?.limit;
    const page = Math.max(1, parseInt(rawPage || "1", 10) || 1);
    const limit = Math.max(1, parseInt(rawLimit || "12", 10) || 12);

    // Placeholder: if you have a DB, query it here using process.env.* connection strings.
    // Example mock items response so frontend can work while backend is fixed.
    const items = Array.from({ length: limit }).map((_, i) => ({
      id: (page - 1) * limit + i + 1,
      title: `Item ${(page - 1) * limit + i + 1}`,
      description: "Placeholder item while backend is unavailable.",
      price: Math.floor(Math.random() * 100) + 1,
    }));

    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    return res.status(200).json({ page, limit, items });
  } catch (err) {
    // Log the full stack to Vercel logs for debugging
    console.error("/api/items error:", err && (err.stack || err));
    return res
      .status(500)
      .json({ error: err?.message || "Internal server error" });
  }
}
