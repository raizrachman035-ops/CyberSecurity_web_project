import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { queryTable, insertRecord, deleteRecord, Role } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const roles = await queryTable<Role>("Roles");
    return NextResponse.json({ success: true, roles });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Nama role wajib diisi." }, { status: 400 });
    }

    const cleanName = name.trim().toLowerCase();

    // Cek duplikasi
    const existing = await queryTable<Role>("Roles", { key: "name", value: cleanName });
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: `Role '${cleanName}' sudah ada.` }, { status: 409 });
    }

    const newRole = await insertRecord<Role>("Roles", {
      id: `role-${Date.now().toString(36)}`,
      name: cleanName,
      description: description?.trim() || "Role kustom",
      permissions: Array.isArray(permissions) ? permissions : ["read"],
      is_system: false,
    });

    return NextResponse.json({ success: true, role: newRole });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID role wajib disertakan." }, { status: 400 });
    }

    const roles = await queryTable<Role>("Roles", { key: "id", value: id });
    const targetRole = roles[0];

    if (!targetRole) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    if (targetRole.is_system) {
      return NextResponse.json(
        { success: false, error: "Role sistem bawaan (admin/user) tidak boleh dihapus." },
        { status: 403 }
      );
    }

    await deleteRecord("Roles", id);
    return NextResponse.json({ success: true, message: "Role berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

