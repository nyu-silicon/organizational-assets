import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data");
export const membersFile = path.join(dataDir, "members.json");

const COOKIE = "session";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production");
}
// In development a random secret is fine; sessions just reset on restart.
const secret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

export function loadMembers() {
  try {
    return JSON.parse(fs.readFileSync(membersFile, "utf8"));
  } catch {
    return [];
  }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Compared against when the email is unknown, so timing doesn't reveal which emails exist.
const dummyHash = hashPassword(crypto.randomBytes(16).toString("hex"));

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const actual = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(actual, Buffer.from(hash, "hex"));
}

export function authenticate(email, password) {
  const member = loadMembers().find((m) => m.email === email.trim().toLowerCase());
  const ok = verifyPassword(password, member?.password ?? dummyHash);
  return ok && member ? member : null;
}

function sign(value) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function setSession(res, email) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + MAX_AGE })).toString("base64url");
  res.cookie(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
  });
}

export function clearSession(res) {
  res.clearCookie(COOKIE);
}

function readSession(req) {
  const raw = req.headers.cookie
    ?.split(";")
    .map((c) => c.trim().split("="))
    .find(([name]) => name === COOKIE)?.[1];
  if (!raw) return null;

  const [payload, sig] = raw.split(".");
  const expected = sign(payload);
  if (!sig || sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  const { email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
  return exp > Date.now() ? email : null;
}

// Attaches the logged-in member to req.member, or responds 401.
export function requireMember(req, res, next) {
  const email = readSession(req);
  const member = email && loadMembers().find((m) => m.email === email);
  if (!member) return res.status(401).json({ error: "not signed in" });
  req.member = member;
  next();
}
