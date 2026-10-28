import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authenticate, clearSession, requireMember, setSession } from "./auth.js";

const app = express();
const PORT = process.env.PORT || 3001;
const here = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "email and password required" });
  }
  const member = authenticate(email, password);
  if (!member) return res.status(401).json({ error: "invalid email or password" });
  setSession(res, member.email);
  res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

app.get("/api/dashboard", requireMember, (req, res) => {
  const { name, email, joined } = req.member;
  const announcements = JSON.parse(fs.readFileSync(path.join(here, "../data/announcements.json"), "utf8"));
  res.json({ member: { name, email, joined }, announcements });
});

// In production, serve the built frontend from the same server.
if (process.env.NODE_ENV === "production") {
  const dist = path.resolve(here, "../../frontend/dist");
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
