import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { queryTable, updateRecord, deleteRecord, User, Role } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();

    const [users, roles] = await Promise.all([
      queryTable<User>("Users"),
      queryTable<Role>("Roles"),
    ]);

    const roleMap = new Map(roles.map((r) => [r.id, r.name]));

    const sanitizedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role_id: u.role_id,
      role_name: roleMap.get(u.role_id) || "user",
      status: u.status,
      created_at: u.created_at,
      updated_at: u.updated_at,
    }));

    return NextResponse.json({ success: true, users: sanitizedUsers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { id, status, role_id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID user wajib disertakan." }, { status: 400 });
    }

    // Proteksi: Admin tidak bisa menonaktifkan dirinya sendiri
    if (admin.id === id && status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menonaktifkan akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    const updateData: Partial<User> = {};
    if (status !== undefined) updateData.status = status;
    if (role_id !== undefined) updateData.role_id = role_id;

    const updated = await updateRecord<User>("Users", id, updateData);
    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID user wajib disertakan." }, { status: 400 });
    }

    // Proteksi: Admin tidak dapat menghapus dirinya sendiri
    if (admin.id === id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    // Cek apakah ini admin terakhir
    const users = await queryTable<User>("Users");
    const targetUser = users.find((u) => u.id === id);
    const roles = await queryTable<Role>("Roles");
    const adminRole = roles.find((r) => r.name === "admin");

    if (targetUser && adminRole && targetUser.role_id === adminRole.id) {
      const remainingAdmins = users.filter((u) => u.role_id === adminRole.id && u.id !== id);
      if (remainingAdmins.length === 0) {
        return NextResponse.json(
          { success: false, error: "Tidak dapat menghapus admin terakhir pada sistem." },
          { status: 400 }
        );
      }
    }

    await deleteRecord("Users", id);
    return NextResponse.json({ success: true, message: "User berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

