const SHARE_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseChatGptShareUrl(input: string): {
  shareId: string;
  sourceUrl: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("共有 URL を入力してください。");
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("有効な URL を入力してください。");
  }

  if (!/^(chatgpt\.com|chat\.openai\.com)$/i.test(url.hostname)) {
    throw new Error("ChatGPT の共有 URL（chatgpt.com/share/...）を入力してください。");
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const shareIdx = parts.findIndex((p) => p === "share");
  const shareId = shareIdx >= 0 ? parts[shareIdx + 1] : parts[parts.length - 1];

  if (!shareId || !SHARE_ID_RE.test(shareId)) {
    throw new Error("共有 URL から ID を読み取れませんでした。");
  }

  const sourceUrl = `https://chatgpt.com/share/${shareId}`;
  return { shareId, sourceUrl };
}
