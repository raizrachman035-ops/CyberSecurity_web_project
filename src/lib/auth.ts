import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const COOKIE_NAME = "cyber_auth_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "default_development_secret_cybersecurity_2026_x87123"
);

/**
 * Hash password menggunakan bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Verifikasi password dengan hash bcrypt
 */
export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (err) {
    return false;
  }
}

/**
 * Buat JWT session token dan simpan di httpOnly cookie
 */
export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  return token;
}

/**
 * Ambil data user dari sesi aktif (httpOnly cookie)
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Hapus sesi (Logout)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Verifikasi user adalah admin (server-side protection)
 */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Akses ditolak: Hanya administrator yang dapat mengakses rute ini.");
  }
  return session;
}

