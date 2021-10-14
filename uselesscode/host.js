// Host API Route
app.get("/api/host", (req, res) => res.json(req.get("host")))