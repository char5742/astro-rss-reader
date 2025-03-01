# Astro RSS Reader 技術コンテキスト

## 技術スタック

### フロントエンド
- **フレームワーク**: [Astro](https://astro.build/) v5.3.0
- **言語**: TypeScript
- **スタイリング**: CSS（モダンCSS機能、CSSカスタムプロパティ）
- **状態管理**: [nanostores](https://github.com/nanostores/nanostores) v0.11.4、[@nanostores/persistent](https://github.com/nanostores/persistent) v0.10.2

### バックエンド
- **サーバー**: Astro SSR（@astrojs/node v9.1.0）
- **データベース**: SQLite（ローカルストレージ）

### ユーティリティ
- **XML解析**: [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) v4.5.1
- **HTML浄化**: [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify) v2.22.0
- **アイコン**: [astro-icon](https://github.com/natemoo-re/astro-icon) v1.1.5

### 開発ツール
- **パッケージマネージャー**: [Bun](https://bun.sh/)
- **テスト**: Bun Test
- **リンター**: [Biome](https://biomejs.dev/) v1.9.4
- **スタイルリンター**: [Stylelint](https://stylelint.io/) v16.14.1
- **フォーマッター**: [Prettier](https://prettier.io/) v3.5.0
- **テスト環境**: [happy-dom](https://github.com/capricorn86/happy-dom) v17.1.0

## 開発環境セットアップ

### 前提条件
- Node.js v18以上（推奨: v20）
- Bun v1.0以上

### インストール手順
```bash
# リポジトリのクローン
git clone <repository-url>
cd astro-rss-reader

# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev
```

### 開発コマンド
- `bun run dev`: 開発サーバーの起動（http://localhost:4321）
- `bun run build`: プロダクションビルドの作成
- `bun run preview`: ビルドされたサイトのプレビュー
- `bun test`: テストの実行

## プロジェクト構造

```
astro-rss-reader/
├── public/             # 静的アセット
├── src/
│   ├── actions/        # Astroアクション
│   ├── assets/         # 画像などのアセット
│   ├── components/     # UIコンポーネント
│   ├── data/           # 静的データ
│   ├── features/       # 機能モジュール
│   ├── icons/          # SVGアイコン
│   ├── layouts/        # ページレイアウト
│   ├── pages/          # ページとAPIエンドポイント
│   ├── routes/         # 追加のルート
│   ├── store/          # 状態管理
│   ├── styles/         # グローバルスタイルとデザインシステム
│   └── types/          # 型定義
├── .prettierrc.mjs     # Prettier設定
├── .stylelintrc.cjs    # Stylelint設定
├── astro.config.mjs    # Astro設定
├── bunfig.toml         # Bun設定
├── happydom.ts         # Happy DOM設定
├── package.json        # プロジェクト依存関係
└── tsconfig.json       # TypeScript設定
```

## 技術的制約

### パフォーマンス
- **ターゲット**: First Contentful Paint < 1.5秒
- **バンドルサイズ**: メインバンドル < 100KB（gzip圧縮後）
- **メモリ使用量**: ローカルストレージの使用を最適化

### ブラウザサポート
- モダンブラウザ（Chrome、Firefox、Safari、Edge最新版）
- IE11はサポート対象外

### アクセシビリティ
- WCAG 2.1 AA準拠を目標
- スクリーンリーダー対応
- キーボードナビゲーション

### セキュリティ
- コンテンツセキュリティポリシー（CSP）の実装
- ユーザー入力の検証と浄化
- クロスサイトスクリプティング（XSS）対策

## 依存関係管理

### コア依存関係
- **Astro**: ウェブサイト構築フレームワーク
- **nanostores**: 軽量状態管理ライブラリ
- **fast-xml-parser**: RSSフィードの解析
- **isomorphic-dompurify**: HTML浄化（XSS対策）

### 開発依存関係
- **Bun**: 高速JavaScriptランタイムとパッケージマネージャー
- **Biome**: リンターとフォーマッター
- **Stylelint**: CSSリンター
- **happy-dom**: ブラウザ環境のエミュレーション（テスト用）

## ビルドとデプロイ

### ビルドプロセス
1. TypeScriptのコンパイル
2. Astroのビルド（SSRモード）
3. CSSの最適化（lightningcss）
4. 静的アセットの処理

### デプロイ戦略
- **開発環境**: ローカル開発サーバー
- **ステージング**: プルリクエストごとのプレビューデプロイ
- **本番環境**: メインブランチへのマージ時に自動デプロイ

## テスト戦略

### ユニットテスト
- 個別の機能モジュールのテスト
- happy-domを使用したブラウザ環境のエミュレーション

### 統合テスト
- コンポーネント間の相互作用のテスト
- APIエンドポイントのテスト

### E2Eテスト
- ユーザーフローの検証
- 実際のブラウザでのテスト

## パフォーマンス最適化

### 実装済み
- Astroの部分的ハイドレーション
- 画像の最適化
- CSSの最適化（lightningcss）

### 計画中
- Service Workerによるオフラインサポート
- コンテンツのプリフェッチ
- レンダリングパフォーマンスの向上
