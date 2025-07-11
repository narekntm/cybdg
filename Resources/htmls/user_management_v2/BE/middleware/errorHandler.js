export function errorHandler(err, req, res, next) {
  console.error("💥 Internal error:", err);
  res.status(500).json({ errors: ["Internal server error"] });
}
