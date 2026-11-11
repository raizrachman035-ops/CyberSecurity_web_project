import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { queryTable, insertRecord, updateRecord, deleteRecord, NewsArticle } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function GET() {
  try {
    await requireAdmin();
    const news = await queryTable<NewsArticle>("News");
    return NextResponse.json({ success: true, news });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { title, excerpt, content, thumbnail_path, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Judul dan konten berita wajib diisi." },
        { status: 400 }
      );
    }

    const slug = slugify(title);

    // Hitung ID berurutan berdasarkan ID maksimum yang ada
    const allNews = await queryTable<NewsArticle>("News");
    const maxId = allNews.reduce((max, item) => {
      const num = parseInt(String(item.id), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = String(maxId + 1);

    const newArticle = await insertRecord<NewsArticle>("News", {
      id: nextId,
      title: title.trim(),
      slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
      excerpt: excerpt?.trim() || title.slice(0, 120),
      content: content.trim(),
      thumbnail_path: thumbnail_path || "/images/soc-center.png",
      status: status === "draft" ? "draft" : "published",
      author_id: admin.name || "Administrator",
    });

    return NextResponse.json({ success: true, article: newArticle });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, title, excerpt, content, thumbnail_path, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita wajib disertakan." }, { status: 400 });
    }

    const updateData: Partial<NewsArticle> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (excerpt !== undefined) updateData.excerpt = excerpt.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (thumbnail_path !== undefined) updateData.thumbnail_path = thumbnail_path;
    if (status !== undefined) updateData.status = status;

    const updated = await updateRecord<NewsArticle>("News", id, updateData);
    return NextResponse.json({ success: true, article: updated });
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
      return NextResponse.json({ success: false, error: "ID berita wajib disertakan." }, { status: 400 });
    }

    // Ambil data artikel untuk mengecek apakah thumbnail lokal perlu dibersihkan
    const newsList = await queryTable<NewsArticle>("News", { key: "id", value: id });
    const target = newsList[0];

    if (target && target.thumbnail_path && target.thumbnail_path.startsWith("/uploads/")) {
      await deleteFile(target.thumbnail_path);
    }

    await deleteRecord("News", id);
    return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

