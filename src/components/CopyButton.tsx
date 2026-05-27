"use client";

import { useState } from "react";

type Props = {
  text: string;
  className?: string;
};

export function CopyButton({ text, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      disabled={!text}
      className={`inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 ${className}`}
    >
      {copied ? "コピーしました" : "全文をコピー"}
    </button>
  );
}
