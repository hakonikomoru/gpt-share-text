import { fetchChatGptShareHtml } from "@/lib/chatgpt-share/fetch";
import { parseChatGptShareUrl } from "@/lib/chatgpt-share/normalize-url";
import { parseChatGptShareHtml } from "@/lib/chatgpt-share/parser";
import { buildChatGptSharePlainText } from "@/lib/chatgpt-share/plain-text";

export type ExtractChatGptShareTextResult =
  | {
      ok: true;
      title: string;
      sourceUrl: string;
      messageCount: number;
      text: string;
    }
  | { ok: false; message: string };

export async function extractChatGptShareTextFromUrl(
  inputUrl: string,
): Promise<ExtractChatGptShareTextResult> {
  let shareId: string;
  let sourceUrl: string;
  try {
    ({ shareId, sourceUrl } = parseChatGptShareUrl(inputUrl));
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "URL の解析に失敗しました。",
    };
  }

  let html: string;
  try {
    html = await fetchChatGptShareHtml(sourceUrl);
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "共有ページの取得に失敗しました。",
    };
  }

  const bundle = parseChatGptShareHtml(html, sourceUrl, shareId);
  bundle.shareId = shareId;
  bundle.sourceUrl = sourceUrl;

  if (bundle.messages.length === 0) {
    return {
      ok: false,
      message:
        "会話メッセージを抽出できませんでした。共有リンクの形式が変わった可能性があります。",
    };
  }

  return {
    ok: true,
    title: bundle.title,
    sourceUrl: bundle.sourceUrl,
    messageCount: bundle.messages.length,
    text: buildChatGptSharePlainText(bundle),
  };
}
