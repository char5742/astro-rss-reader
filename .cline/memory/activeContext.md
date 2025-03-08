# アクティブコンテキスト: Astro RSS Reader

## 現在の作業の焦点

現在のプロジェクトの焦点は以下の通りです：

1. **RSSフィードの取得と解析機能の実装**
   - RSSとAtomフォーマットの両方に対応
   - フィードのメタデータ（タイトル、説明、画像など）の抽出
   - 記事データの正規化と保存

2. **ユーザーインターフェースの構築**
   - ホームページのレイアウト
   - フィード一覧表示
   - 記事カードコンポーネント
   - サイドナビゲーション

3. **データ永続化システムの実装**
   - SQLiteを使用したデータストレージ
   - アカウントごとのデータ分離
   - nanostores/persistentを使用した状態管理

4. **認証システムの構築**
   - ログイン/サインアップフロー
   - セッション管理
   - 認証状態の永続化

## 最近の変更

### 実装済みの機能

1. **フィード処理機能**
   - `src/features/feed/feed.ts`: フィードのメタデータ取得と検証
   - `src/features/feed/rss-parser.ts`: RSSとAtomフィードのパース
   - `src/features/feed/feed-converter.ts`: URLからフィードと記事データへの変換

2. **データ永続化**
   - `src/features/persistence/persistence.ts`: SQLiteを使用したキー・バリューストア
   - `src/store/index.ts`: アカウントごとのデータ分離を実現するカスタム永続化エンジン

3. **データモデル**
   - `src/types/article.ts`: 記事関連の型定義とZodスキーマ
   - `src/types/feed.ts`: フィード関連の型定義とZodスキーマ
   - `src/types/account.ts`: アカウント関連の型定義
   - `src/types/user.ts`: ユーザー関連の型定義

4. **ストア**
   - `src/store/articles.ts`: 記事のステータス管理
   - `src/store/settings.ts`: ユーザー設定の管理
   - `src/store/accounts.ts`: アカウント情報の管理
   - `src/store/users.ts`: ユーザー情報の管理

5. **UIコンポーネント**
   - `src/components/feeds/ArticleCard.astro`: 記事カードコンポーネント
   - `src/components/feeds/FeedHeader.astro`: フィードヘッダーコンポーネント
   - `src/components/home/ArticleCard.astro`: ホーム用記事カードコンポーネント
   - `src/components/home/FeedCard.astro`: フィードカードコンポーネント
   - `src/components/layouts/BadgedItem.astro`: バッジ付きアイテムコンポーネント
   - `src/components/layouts/Side.astro`: サイドナビゲーションコンポーネント

6. **ページ**
   - `src/pages/index.astro`: ホームページ
   - `src/pages/feeds.astro`: フィード一覧ページ
   - `src/pages/feeds/[id].astro`: 個別フィードページ
   - `src/pages/articles.astro`: 記事一覧ページ
   - `src/pages/auth/login.astro`: ログインページ
   - `src/pages/auth/signup.astro`: サインアップページ

7. **スタイリング**
   - `src/styles/tokens/`: デザイントークン（色、タイポグラフィ、スペーシングなど）
   - `src/styles/components/`: CSSコンポーネント（ボタン、カード、スイッチなど）
   - `src/styles/base/`: 基本スタイル（ベース、フォーム、ラインなど）
   - `src/styles/utilities/`: ユーティリティクラス

### 進行中の作業

1. **検索機能の実装**
   - 記事のタイトルと内容に対する全文検索
   - 検索結果の表示と並べ替え

2. **通知システムの構築**
   - 新着記事の通知
   - 重要なフィードの更新通知

3. **設定画面の実装**
   - テーマ設定（ライト/ダーク）
   - フォントサイズ調整
   - 通知設定

## 次のステップ

短期的な目標は以下の通りです：

1. **検索機能の完成**
   - インデックス作成の最適化
   - 検索結果のハイライト表示

2. **通知システムの完成**
   - バックグラウンド更新の実装
   - 通知の優先度設定

3. **設定画面の完成**
   - ユーザー設定の保存と適用
   - テーマ切替の実装

中期的な目標は以下の通りです：

1. **オフラインサポートの強化**
   - Service Workerの実装
   - オフラインでの記事閲覧

2. **パフォーマンスの最適化**
   - 画像の最適化
   - コードの分割とレイジーロード

3. **モバイル体験の向上**
   - タッチジェスチャーのサポート
   - モバイル向けレイアウトの改善

## アクティブな決定事項と考慮事項

### 決定済み事項

1. **データ永続化アプローチ**
   - SQLiteを使用したキー・バリューストア
   - JSONシリアライズによるデータ保存
   - アカウントごとのデータ分離

2. **UIアプローチ**
   - CSSコンポーネントを中心としたデザインシステム
   - HTMLとCSSを中心とした実装
   - 最小限のJavaScriptで必要な機能を実現

3. **状態管理**
   - nanostores/persistentを使用した永続的な状態管理
   - カスタム永続化エンジンによるアカウントごとのデータ分離
   - イベント駆動型の状態更新

### 検討中の事項

1. **フィード更新戦略**
   - バックグラウンド更新 vs ユーザーアクション時の更新
   - 更新頻度の設定（ユーザーごと、フィードごと）
   - 更新通知の方法

2. **検索機能の実装方法**
   - クライアントサイド検索 vs サーバーサイド検索
   - 全文検索インデックスの構築方法
   - 検索結果のランキングアルゴリズム

3. **認証システムの拡張**
   - ソーシャルログインの追加
   - 二要素認証の実装
   - パスワードレス認証の検討
