import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true, message: "Berhasil logout." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Gagal logout." }, { status: 500 });
  }
}

