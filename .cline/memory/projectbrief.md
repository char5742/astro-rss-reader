# プロジェクト概要: Astro RSS Reader

## 基本情報

- **プロジェクト名**: Astro RSS Reader
- **バージョン**: 0.0.1
- **リポジトリ**: c:/work_space/programing/node/astro-rss-reader

## 目的

Astroフレームワークを使用したモダンなRSSリーダーアプリケーションを開発する。HTML、CSS、JSの分離を前提とした設計で、シンプルで使いやすいインターフェースを提供する。

## 主要機能

- RSSフィードの購読と管理
- 記事の閲覧とブックマーク
- 記事の検索機能
- ユーザー認証
- 通知システム
- 設定のカスタマイズ

## 技術スタック

- **フレームワーク**: [Astro](https://astro.build/)
- **ランタイム**: [Bun](https://bun.sh/)
- **スタイリング**: モダンCSS（カスタムプロパティ、ネスト、コンテナクエリなど）
- **データベース**: SQLite
- **状態管理**: nanostores/persistent
- **パーサー**: fast-xml-parser
- **型システム**: TypeScript + Zod

## 設計の特徴

- HTML、CSS、JSの分離を前提とした設計
- デザインシステムとして`styles/components`でCSSコンポーネントを管理
- 従来のようなReactコンポーネント（例：components/Button.tsx）を極力作成せず、デザイン的なコンポーネントはCSSで管理
- アカウントごとのデータ分離を実現するカスタム永続化エンジン
- 型安全性を重視したZodによるスキーマ定義

## 開発環境

- **開発サーバー**: `bun dev`
- **ビルド**: `bun build`
- **テスト**: `bun test`
