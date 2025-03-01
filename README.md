# Astro RSS Reader

Astroフレームワークを使用したモダンなRSSリーダーアプリケーションなのだ。HTML、CSS、JSの分離を前提とした設計で、シンプルで使いやすいインターフェースを提供するのだ。

## 機能

- RSSフィードの購読と管理
- 記事の閲覧とブックマーク
- 記事の検索機能
- ユーザー認証
- 通知システム
- 設定のカスタマイズ

## 技術スタック

- [Astro](https://astro.build/) - ウェブフレームワーク
- [Bun](https://bun.sh/) - JavaScriptランタイム
- モダンCSS - スタイリングシステム
- SQLite - データ永続化

## プロジェクト構造

```
.
├── docs
│   └── css-system-guide.md
├── public
│   ├── favicon.svg
│   └── og-image.png
├── src
│   ├── actions
│   │   └── index.ts
│   ├── assets
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components
│   │   ├── feeds
│   │   │   ├── ArticleActions.astro
│   │   │   ├── ArticleCard.astro
│   │   │   ├── ArticleFilters.astro
│   │   │   ├── ArticlePreview.astro
│   │   │   └── FeedHeader.astro
│   │   ├── home
│   │   │   ├── ArticleCard.astro
│   │   │   ├── BookmarkButton.astro
│   │   │   └── FeedCard.astro
│   │   ├── layouts
│   │   │   ├── BadgedItem.astro
│   │   │   ├── Head.astro
│   │   │   ├── LogoutButton.astro
│   │   │   └── Side.astro
│   │   ├── settings
│   │   │   └── KeywordChips.astro
│   │   ├── ArticlePreviewModal.astro
│   │   └── StatusNotification.astro
│   ├── data
│   │   └── feeds.ts
│   ├── features
│   │   ├── feed
│   │   │   ├── feed-converter.test.ts
│   │   │   ├── feed-converter.ts
│   │   │   ├── feed.test.ts
│   │   │   ├── feed.ts
│   │   │   ├── rss-parser.test.ts
│   │   │   └── rss-parser.ts
│   │   └── persistence
│   │       └── persistence.ts
│   ├── icons
│   │   ├── book.svg
│   │   ├── bookmark.svg
│   │   ├── description.svg
│   │   ├── logout.svg
│   │   ├── notifications.svg
│   │   ├── save.svg
│   │   ├── search.svg
│   │   ├── settings.svg
│   │   └── sliders.svg
│   ├── layouts
│   │   ├── AuthLayout.astro
│   │   └── Layout.astro
│   ├── pages
│   │   ├── api
│   │   │   └── articles
│   │   │       └── [id]
│   │   │           ├── bookmark.ts
│   │   │           ├── content.ts
│   │   │           ├── favorite.ts
│   │   │           └── status.ts
│   │   ├── auth
│   │   │   ├── login.astro
│   │   │   └── signup.astro
│   │   ├── feeds
│   │   │   └── [id].astro
│   │   ├── articles.astro
│   │   ├── bookmarks.astro
│   │   ├── feeds.astro
│   │   ├── index.astro
│   │   ├── index.test.ts
│   │   ├── notifications.astro
│   │   ├── search.astro
│   │   └── settings.astro
│   ├── store
│   │   ├── accounts.ts
│   │   ├── settings.ts
│   │   └── users.ts
│   ├── styles
│   │   ├── base
│   │   │   ├── base.css
│   │   │   ├── form.css
│   │   │   └── line.css
│   │   ├── components
│   │   │   ├── button.css
│   │   │   ├── card.css
│   │   │   ├── components.css
│   │   │   └── switch.css
│   │   ├── tokens
│   │   │   ├── animation.css
│   │   │   ├── color.css
│   │   │   ├── elevation.css
│   │   │   ├── spacing.css
│   │   │   ├── tokens.css
│   │   │   └── typography.css
│   │   ├── utilities
│   │   │   └── utilities.css
│   │   ├── README.md
│   │   ├── globals.css
│   │   └── reset.css
│   ├── types
│   │   ├── account.ts
│   │   ├── article.ts
│   │   ├── feed.ts
│   │   └── user.ts
│   ├── content.config.ts
│   └── middleware.ts
├── astro.config.mjs
├── bun.lock
├── bunfig.toml
├── happydom.ts
├── mydb.sqlite
├── package.json
├── source
└── tsconfig.json
```

## ディレクトリ構造の説明

- **docs/** - プロジェクトのドキュメント（CSSシステムガイドなど）
- **public/** - 静的アセット（ファビコン、OGイメージなど）
- **src/** - ソースコード
  - **actions/** - サーバーアクションの定義
  - **assets/** - プロジェクトで使用される画像などのアセット
  - **components/** - Astroコンポーネント
    - **feeds/** - フィード関連のコンポーネント
    - **home/** - ホームページ用コンポーネント
    - **layouts/** - レイアウト関連のコンポーネント
    - **settings/** - 設定画面用コンポーネント
  - **data/** - 静的データ定義
  - **features/** - 機能モジュール
    - **feed/** - フィード処理関連の機能とテスト
    - **persistence/** - データ永続化の機能
  - **icons/** - SVGアイコン
  - **layouts/** - ページレイアウト
  - **pages/** - Astroページ（ルーティング）
    - **api/** - APIエンドポイント
    - **auth/** - 認証関連ページ
    - **feeds/** - フィード表示ページ
  - **store/** - データストア
  - **styles/** - CSSスタイル
    - **base/** - 基本スタイル
    - **components/** - コンポーネントスタイル
    - **tokens/** - デザイントークン
    - **utilities/** - ユーティリティクラス
  - **types/** - TypeScript型定義

## 設計の特徴

このプロジェクトは、ReactやVueなどのJSフレームワークではなく、Astroによる、HTML、CSS、JSの分離を前提とした設計になっているのだ。

特にデザインシステムとして、`styles/components`でCSSコンポーネントを管理しているのが特徴なのだ。従来のようなReactコンポーネント（例：components/Button.tsx）を極力作成せず、デザイン的なコンポーネントはCSSで管理しているのだ。

## 開発方法

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev

# ビルド
bun build

# テスト実行
bun test
```
