import { NextResponse } from "next/server";
import { queryTable, insertRecord, User, Role } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existing = await queryTable<User>("Users", { key: "email", value: cleanEmail });
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email ini sudah terdaftar. Silakan gunakan email lain atau login." },
        { status: 409 }
      );
    }

    // Cari ID untuk role "user"
    const roles = await queryTable<Role>("Roles", { key: "name", value: "user" });
    const userRoleId = roles[0]?.id || "role-user-02";

    // Hash password sebelum disimpan
    const hashedPassword = await hashPassword(password);

    // Simpan ke database
    const newUser = await insertRecord<User>("Users", {
      id: `user-${Date.now().toString(36)}`,
      name: name.trim(),
      email: cleanEmail,
      password_hash: hashedPassword,
      role_id: userRoleId,
      status: "active",
    });

    // Otomatis buat sesi login
    await createSession({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "user",
    });

    return NextResponse.json({
      success: true,
      message: "Akun berhasil didaftarkan.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "user",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mendaftarkan akun." },
      { status: 500 }
    );
  }
}

