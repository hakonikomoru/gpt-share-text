import type { ChatGptShareBundle, ChatGptShareMessage } from "@/lib/chatgpt-share/types";

function roleLabel(role: ChatGptShareMessage["role"]): string {
  switch (role) {
    case "user":
      return "ユーザー";
    case "assistant":
      return "アシスタント";
    case "system":
      return "システム";
    case "tool":
      return "ツール";
    default:
      return role;
  }
}

export function buildChatGptSharePlainText(bundle: ChatGptShareBundle): string {
  const header = [
    bundle.title,
    bundle.sourceUrl,
    bundle.model ? `モデル: ${bundle.model}` : "",
  ].filter(Boolean);

  const body = bundle.messages.map((message) => {
    const label = roleLabel(message.role);
    return `【${label}】\n${message.content.trim()}`;
  });

  return [...header, "", ...body].filter((line) => line !== "").join("\n\n");
}
