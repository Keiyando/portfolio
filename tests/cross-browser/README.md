# クロスブラウザテストスイート

ポートフォリオサイトの包括的なブラウザ互換性テストを実行するためのツール群です。

## 📁 ファイル構成

```
tests/cross-browser/
├── README.md                  # このファイル
├── test-runner.html          # 統合テストランナー（メイン）
├── automated-tests.html      # 自動化テストページ
├── test-checklist.md         # 手動テスト用チェックリスト
├── polyfills.js             # ブラウザ互換性ポリフィル
├── compatibility-fixes.css  # CSS互換性修正
├── responsive-tester.js     # レスポンシブテストツール
├── functional-tests.js      # 機能テストスイート
└── edge-case-tests.js       # エッジケーステストスイート
```

## 🚀 クイックスタート

### 1. 開発サーバーを起動

```bash
# ポートフォリオルートディレクトリで実行
python -m http.server 8000

# または
npx live-server
```

### 2. 統合テストランナーにアクセス

ブラウザで以下のURLを開く：
```
http://localhost:8000/tests/cross-browser/test-runner.html
```

### 3. テスト実行

- **全テスト実行**: 「🚀 全テスト実行」ボタンをクリック
- **個別テスト**: 各テストスイートの「実行」ボタンをクリック
- **レポート生成**: 「📊 総合レポート生成」ボタンでレポートを出力

## 📊 テストスイート詳細

### 🤖 自動化テスト (`automated-tests.html`)

**対象**: ブラウザ機能サポート、JavaScript API、パフォーマンス

- CSS Grid/Flexbox サポート
- CSS Variables サポート  
- JavaScript API (Fetch, IntersectionObserver等)
- WebP画像サポート
- LocalStorage/SessionStorage
- パフォーマンスメトリクス

### 📱 レスポンシブテスト (`responsive-tester.js`)

**対象**: 各解像度でのレイアウト確認

- テスト解像度: 320px〜2560px
- レイアウト崩れ検出
- 横スクロール確認
- タップターゲットサイズ
- フォントサイズ検証

### ⚙️ 機能テスト (`functional-tests.js`)

**対象**: サイトの主要機能

- DOM構造確認
- ナビゲーション動作
- フォーム機能
- スムーズスクロール
- プロジェクト・スキルセクション
- アクセシビリティ属性
- SEO要素

### 🔍 エッジケーステスト (`edge-case-tests.js`)

**対象**: 特殊環境・制限条件

- JavaScript無効時
- 低速ネットワーク（3G）
- オフライン状態
- Cookie/LocalStorage無効
- アニメーション無効設定
- 高コントラストモード
- ダークモード対応
- 極小・極大画面
- キーボードのみ操作

## 🔧 手動テスト手順

### デスクトップブラウザテスト

1. **Chrome（最新版）**
   ```bash
   # デベロッパーツール開く: F12
   # コンソールエラー確認
   # ネットワークタブでリソース読み込み確認
   ```

2. **Firefox（最新版）**
   ```bash
   # デベロッパーツール開く: F12
   # レスポンシブデザインモード: Ctrl+Shift+M
   ```

3. **Safari（最新版）**
   ```bash
   # Web Inspector開く: Cmd+Option+I
   # 要素インスペクタで詳細確認
   ```

4. **Edge（最新版）**
   ```bash
   # デベロッパーツール開く: F12
   # エミュレーション機能でデバイステスト
   ```

### モバイルデバイステスト

- **実機テスト推奨**
- iOS Safari: iPhone SE, iPhone 12/13, iPad
- Android Chrome: 各種画面サイズ

## 📋 手動テストチェックリスト

### レイアウト確認
- [ ] ヘッダー・ナビゲーション表示
- [ ] ヒーローセクション配置
- [ ] スキルセクション表示
- [ ] プロジェクトギャラリー配置
- [ ] コンタクトフォーム表示
- [ ] フッター配置

### 機能テスト
- [ ] スムーズスクロール動作
- [ ] ナビゲーションリンク
- [ ] プロジェクトフィルター
- [ ] モーダル開閉
- [ ] フォームバリデーション
- [ ] フォーム送信

### レスポンシブテスト
- [ ] 320px（最小モバイル）
- [ ] 375px（iPhone SE）
- [ ] 768px（タブレット）
- [ ] 1024px（デスクトップ）
- [ ] 1920px（フルHD）

## 🚨 よくある問題と解決方法

### 1. JavaScriptエラー
```javascript
// コンソールで確認
console.log('Script loaded');

// エラーハンドリング追加
try {
    // 問題のあるコード
} catch (error) {
    console.error('Error:', error);
}
```

### 2. レイアウト崩れ
```css
/* CSS Grid フォールバック */
@supports not (display: grid) {
    .grid-container {
        display: flex;
        flex-wrap: wrap;
    }
}

/* Flexbox フォールバック */
@supports not (display: flex) {
    .flex-container {
        display: block;
    }
}
```

### 3. 画像読み込み問題
```html
<!-- WebP + フォールバック -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="代替テキスト" loading="lazy">
</picture>
```

### 4. CSS Variables未対応
```css
/* CSS Variables + フォールバック */
.element {
    color: #2563eb; /* フォールバック */
    color: var(--color-primary, #2563eb);
}
```

## 📊 テスト結果の解釈

### ステータス表示
- **✅ PASS**: 正常動作
- **⚠️ WARNING**: 動作するが改善余地あり
- **❌ FAIL**: 動作しない、要修正
- **⏭️ SKIP**: テスト対象外

### 優先度
1. **HIGH**: 必須修正（機能停止）
2. **MEDIUM**: 推奨修正（UX低下）
3. **LOW**: 将来修正（最適化）

## 🔄 継続的テスト

### 定期実行
- 新機能追加時
- ブラウザアップデート後
- 月次定期チェック

### 自動化推奨項目
```bash
# Lighthouse テスト
npx lighthouse http://localhost:8000 --output json

# HTML 検証
npx html-validate index.html

# CSS 検証
npx stylelint css/**/*.css

# アクセシビリティ監査
npx pa11y http://localhost:8000
```

## 📈 パフォーマンス目標

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Lighthouse Score
- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

## 🛠️ トラブルシューティング

### テストが実行されない
1. 開発サーバーが起動しているか確認
2. JavaScriptが有効になっているか確認
3. ブラウザのコンソールでエラー確認

### 結果が表示されない
1. ポップアップブロッカー無効化
2. 別ブラウザで試行
3. キャッシュクリア後に再実行

### パフォーマンステストが遅い
1. 他のタブを閉じる
2. ブラウザ拡張機能を無効化
3. デベロッパーツールを閉じる

## 📚 参考資料

- [MDN Web Docs - Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/Guide/Cross-browser_testing)
- [Can I Use - Browser support tables](https://caniuse.com/)
- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**最終更新**: 2025-01-09  
**バージョン**: 1.0.0