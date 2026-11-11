import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan dalam form." }, { status: 400 });
    }

    const result = await saveFile(file);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      path: result.path,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

