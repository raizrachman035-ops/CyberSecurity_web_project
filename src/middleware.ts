import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "cyber_auth_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "default_development_secret_cybersecurity_2026_x87123"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi rute /dashboard dan sub-ruternya
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const role = payload.role as string;

      if (role !== "admin") {
        // Jika bukan admin, tendang ke login dengan pesan error akses
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized_role");
        return NextResponse.redirect(loginUrl);
      }
    } catch (err) {
      // Token tidak valid atau kedaluwarsa
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};

