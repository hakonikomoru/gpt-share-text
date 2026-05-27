"use client";

import { useState } from "react";

import { CopyButton } from "@/components/CopyButton";

type ExtractResponse = {
  ok?: boolean;
  message?: string;
  title?: string;
  sourceUrl?: string;
  messageCount?: number;
  text?: string;
};

export function ExtractTool() {
  const [url, setUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState<number | null>(null);
  const [text, setText] = useState("");

  async function handleExtract() {
    if (!url.trim()) {
      setError("共有 URL を入力してください。");
      return;
    }
    setExtracting(true);
    setError(null);
    setTitle(null);
    setSourceUrl(null);
    setMessageCount(null);
    setText("");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = (await res.json()) as ExtractResponse;
      if (!res.ok || !data.ok || !data.text) {
        setError(data.message ?? "テキストの取得に失敗しました。");
        return;
      }
      setTitle(data.title ?? "ChatGPT 共有会話");
      setSourceUrl(data.sourceUrl ?? url.trim());
      setMessageCount(data.messageCount ?? 0);
      setText(data.text);
    } catch {
      setError("テキストの取得に失敗しました。");
    } finally {
      setExtracting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
        <label htmlFor="share-url" className="block text-sm font-medium">
          ChatGPT 共有 URL
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="share-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleExtract();
            }}
            placeholder="https://chatgpt.com/share/..."
            className="min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-[var(--color-accent)] focus:ring-2"
            disabled={extracting}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => void handleExtract()}
            disabled={extracting}
            className="shrink-0 rounded-xl px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ background: "var(--color-accent)" }}
          >
            {extracting ? "起こし中…" : "テキストに起こす"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        )}
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          会話データはサーバーに保存しません。起こしたテキストはブラウザ上にのみ表示されます。
        </p>
      </section>

      {text && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {messageCount != null && <span>メッセージ {messageCount} 件 · </span>}
                {sourceUrl && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-[var(--color-accent)] underline-offset-2"
                  >
                    元の共有ページ
                  </a>
                )}
              </p>
            </div>
            <CopyButton text={text} />
          </div>
          <textarea
            readOnly
            value={text}
            rows={22}
            className="mt-5 min-h-[min(55vh,520px)] w-full resize-y rounded-xl border border-[var(--color-border)] bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-800"
            aria-label="起こしたテキスト"
          />
        </section>
      )}
    </div>
  );
}
