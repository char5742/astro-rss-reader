## CSS

最新のCSSを活用したコーディングのベストプラクティスをまとめます。JavaScriptに頼らず、純粋なCSSで機能性と表現力を最大化することを目指します。

### 方針

- **JavaScript不要を前提**に、CSSだけでUI実装を完結させる。
- スタイルの意図をコメントで明記し、保守性を高める。
- セレクタのネストやカスタムプロパティを活用し、DRY（Don't Repeat Yourself）を徹底。
- ブラウザ互換性を考慮しつつ、プログレッシブエンハンスメントを採用。

### セレクタとプロパティの使用方針

1. **モダンセレクタを活用**
   - `:has()`で親要素の条件付きスタイルを。
   - `:is()`や`:where()`でセレクタリストを効率化。
   ```css
   /* 子にimgがある場合のみ */
   .card:has(img) {
     border: 1px solid;
   }
   /* 複数条件を簡潔に */
   .btn:is(:hover, :focus) {
     background: var(--hover-bg);
   }
   ```

````

2. **カスタムプロパティの命名**
   - 意味を持たせ、ハードコーディングを避ける。
   ```css
   /* Good */
   :root {
     --spacing-unit: 1rem;
     --primary-color: #007bff;
   }
   .card {
     margin: var(--spacing-unit);
   }
   /* Bad */
   .card {
     margin: 16px;
   }
   ```

### レスポンシブデザイン

1. **コンテナクエリと関数を使用**

   - `@container`でコンポーネント単位のレスポンシブを。
   - `clamp()`で流体デザインを簡潔に。

   ```css
   .container {
     container-type: inline-size;
   }
   @container (min-width: 500px) {
     .card {
       font-size: 1.5em;
     }
   }
   h1 {
     font-size: clamp(1rem, 4vw, 2rem);
   }
   ```

2. **メディアクエリを補完**
   - 全体レイアウト用に`@media`を併用。
   ```css
   @media (min-width: 768px) {
     .grid {
       grid-template-columns: repeat(2, 1fr);
     }
   }
   ```

### アクセシビリティ (a11y)

1. **ユーザー設定を尊重**

   - `:focus-visible`でキーボード操作をサポート。
   - `prefers-reduced-motion`で動きを抑制。

   ```css
   button:focus-visible {
     outline: 2px solid blue;
   }
   @media (prefers-reduced-motion: reduce) {
     * {
       animation: none !important;
     }
   }
   ```

2. **コントラストと読みやすさ**
   - 相対単位（`rem`）でフォントサイズを。
   - `color-mix()`でコントラスト調整。
   ```css
   body {
     font-size: 1rem;
   }
   .text {
     color: color-mix(in srgb, var(--fg) 80%, black);
   }
   ```

### 実装パターン

1. **ネストとスコープ管理**

   - ネストで可読性を向上、`@layer`で優先度を制御。

   ```css
   .card {
     padding: var(--spacing-unit);
     & .title {
       font-weight: bold;
     }
   }
   @layer base, components;
   @layer components {
     .card {
       /* ... */
     }
   }
   ```

2. **アニメーション**

   - `@keyframes`で動きを、スクロール連動も視野に。

   ```css
   @keyframes fadeIn {
     from {
       opacity: 0;
     }
     to {
       opacity: 1;
     }
   }
   .fade {
     animation: fadeIn 1s ease-in;
   }
   ```

3. **レイアウト**
   - `grid`（`subgrid`含む）や`flex`で柔軟な配置を。
   ```css
   .grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
     gap: var(--spacing-unit);
   }
   ```

### 実装の選択基準

1. **ネストを選ぶ場合**

   - 関連スタイルをまとめたい。
   - セレクタの繰り返しを減らす。

2. **グリッドを選ぶ場合**

   - 2次元レイアウトが必要。
   - サブグリッドで親子整合性を保つ。

3. **カスタムプロパティを選ぶ場合**
   - テーマ変更や再利用性を重視。
   - アニメーションで動的制御を。

### 一般的なルール

1. **フォールバック戦略**

   - `@supports`で新機能を安全に導入。

   ```css
   .box {
     width: 100%;
   }
   @supports (width: clamp(200px, 50%, 800px)) {
     .box {
       width: clamp(200px, 50%, 800px);
     }
   }
   ```

2. **設計の一貫性**

   - ユーティリティとセマンティックのバランスを。
   - レイヤーで優先度を明確化。

3. **パフォーマンス**

   - 複雑なセレクタやアニメを最適化。
   - `font-display: swap`でフォント表示を高速化。

4. **保守性**
   - 単一責任のスタイルブロックを。
   - 意味的な命名で意図を伝える。

---

詳細な例や高度なテクニックは`css-system-guide.css`を参照してください。モダンCSSを駆使することで、JavaScriptなしでもリッチなUIを実現できます。
````
