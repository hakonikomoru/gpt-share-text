# ShareText（chatgpt-share-text）

ChatGPT の**共有 URL**（`https://chatgpt.com/share/...`）を貼り付けると、会話本文を**プレーンテキスト**に起こす Web ツールです。

[KomoLab Dashboard](https://github.com/hakonikomoru/komolab-dashboard) の「ChatGPT 共有 → テキスト起こし」機能を単体サイト化したリポジトリです。

## 機能

- 共有ページをサーバー側で取得し、会話を抽出
- ユーザー / アシスタントごとにラベル付きテキストを表示
- ワンクリックで全文コピー
- **会話データは保存しない**（リクエストごとに処理して返すのみ）

## 開発

```bash
cd ~/app/chatgpt-share-text
npm install
npm run dev
```

http://localhost:3003 で起動します。

## 本番デプロイ（Vercel 想定）

1. GitHub にリポジトリを作成して push
2. [Vercel](https://vercel.com) で Import
3. Framework: Next.js（デフォルト）

環境変数は不要です。

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー（ポート 3003） |
| `npm run build` | 本番ビルド |
| `npm test` | Vitest（URL 解析など） |

## 技術

- Next.js 16（App Router）
- 抽出ロジックは `src/lib/chatgpt-share/`（Dashboard 由来）

## 注意

- ChatGPT の HTML 構造が変わると抽出に失敗する場合があります
- 共有リンクが非公開・削除されている場合は取得できません

## 制作クレジット（komolab）

**komolab - こもらぼ -** は、箱荷こもる📦️が制作・運営する Web サイトやアプリ共通の制作名です。

- フッターおよびクレジットに表示（`src/components/Footer.tsx` / `src/config/site.ts`）
- 関連ハッシュタグ: `#komolab` / `#こもらぼ`
- VTuber 名「箱荷こもる📦️」とは別に、制作名・プロジェクトブランドとして扱う
