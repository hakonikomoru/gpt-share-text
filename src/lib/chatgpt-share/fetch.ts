export async function fetchChatGptShareHtml(sourceUrl: string): Promise<string> {
  const res = await fetch(sourceUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ChatGptShareText/1.0; +https://github.com/hakonikomoru/chatgpt-share-text)",
      Accept: "text/html",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `共有ページの取得に失敗しました（${res.status} ${res.statusText}）`,
    );
  }

  return res.text();
}
