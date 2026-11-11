import { NextResponse } from "next/server";
import { queryTable, NewsArticle } from "@/lib/db";

export async function GET() {
  try {
    const allNews = await queryTable<NewsArticle>("News");
    const publishedNews = allNews.filter((n) => n.status === "published");
    return NextResponse.json({ success: true, news: publishedNews });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

