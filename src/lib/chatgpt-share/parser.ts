import type { ChatGptShareBundle, ChatGptShareMessage } from "@/lib/chatgpt-share/types";

function unescapeStreamText(raw: string): string {
  return raw
    .replace(/\\\\n/g, "\n")
    .replace(/\\\\t/g, "\t")
    .replace(/\\\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function extractMeta(html: string): Partial<ChatGptShareBundle> {
  const shareId =
    html.match(/sharedConversationId\\",\\"([a-f0-9-]+)/i)?.[1] ??
    html.match(/share\/([a-f0-9-]+)/i)?.[1] ??
    "";
  const title =
    unescapeStreamText(html.match(/pageTitle\\",\\"([^"\\]+)/)?.[1] ?? "").trim() ||
    "ChatGPT 共有会話";
  const conversationId = html.match(/conversation_id\\",\\"([a-f0-9-]+)/i)?.[1] ?? null;
  const model = html.match(/default_model_slug\\",\\"([^"\\]+)/)?.[1] ?? null;
  const createTime = html.match(/create_time\\",(\d+\.?\d*)/)?.[1];
  const updateTime = html.match(/update_time\\",(\d+\.?\d*)/)?.[1];
  const attachment = html.match(/name\\",\\"([^"\\]+)\\"/)?.[1] ?? null;

  return {
    shareId,
    title,
    conversationId,
    model,
    createdAt: createTime ? new Date(Number(createTime) * 1000).toISOString() : null,
    updatedAt: updateTime ? new Date(Number(updateTime) * 1000).toISOString() : null,
    attachmentNote: attachment,
  };
}

function cleanAssistantContent(raw: string): string {
  let content = unescapeStreamText(raw);
  const trimMarkers = [
    '\\",\\"role\\",\\"assistant',
    '",\\"role\\",\\"assistant',
    '\\",\\\"role\\\",\\\"assistant',
  ];
  for (const marker of trimMarkers) {
    const idx = content.indexOf(marker);
    if (idx > 0) content = content.slice(0, idx);
  }
  return content
    .replace(/\uE200filecite\uE202[^\uE201]+\uE201/g, "")
    .replace(/filecite[^]+/g, "")
    .trim();
}

function looksLikeAssistantText(text: string): boolean {
  if (text.length > 800) return true;
  if (/^#{1,3}\s/m.test(text)) return true;
  if (/\*\*[^*]+\*\*/.test(text) && text.length > 200) return true;
  if (text.includes("```")) return true;
  return false;
}

function isNoiseUserText(text: string): boolean {
  if (text.includes("--QDF=")) return true;
  if (text.includes("queries")) return true;
  if (/^[\s\[\]{}:",\\]+$/.test(text)) return true;
  return false;
}

function extractUserPrompts(html: string): string[] {
  const seen = new Set<string>();
  const prompts: string[] = [];

  const jaRe =
    /\\"([\u3040-\u30ff\u4e00-\u9fff\uff00-\uffef][^"\\]{12,700}[。？！?])\\"/g;
  let match: RegExpExecArray | null;
  while ((match = jaRe.exec(html)) !== null) {
    const text = unescapeStreamText(match[1]!).trim();
    if (isNoiseUserText(text)) continue;
    if (looksLikeAssistantText(text)) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    prompts.push(text);
  }

  const shortPartsRe = /\\"parts\\",\[\d+\],\\"([^"\\]{8,700})\\"/g;
  while ((match = shortPartsRe.exec(html)) !== null) {
    const text = unescapeStreamText(match[1]!).trim();
    if (isNoiseUserText(text)) continue;
    if (looksLikeAssistantText(text)) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    prompts.push(text);
  }

  return prompts.sort((a, b) => a.length - b.length);
}

function extractAssistantParts(html: string): string[] {
  const results: string[] = [];
  const endMarkers = [
    '\\",\\"role\\",\\"assistant',
    '\\",\\"content_type\\"',
    '\\"],\\"content_type\\"',
  ];

  const headRe = /\\"parts\\",\[\d+\],\\"/g;
  let head: RegExpExecArray | null;
  while ((head = headRe.exec(html)) !== null) {
    const bodyStart = head.index + head[0].length;
    let bodyEnd = html.length;
    for (const marker of endMarkers) {
      const idx = html.indexOf(marker, bodyStart);
      if (idx > bodyStart && idx < bodyEnd) bodyEnd = idx;
    }
    const content = cleanAssistantContent(html.slice(bodyStart, bodyEnd));
    if (content.length < 200) continue;
    if (content.startsWith("{") && content.includes("queries")) continue;
    results.push(content);
  }

  return [...new Set(results)].sort((a, b) => b.length - a.length);
}

function buildMessageList(html: string): Array<{ role: string; content: string }> {
  const userPrompts = extractUserPrompts(html);
  const assistantParts = extractAssistantParts(html);
  const ordered: Array<{ role: string; content: string }> = [];

  if (userPrompts.length === 0 && assistantParts.length === 0) return ordered;

  const primaryUser = userPrompts[0];
  if (primaryUser) ordered.push({ role: "user", content: primaryUser });
  if (assistantParts[0])
    ordered.push({ role: "assistant", content: assistantParts[0]! });

  for (let i = 1; i < userPrompts.length; i += 1) {
    ordered.push({ role: "user", content: userPrompts[i]! });
    if (assistantParts[i]) {
      ordered.push({ role: "assistant", content: assistantParts[i]! });
    }
  }

  for (let i = userPrompts.length; i < assistantParts.length; i += 1) {
    if (!ordered.some((m) => m.content === assistantParts[i])) {
      ordered.push({ role: "assistant", content: assistantParts[i]! });
    }
  }

  return ordered;
}

function dedupeMessages(
  raw: Array<{ role: string; content: string }>,
): ChatGptShareMessage[] {
  const out: ChatGptShareMessage[] = [];
  for (const item of raw) {
    const role = item.role as ChatGptShareMessage["role"];
    if (role !== "user" && role !== "assistant") continue;
    const prev = out[out.length - 1];
    if (prev && prev.role === role && prev.content === item.content) continue;
    out.push({
      index: out.length + 1,
      role,
      content: item.content.trim(),
    });
  }
  return out;
}

function extractPhraseFrequency(html: string): ChatGptShareBundle["phraseFrequency"] {
  const block = html.match(/final_expression_output\\",\\"(\[[\s\S]*?\])\\"/)?.[1];
  if (!block) return null;
  try {
    const normalized = unescapeStreamText(block)
      .replace(/'/g, '"')
      .replace(/\(/g, "[")
      .replace(/\)/g, "]");
    const parsed = JSON.parse(normalized) as Array<[string, number]>;
    return parsed
      .filter((row) => Array.isArray(row) && row.length === 2)
      .map(([phrase, count]) => ({ phrase: String(phrase), count: Number(count) }))
      .filter((row) => Number.isFinite(row.count));
  } catch {
    return null;
  }
}

export function parseChatGptShareHtml(
  html: string,
  sourceUrl: string,
  shareIdHint?: string,
): ChatGptShareBundle {
  const meta = extractMeta(html);
  const messages = dedupeMessages(buildMessageList(html));

  return {
    shareId: shareIdHint ?? meta.shareId ?? "",
    title: meta.title ?? "ChatGPT 共有会話",
    sourceUrl,
    importedAt: new Date().toISOString(),
    conversationId: meta.conversationId ?? null,
    model: meta.model ?? null,
    createdAt: meta.createdAt ?? null,
    updatedAt: meta.updatedAt ?? null,
    attachmentNote: meta.attachmentNote ?? null,
    messages,
    phraseFrequency: extractPhraseFrequency(html),
  };
}
