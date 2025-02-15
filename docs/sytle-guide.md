# Modern CSS Coding Guide (2025版)

## 1. プロジェクトアーキテクチャ

各種スタイルは明確な階層構造で管理します。たとえば、以下のような cascade layers を活用してください。

```css
@layer reset, theme, global, layout, components, utilities;
```

_【注意】_ 各レイヤーは順序が重要です。グローバルなリセットやテーマ設定を最初に、コンポーネント固有のスタイルは後ろに配置することで、意図した優先順位が確実に反映されます。  
citeturn2fetch0

また、プロジェクトディレクトリは以下のように整理してください。

- **src/** … コンポーネント毎のソースコード
- **assets/** … 画像・フォント等のリソース
- **docs/** … 本ガイドや仕様書

---

## 2. CSS Reset とグローバルスタイル

最新ブラウザ向けにリセットCSSを拡張し、以下のルールを必ず導入してください。

```css
/* デフォルトリンクのスタイル調整 */
a:not([class]) {j
  text-decoration-thickness: max(0.08em, 1px);
  text-underline-offset: 0.15em;
}

/* :focus-visible によるフォーカスリングの統一 */
:focus-visible {
  --outline-size: max(2px, 0.15em);
  outline: var(--outline-width, var(--outline-size)) var(--outline-style, solid)
    var(--outline-color, currentColor);
  outline-offset: var(--outline-offset, var(--outline-size));
}

/* アンカーリンク（:target）やフォーカス時のスクロール位置調整 */
:target {
  scroll-padding-block-start: 2rem;
}
:focus {
  scroll-padding-block-end: 8vh;
}
```

この設定により、リンクやフォーカス状態が一貫したビジュアルで表示され、ユーザビリティが向上します。  
citeturn2fetch0

---

## 3. モダンCSS機能の活用

### 3.1 ネイティブ CSS ネスティング

最新のネイティブネスティングを使用して、セレクタの階層構造を簡潔に記述してください。たとえば、コンポーネントの内部構造は以下のように記述します。

```css
.card {
  background: var(--card-bg, #fff);
  padding: 1rem;
  border-radius: 0.5rem;

  h2 {
    margin-top: 0;
  }

  &.highlight {
    background: var(--highlight-bg, #f0f);
  }
}
```

これにより、可読性と保守性が大幅に向上します。  
citeturn2fetch0

### 3.2 Cascade Layers の活用

cascade layers を利用して、グローバル、レイアウト、コンポーネント、ユーティリティの各スタイルの優先順位を明確に管理してください。

```css
@layer global {
  p {
    margin-bottom: 2rem;
    color: hsl(245, 30%, 30%);
  }
}
```

この手法により、意図しないスタイルの上書きを防ぎ、第三者ライブラリとの統合も容易になります。  
citeturn2fetch0

### 3.3 Container Queries の導入

各コンポーネントが自身の親コンテナのサイズに応じたレイアウト変更を行えるよう、container queries を活用します。親要素に名前を設定し、子要素はそのサイズに応じたスタイルを適用してください。

```css
.layout-grid > * {
  container: grid-item / inline-size;
}
```

これにより、柔軟なレスポンシブ設計が実現できます。  
citeturn2fetch0

### 3.4 カスタムプロパティと @property

型指定されたカスタムプロパティ（@property）を使用することで、アニメーション補間やテーマの一貫性を保ちます。以下はその定義例です。

```css
@property --color-primary {
  syntax: "<color>";
  inherits: false;
  initial-value: rebeccapurple;
}
```

これにより、CSS変数に型情報が付加され、ブラウザがより適切に補間処理を行います。  
citeturn1fetch0

### 3.5 最新イージング関数とアニメーション

最新の `linear()` イージング関数を活用し、リアルな物理アニメーションを実装します。以下はその実例です。

```css
.springy {
  transition: transform 1s
    linear(
      0,
      0.009,
      0.035 2.1%,
      0.141,
      0.281 6.7%,
      0.723 12.9%,
      0.938 16.7%,
      1.017,
      1.077,
      1.121,
      1.149 24.3%,
      1.159,
      1.163,
      1.161,
      1.154 29.9%,
      1.129 32.8%,
      1.051 39.6%,
      1.017 43.1%,
      0.991,
      0.977 51%,
      0.974 53.8%,
      0.975 57.1%,
      0.997 69.8%,
      1.003 76.9%,
      1.004 83.8%,
      1
    );
}
```

この関数により、アニメーションの動きに弾力性が加わり、ユーザ体験が格段に向上します。  
citeturn1fetch0

---

## 4. コンポーネントベースのデザイン

### 4.1 ボタンコンポーネント

モダンCSSでは、`:has()` 疑似クラスを活用して、内部にアイコンを含むか否かでボタンのスタイルを切り替えることが可能です。以下の例は、アイコン付き、アイコンのみ、テキストのみの各バリエーションを実現する方法です。

```css
.button {
  color: var(--button-color, var(--primary));
  background-color: var(--button-bg, var(--accent));
}

/* アイコンが含まれる場合 */
.button:where(:has(.icon)) {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

/* アイコンのみ（視覚的ラベルを隠す） */
.button:where(:has(.inclusively-hidden)) {
  border-radius: 50%;
  padding: 0.5em;
}

/* テキストのみまたはアイコン＋テキストの場合 */
.button:where(:not(:has(.icon))) {
  text-align: center;
  min-inline-size: 10ch;
}
.button:where(:not(:has(.inclusively-hidden))) {
  padding: var(--button-padding, 0.75em 1em);
  border-radius: 0;
}
```

この手法により、ボタンのバリアント管理が容易になり、柔軟なコンポーネント設計が可能です。  
citeturn2fetch0

### 4.2 ダイアログ・ポップオーバーのトランジション

ネイティブ要素 `<dialog>` や `[popover]` を活用し、JavaScript に依存せずにスムーズな表示／非表示の遷移を実現します。以下は基本的な実装例です。

```css
[popover],
dialog,
::backdrop {
  transition:
    display 1s allow-discrete,
    overlay 1s allow-discrete,
    opacity 1s;
  opacity: 0;
}

:popover-open,
:popover-open::backdrop,
[open],
[open]::backdrop {
  opacity: 1;
}

@starting-style {
  :popover-open,
  :popover-open::backdrop,
  [open],
  [open]::backdrop {
    opacity: 0;
  }
}
```

これにより、ユーザの操作に対して自然なクロスフェード効果を与えます。  
citeturn1fetch0

### 4.3 `<details>` 要素の開閉アニメーション

`<details>` 要素に対しては、内部コンテンツの表示／非表示をスムーズに行うため、`interpolate-size` プロパティとトランジションを組み合わせます。

```css
details {
  inline-size: 50ch;
  @media (prefers-reduced-motion: no-preference) {
    interpolate-size: allow-keywords;
  }
  &::details-content {
    opacity: 0;
    block-size: 0;
    overflow-y: clip;
    transition:
      content-visibility 1s allow-discrete,
      opacity 1s,
      block-size 1s;
  }
  &[open]::details-content {
    opacity: 1;
    block-size: auto;
  }
}
```

これにより、開閉時の視覚効果が向上し、ユーザ体験が洗練されます。  
citeturn1fetch0

---

## 5. レイアウトテクニック

### 5.1 CSS Grid Layout

最新のCSS Gridを用いて、利用可能なスペースに応じた自動フィットグリッドを実装します。以下はそのサンプルです。

```css
.layout-grid {
  --layout-grid-min: 30ch;
  --layout-grid-gap: 3vw;
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, var(--layout-grid-min)), 1fr)
  );
  gap: var(--layout-grid-gap);
}
```

この実装により、画面幅に応じて自動的に列数が調整され、レスポンシブなレイアウトが実現されます。  
citeturn2fetch0

### 5.2 Flexbox Layout

また、Flexbox を用いたグリッドレイアウトも有効です。こちらはコンテンツが均等に拡大・縮小し、必要に応じて自動ラップされる構造となります。

```css
.flex-layout-grid {
  --flex-grid-min: 20rem;
  --flex-grid-gap: 3vmax;
  display: flex;
  flex-wrap: wrap;
  gap: var(--flex-grid-gap);
}

