import { NextResponse } from "next/server";
import { queryTable, User, Role } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const users = await queryTable<User>("Users", { key: "email", value: email.trim().toLowerCase() });
    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Akun Anda dinonaktifkan oleh administrator." },
        { status: 403 }
      );
    }

    // Verifikasi password hash bcrypt
    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // Cari nama role
    const roles = await queryTable<Role>("Roles", { key: "id", value: user.role_id });
    const roleName = roles[0]?.name || "user";

    // Buat session cookie JWT
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}

