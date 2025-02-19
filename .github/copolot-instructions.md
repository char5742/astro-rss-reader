# Astro RSS Reader Development Guidelines

## Project Structure Overview

### Core Directories

- `src/` - メインのソースコードディレクトリ
  - `actions/` - Astroのサーバーアクション
    - `index.ts` - メインのアクションファイル
  - `components/` - 再利用可能なAstroコンポーネント
    - `layouts/` - レイアウト関連コンポーネント（BadgedItem, Head, Side等）
    - `settings/` - 設定画面用コンポーネント
  - `features/` - 機能別のビジネスロジック
    - `feed/` - フィード処理関連（パース、変換、テスト）
    - `persistence/` - データ永続化ロジック
  - `pages/` - Astroのページコンポーネント
    - `auth/` - 認証関連ページ（login, signup）
    - `feeds/` - フィード関連ページ
  - `store/` - 状態管理（accounts, settings, users）
  - `types/` - TypeScript型定義（account, article, feed, user）

### Data and Configuration

- `data/` - アプリケーションデータ
  - `feeds.ts` - フィード関連データ定義
- `content.config.ts` - コンテンツ設定
- `middleware.ts` - ミドルウェア設定

### Styles

- `src/styles/` - スタイリングシステム
  - `base/` - 基本スタイル（base, form, line）
  - `components/` - コンポーネント固有のスタイル（button, card, switch）
  - `tokens/` - デザイントークン（color, spacing, typography等）
  - `utilities/` - ユーティリティクラス
  - `globals.css` - グローバルスタイル
  - `reset.css` - リセットスタイル

### Assets and Icons

- `src/assets/` - 静的アセット（astro.svg, background.svg）
- `src/icons/` - UIアイコン（book, bookmark, settings等）
- `public/` - 公開静的ファイル（favicon.svg, og-image.png）

### Testing

- テストファイルは実装と同じディレクトリに配置（\*.test.ts）
- `happydom.ts` - DOMテスト用設定

### Configuration Files

- `astro.config.mjs` - Astro設定
- `bunfig.toml` - Bun設定
- `tsconfig.json` - TypeScript設定
- `bun.lock` - 依存関係ロック

### Documentation

- `docs/` - プロジェクトドキュメント
  - `css-system-guide.md` - CSSシステムの設計方針とスタイリングガイド
    - デザイントークンの使用方法
    - コンポーネントスタイルの実装規則
    - ユーティリティクラスの活用ガイド
  - `page-list.md` - アプリケーションのページ構成と役割
    - 各ページの機能概要
    - ルーティング設計
    - ページ間の遷移フロー
  - `style-guide.md` - コーディングスタイルガイド
    - TypeScript/JavaScript コーディング規約
    - Astroコンポーネントの実装規則
    - テストコード作成ガイドライン

## Development Guidelines

### コード生成時の注意点

1. ディレクトリ構造の遵守

   - 新規機能は適切なディレクトリに配置
   - 命名規則に従う（小文字、ハイフン区切り）

2. スタイリング

   - コンポーネント固有のスタイルは `styles/components/` に配置
   - デザイントークンを優先的に使用
   - グローバルスタイルの追加は慎重に検討

3. コンポーネント開発

   - 再利用可能なコンポーネントは細分化
   - Props型の明示的な定義
   - レイアウトコンポーネントは `layouts/` に配置

4. テスト

   - 機能実装と同時にテストを作成
   - テストファイルは実装ファイルの隣に配置
   - `happydom.ts` を活用したDOM操作のテスト

5. 型の活用
   - 新しい型は `types/` ディレクトリに定義
   - 既存の型の再利用を推奨
   - 型安全性を重視

### パフォーマンスとベストプラクティス

1. アセット最適化

   - SVGアイコンの適切な最適化
   - 画像の最適なフォーマットとサイズ

2. コンポーネント設計

   - 適切な粒度での分割
   - Props経由のデータ受け渡し
   - イベントハンドリングの適切な実装

3. 状態管理

   - store/ディレクトリでの集中管理
   - 適切なデータフロー設計

4. エラーハンドリング
   - ユーザーフレンドリーなエラーメッセージ
   - 適切なエラーバウンダリの実装
