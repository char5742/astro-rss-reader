# 技術コンテキスト: Astro RSS Reader

## 使用技術

### フロントエンド

- **[Astro](https://astro.build/)** (v5.4.1)
  - アイランドアーキテクチャを採用したWebフレームワーク
  - 最小限のJavaScriptで高速なパフォーマンスを実現
  - HTMLとCSSを中心としたコンポーネントモデル

- **モダンCSS**
  - カスタムプロパティ（CSS変数）
  - CSSネスト
  - コンテナクエリ
  - グリッドレイアウト
  - フレックスボックス

- **[nanostores](https://github.com/nanostores/nanostores)** (v0.11.4)
  - 軽量な状態管理ライブラリ
  - リアクティブな更新
  - TypeScriptサポート

- **[nanostores/persistent](https://github.com/nanostores/persistent)** (v0.10.2)
  - nanostoresの永続化拡張
  - カスタム永続化エンジンをサポート

### バックエンド

- **[Node.js](https://nodejs.org/)** (via Astro)
  - サーバーサイドレンダリング
  - APIエンドポイント

- **[SQLite](https://www.sqlite.org/)** (via node:sqlite)
  - 軽量なリレーショナルデータベース
  - ファイルベースの保存
  - サーバーレス

### パーサー

- **[fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)** (v4.5.1)
  - 高速なXMLパーサー
  - RSSとAtomフィードの解析に使用

### ユーティリティ

- **[TypeScript](https://www.typescriptlang.org/)** (v5.8.2)
  - 静的型付け
  - コード補完
  - リファクタリングサポート

- **[Zod](https://github.com/colinhacks/zod)**
  - スキーマ検証ライブラリ
  - TypeScriptと統合された型安全性
  - ランタイムバリデーション

- **[DOMPurify](https://github.com/cure53/DOMPurify)** (via isomorphic-dompurify v2.22.0)
  - HTMLサニタイズライブラリ
  - XSS攻撃からの保護

### 開発ツール

- **[Bun](https://bun.sh/)**
  - 高速なJavaScriptランタイム
  - パッケージマネージャー
  - テストランナー

- **[Biome](https://biomejs.dev/)** (v1.9.4)
  - JavaScriptとTypeScriptのリンター
  - フォーマッター

- **[Stylelint](https://stylelint.io/)** (v16.14.1)
  - CSSリンター
  - スタイルの一貫性を確保

- **[Prettier](https://prettier.io/)** (v3.5.0)
  - コードフォーマッター
  - Astroプラグイン対応

- **[Happy DOM](https://github.com/capricorn86/happy-dom)** (v17.1.0)
  - 軽量なブラウザ環境エミュレーター
  - テスト用のDOM実装

## 開発環境のセットアップ

### 前提条件

- Node.js (v18以上)
- Bun (v1.0以上)

### インストール手順

```bash
# リポジトリのクローン
git clone <repository-url>
cd astro-rss-reader

# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev
```

### 開発コマンド

- **`bun dev`**: 開発サーバーを起動（ホットリロード対応）
- **`bun build`**: プロダクション用にビルド
- **`bun preview`**: ビルドされたアプリをプレビュー
- **`bun test`**: テストを実行
- **`bun lint`**: リンターを実行
- **`bun format`**: コードをフォーマット

## 技術的制約

### ブラウザサポート

- モダンブラウザ（Chrome、Firefox、Safari、Edge）の最新2バージョン
- Internet Explorerはサポート対象外

### パフォーマンス目標

- Lighthouse Performance Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- 初期ロードサイズ: < 100KB（gzip圧縮後）

### アクセシビリティ要件

- WCAG 2.1 AA準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 高コントラストモード対応

## 依存関係

### 主要な依存関係

```
astro: ^5.4.1
@astrojs/node: ^9.1.0
nanostores: ^0.11.4
@nanostores/persistent: ^0.10.2
fast-xml-parser: ^4.5.1
isomorphic-dompurify: ^2.22.0
```

### 開発依存関係

```
typescript: ^5.8.2
@biomejs/biome: 1.9.4
stylelint: ^16.14.1
prettier: ^3.5.0
prettier-plugin-astro: ^0.14.1
happy-dom: ^17.1.0
@happy-dom/global-registrator: ^17.0.3
```

## アーキテクチャの制約

1. **HTML/CSS/JSの分離**
   - JSはインタラクティブな機能に限定して使用
   - スタイリングはCSSファイルに集中
   - HTMLはセマンティックなマークアップを重視

2. **CSSコンポーネントの優先**
   - UIコンポーネントはできるだけCSSで実装
   - JSフレームワークコンポーネントの使用を最小限に

3. **データフローの一方向性**
   - ストアからUIへの一方向データフロー
   - イベント駆動型の状態更新

4. **型安全性の確保**
   - すべてのデータモデルにZodスキーマを定義
   - TypeScriptの厳格モードを有効化

5. **パフォーマンスの最適化**
   - 最小限のJavaScriptバンドル
   - 画像の最適化
   - 遅延ロード
