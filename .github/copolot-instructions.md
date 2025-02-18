# Astro RSS Reader Development Guidelines

## Project Structure Overview

### Core Directories

- `src/` - メインのソースコードディレクトリ
  - `actions/` - Astroのサーバーアクション
  - `components/` - 再利用可能なAstroコンポーネント
  - `features/` - 機能別のビジネスロジック（RSS解析、永続化など）
  - `pages/` - Astroのページコンポーネント
  - `store/` - 状態管理
  - `types/` - TypeScript型定義

### Styles

- `src/styles/` - スタイリングシステム
  - `base/` - 基本スタイル
  - `components/` - コンポーネント固有のスタイル
  - `tokens/` - デザイントークン
  - `utilities/` - ユーティリティクラス
  - 詳細は `src/styles/README.md` を参照

### Assets and Icons

- `src/assets/` - 画像やSVGなどの静的アセット
- `src/icons/` - アプリケーション全体で使用するアイコン
- `public/` - 直接公開される静的ファイル

### Documentation

- `docs/` - プロジェクトドキュメント
  - `page-list.md` - ページ一覧とその説明
  - `style-guide.md` - スタイリングガイドライン
  - `css-system-guide.md` - CSSシステムガイドライン

## Development Guidelines

### コード生成時の注意点

1. ドキュメントの確認

   - 実装前に `docs/` ディレクトリ内のドキュメントを確認
   - 特に `style-guide.md` の規約に従う

2. スタイリング

   - スタイルの追加・修正時は `src/styles/README.md` を参照
   - デザイントークンを活用し、一貫性のあるデザインを維持

3. 型の活用

   - `src/types/` 配下の型定義を活用
   - 新機能追加時は適切な型定義を作成

4. フィーチャーの配置

   - 新機能は `src/features/` に適切なサブディレクトリを作成
   - テストファイルは対応する実装の隣に配置

5. コンポーネント
   - 再利用可能なコンポーネントは `src/components/` に配置
   - レイアウト関連のコンポーネントは `components/layouts/` に配置

### テスト

- `.test.ts` ファイルを実装ファイルと同じディレクトリに配置
- `happydom.ts` を使用してDOMのテストを実施
