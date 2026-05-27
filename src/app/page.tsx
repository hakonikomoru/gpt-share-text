import { ExtractTool } from "@/components/ExtractTool";

export default function HomePage() {
  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 text-center sm:mb-12">
        <p className="text-sm font-semibold tracking-wide text-[var(--color-accent)]">
          ShareText
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          ChatGPT 共有を
          <br className="sm:hidden" />
          テキストに起こす
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-[var(--color-muted)]">
          <code className="text-xs">chatgpt.com/share/...</code>{" "}
          を貼るだけ。会話全文をプレーンテキスト化してコピーできます。アカウント登録不要。
        </p>
      </header>

      <ExtractTool />

      <footer className="mt-14 border-t border-[var(--color-border)] pt-8 text-center text-xs text-[var(--color-muted)]">
        <p>
          非公式ツールです。OpenAI / ChatGPT とは関係ありません。
          <br />
          共有リンクの公開範囲・利用規約にご注意ください。
        </p>
      </footer>
    </div>
  );
}
