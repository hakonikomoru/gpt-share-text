import Link from "next/link";

import { siteConfig } from "@/config/site";

const { credit } = siteConfig;

export function Footer() {
  const creditText = `${credit.label}：${credit.name}`;

  return (
    <footer className="mt-14 border-t border-[var(--color-border)] pt-8 text-center text-xs text-[var(--color-muted)]">
      <p>
        非公式ツールです。OpenAI / ChatGPT とは関係ありません。
        <br />
        会話データはサーバーに保存しません。起こしたテキストはブラウザ上にのみ表示されます。
        <br />
        共有リンクの公開範囲・利用規約にご注意ください。
      </p>
      <p className="mx-auto mt-4 max-w-md break-words leading-relaxed">
        {credit.href ? (
          <Link
            href={credit.href}
            className="transition hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)] focus:ring-offset-2"
          >
            {creditText}
          </Link>
        ) : (
          <span>{creditText}</span>
        )}
      </p>
    </footer>
  );
}
