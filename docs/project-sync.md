# ShareText（chatgpt-share-text）— Project Sync

> ChatGPT / 他 AI 向けの同期用ドキュメント。実装前に読むこと。

---

## 1. 概要

| 項目 | 内容 |
|------|------|
| リポジトリ | `chatgpt-share-text` |
| ローカルパス | `/Users/ebata/app/chatgpt-share-text` |
| 概要 | ChatGPT 共有 URL から会話をプレーンテキストに起こす Web ツール |

---

## 2. 制作クレジット（komolab 共通）

### 正式表記

**komolab - こもらぼ -**

- 「KomoLab」「こもラボ」など表記を揺らさない
- 箱荷こもる📦️の VTuber 名とは別に、**制作名・プロジェクトブランド**として扱う
- 箱荷こもる📦️が制作・運営する Web サイトやアプリ共通の制作名

### フッター表示

- サイト共通フッター（`src/components/Footer.tsx`）に表示
- 推奨表記: `制作・運営：komolab - こもらぼ -`
- ハッシュタグ `#komolab` / `#こもらぼ` は README 等に記載。フッターは制作名のみ（見た目をすっきり保つ）

### 設定ファイル

`src/config/site.ts` の `credit` で管理する。

```ts
{
  credit: {
    label: "制作・運営",
    name: "komolab - こもらぼ -",
    hashtags: ["#komolab", "#こもらぼ"],
    href: undefined, // 将来 /komolab や外部 URL を設定してリンク化
  },
}
```

---

## 3. 手動で追記する内容

- プロダクト方針・環境変数・デプロイ手順
- 削除した機能の説明が残っていないか、変更のたびに確認する
