import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "nofh_admin";
const MAX_AGE = 60 * 60 * 12;

function secret(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("Настройте ADMIN_PASSWORD в переменных окружения.");
  return process.env.ADMIN_SECRET || createHash("sha256").update(`nofh-admin-session:${password}`).digest("hex");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export function checkPassword(input: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  return Boolean(configured) && safeEqual(input, configured!);
}

export async function createSession(): Promise<void> {
  const exp = String(Date.now() + MAX_AGE * 1000);
  const jar = await cookies();
  jar.set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const parts = raw.split(".");
  if (parts.length !== 2) return false;
  const [exp, sig] = parts;
  const expiry = Number(exp);
  if (!/^\d+$/.test(exp) || !Number.isSafeInteger(expiry) || expiry < Date.now()) return false;
  if (!/^[a-f0-9]{64}$/.test(sig)) return false;
  return safeEqual(sig, sign(exp));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
