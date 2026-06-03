import { NextResponse } from "next/server";

import { extractChatGptShareTextFromUrl } from "@/lib/chatgpt-share/extract";

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = (await req.json()) as { url?: string };
  } catch {
    return NextResponse.json({ ok: false, message: "リクエスト形式が不正です。" }, { status: 400 });
  }

  const url = body.url?.trim();
  if (!url) {
    return NextResponse.json(
      { ok: false, message: "共有 URL を入力してください。" },
      { status: 400 },
    );
  }

  const result = await extractChatGptShareTextFromUrl(url);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
  }

  return NextResponse.json(result);
}