.flex-layout-grid > * {
  flex: 1 1 var(--flex-grid-min);
}
```

これにより、異なる子要素数にも柔軟に対応可能なレイアウトが構築されます。  
citeturn2fetch0

---

## 6. テーマとブランディング

プロジェクト全体の統一感を出すため、グローバルなカラーパレットやフォント、アクセントカラーは `:root` 内で定義し、`@layer theme` にまとめます。

```css
@layer theme {
  :root {
    --primary: hsl(265, 38%, 13%);
    --secondary: hsl(283, 6%, 45%);
    --tertiary: hsl(257, 15%, 91%);
    --light: hsl(270, 100%, 99%);
    --accent: hsl(278, 100%, 92%);
    --accent--alt: hsl(279, 100%, 97%);
    --accent--ui: hsl(284, 55%, 66%);
  }
  html {
    color-scheme: light;
    accent-color: var(--accent--ui);
  }
}
```

この設定により、ユーザ側のダーク／ライト切替やフォーム要素の自動テーマ適用が容易になります。  
citeturn2fetch0

---

## 7. 開発フローとツール

最新のCSS機能（ネイティブネスティング、container queries など）を活用するため、以下のツールを必ず導入してください。

- **ビルドツール**: LightningCSS などを利用し、ネイティブ機能に対応した最終スタイルシートを生成します。
- **Lint/Formatter**: CSS Lint や Prettier により、コード品質と一貫性を維持します。
- **ポリフィル**: 各ブラウザのサポート状況に応じて、必要な機能に対してポリフィルを導入し、互換性を確保します。  
  citeturn2fetch0

---

## 8. 最終チェックリスト

- **階層管理**: cascade layers を用いて、リセット、テーマ、グローバル、レイアウト、コンポーネント、ユーティリティの各レイヤーが正しく構成されているか確認してください。
- **グローバルスタイル**: CSS Reset やフォーカスリング、スクロール位置調整が最新の仕様に基づいて実装されていること。
- **コンポーネント設計**: ネイティブネスティングや :has() によるバリアント管理で、ボタン、ダイアログ、ポップオーバー、<details> 要素のスタイルが統一されていること。
- **レスポンシブ対応**: CSS Grid、Flexbox、container queries によるレイアウトが、あらゆるデバイスで最適に表示されること。
- **テーマ統一**: グローバルなカラーパレット、アクセントカラー、フォント設定が一元管理され、ユーザ体験に一貫性をもたらしていること。
- **アニメーション最適化**: 最新のイージング関数と @property によるアニメーションが、パフォーマンスを損なわずに実装されていること。

以上の各項目を徹底的に確認し、最先端のモダンCSS技術を駆使してプロジェクトを構築してください。これにより、2025年のWeb開発環境においても、競争力のある高品質なアプリケーションの実現が可能です。

---

【参考情報】

- Chris Coyier「Modern CSS in Real Life」  
  　citeturn0fetch0
- Coliss「Modern CSS Snippets for 2025」  
  　citeturn1fetch0
- ModernCSS.dev「Modern CSS For Dynamic Component-Based Architecture」  
  　citeturn2fetch0

以上、ご質問の要件に沿ったモダンCSSプロジェクトの自走ドキュメントとなります。今後の開発において、これらの手法を断固実践してください。
