import { NextResponse } from "next/server";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";
import { queryTable, updateRecord, User } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Harap login terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Password saat ini dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    // Ambil data user terkini
    const users = await queryTable<User>("Users", { key: "id", value: session.id });
    const user = users[0];
    if (!user) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan." }, { status: 404 });
    }

    // Verifikasi password saat ini
    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Password saat ini salah." },
        { status: 400 }
      );
    }

    // Hash password baru dan simpan
    const newHash = await hashPassword(newPassword);
    await updateRecord<User>("Users", user.id, { password_hash: newHash });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memperbarui password." },
      { status: 500 }
    );
  }
}

