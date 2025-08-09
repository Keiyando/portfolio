# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

このポートフォリオサイトは、Vanilla HTML、CSS、JavaScriptで構築されるプロフェッショナルなWebサイトです。フレームワークを使用せず、高パフォーマンスとアクセシビリティを重視した作りになっています。

## 開発コマンド

### 開発サーバーの起動
**重要**: 開発サーバーの起動はユーザーが手動で行います。Claude Codeは開発サーバーを起動してはいけません。

```bash
# Python 3のローカルサーバー（ユーザーが実行）
python -m http.server 8000

# Node.jsのlive-server（利用可能な場合・ユーザーが実行）
npx live-server

# http://localhost:8000 でサイトを確認
```

### 必須の通知システム
**重要**: すべての重要な作業後には通知を実行してください
```bash
# 実装完了時
./notification.sh "Phase X完了"

# 選択肢提示時（必須）
./notification.sh "選択肢提示"

# エラー発生時
./notification.sh "エラー発生"
```

## アーキテクチャの概要

### ファイル構成
```
portfolio/
├── index.html                 # シングルページアプリケーション
├── css/
│   ├── style.css             # CSS変数を使用したメインスタイル
│   ├── responsive.css        # モバイルファースト レスポンシブ対応
│   └── animations.css        # CSS アニメーション（非同期読み込み）
├── js/
│   ├── main.js              # モジュールパターンのエントリーポイント
│   ├── modules/             # 機能別モジュール
│   │   ├── scroll.js        # スムーズスクロール、Intersection Observer
│   │   └── animations.js    # アニメーション制御
│   └── utils/               # ユーティリティ関数（debounce、throttle）
├── assets/images/           # WebP + JPGフォールバック画像
└── data/                    # プロジェクト用JSONデータ
```

### 主要アーキテクチャパターン
1. **モジュールパターン**: すべてのJavaScriptはIIFEモジュールパターンでカプセル化
2. **CSS変数**: `:root`セレクターで一元管理されたデザインシステム
3. **プログレッシブエンハンスメント**: JavaScript無効でも基本機能は動作
4. **パフォーマンス最適化**: クリティカルCSSインライン、非クリティカルCSS非同期読み込み
5. **アクセシビリティファースト**: セマンティックHTML、ARIA属性、キーボードナビゲーション

### パフォーマンス目標
- Lighthouse Score: 90以上（全カテゴリ）
- First Contentful Paint: < 1.5秒
- Largest Contentful Paint: < 2.5秒
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5秒

### 技術スタック
- **言語**: HTML5, CSS3, Vanilla JavaScript（フレームワーク不使用）
- **ビルドツール**: なし（純粋な静的ファイル）
- **ブラウザサポート**: Chrome、Firefox、Safari、Edge（最新2バージョン）
- **レスポンシブ範囲**: 320px〜1920px+のビューポート

## タスク管理システム

### チケットベースのワークフロー
実装タスクは `/docs` ディレクトリ内の番号付きマークダウンファイルで管理されています：

#### チケット構成
- `001-project-setup.md`〜`017-documentation.md`
- 4つのフェーズに分かれた段階的開発サイクル
- チェックボックスシステム: `[ ]` → `[x]` で完了をマーク

### 開発プロセス
1. **該当チケット確認**: `/docs/` ディレクトリの関連チケットを読む
2. **タスク開始前**: 作業開始前にタスクステータスを更新
3. **アーキテクチャパターン適用**: 既存のコード規約に従った実装
4. **クロスブラウザテスト**: 全対応ブラウザでの動作確認
5. **実装ログ記録**: 詳細な変更履歴を記録
6. **タスク完了**: チケット内のチェックボックスを `[x]` にマーク
7. **通知実行**: `notification.sh` で完了通知

**必須**: 
- タスク完了時には `/docs/` 内のチェックボックスを必ず更新
- すべての実装で詳細なログを記録
- 重要な節目で通知を実行

## コーディング標準

### HTML規約
- セマンティックHTML5要素の使用
- 適切なARIA属性とrole属性の設定
- 全画像にalt属性を必須で設定
- キーボードナビゲーション対応

### CSS規約
```css
/* CSS変数による一元管理 */
:root {
  --color-primary: #2563eb;
  --color-secondary: #10b981;
  --font-base: 16px;
  --space-sm: 1rem;
}

/* BEM命名規則 */
.card { /* ブロック */ }
.card__header { /* エレメント */ }
.card--featured { /* モディファイア */ }
```

### JavaScript規約
- IIFE（即座実行関数式）モジュールパターン
- 適切なエラーハンドリング（try/catch）
- デバウンス/スロットルの適切な使用
- パフォーマンス測定フックの組み込み

## 品質保証とテスト

### テスト要件
- **機能テスト**: 全リンク、フォーム、フィルター機能の動作確認
- **レスポンシブテスト**: 320px〜1920pxでの表示確認
- **ブラウザテスト**: Chrome、Firefox、Safari、Edge での動作確認
- **アクセシビリティテスト**: キーボードナビゲーション、スクリーンリーダー対応
- **パフォーマンステスト**: Lighthouse Score 90以上の維持

### デプロイメント
```bash
# GitHub Pages へのデプロイ
git add .
git commit -m "Deploy: Portfolio site v1.0.0"
git push origin main
```

## 重要な制約事項

### 必ず守ること
1. **段階的実装**: 各フェーズを確実に完了してから次へ進む
2. **チケット更新**: `/docs/` ファイル内のチェックボックスを必ず更新
3. **通知実行**: 重要な作業完了時は `notification.sh` を実行
4. **パフォーマンス測定**: 各段階でLighthouseテストを実行
5. **アクセシビリティ準拠**: WCAG 2.1 Level AA要件の遵守

### やってはいけないこと
1. **フレームワークの導入**: Vanilla JSのシンプルさを保つ
2. **過度な機能追加**: MVPに集中し、段階的に拡張
3. **テストの省略**: 全機能に対するテストは必須
4. **アクセシビリティの軽視**: すべての要件を満たすこと
5. **ログ記録の省略**: 実装ログは必ず記録

## 実装フェーズ

### Phase 1: 基礎構築（Day 1）
```
タスクリスト:
1. プロジェクト構造のセットアップ
   - ディレクトリ構造作成
   - 基本ファイル生成
   - Git初期化

2. HTML骨格の実装
   - セマンティックHTML5構造
   - アクセシビリティ属性追加
   - メタデータ設定

3. CSS基盤の構築
   - CSS変数定義（カラー、フォント、スペーシング）
   - リセットCSS/Normalize.css
   - グリッドシステム実装

4. レスポンシブ設計
   - モバイルファースト実装
   - ブレークポイント設定
   - フルードタイポグラフィ
```

### Phase 2: コンテンツ実装（Day 2）
```
タスクリスト:
1. ヒーローセクション
   - タイピングアニメーション実装
   - パララックス効果
   - ソーシャルリンク配置

2. スキルセクション
   - プログレスバー実装
   - アイコン統合
   - ホバーエフェクト

3. プロジェクトギャラリー
   - カードレイアウト
   - フィルター機能
   - モーダル詳細表示

4. コンタクトフォーム
   - バリデーション実装
   - スパム対策
   - 送信処理
```

### Phase 3: インタラクション強化（Day 3）
```
タスクリスト:
1. スムーズスクロール
   - Intersection Observer実装
   - スクロールアニメーション
   - ナビゲーションハイライト

2. マイクロインタラクション
   - ボタンエフェクト
   - フォームフィードバック
   - ローディング状態

3. パフォーマンス最適化
   - レイジーローディング
   - 画像最適化（WebP変換）
   - Critical CSS抽出
```

### Phase 4: 品質保証とデプロイ（Day 4）
```
タスクリスト:
1. テスト実施
   - クロスブラウザテスト
   - デバイステスト
   - アクセシビリティ監査

2. 最終最適化
   - コード圧縮
   - キャッシュ戦略
   - CDN設定

3. デプロイメント
   - GitHub Pages設定
   - カスタムドメイン
   - SSL証明書
```

## 🏗️ ファイル構造と命名規則

```
portfolio/
├── index.html                 # メインHTML（圧縮版）
├── CLAUDE.md                   # このファイル
├── portfolio-spec.md           # 仕様書
├── implementation-log.md       # 実装ログ集約
├── notification.sh             # 通知スクリプト
│
├── css/
│   ├── style.css              # メインスタイル
│   ├── responsive.css         # レスポンシブ対応
│   ├── animations.css         # アニメーション定義
│   └── critical.css           # Above the fold CSS
│
├── js/
│   ├── main.js                # エントリーポイント
│   ├── modules/
│   │   ├── scroll.js          # スクロール制御
│   │   ├── form.js            # フォーム処理
│   │   ├── animations.js      # アニメーション制御
│   │   ├── projects.js        # プロジェクト表示
│   │   └── lazyload.js        # 遅延読み込み
│   └── utils/
│       ├── debounce.js        # ユーティリティ関数
│       └── observer.js        # Intersection Observer
│
├── assets/
│   ├── images/
│   │   ├── profile/           # プロフィール画像
│   │   ├── projects/          # プロジェクト画像
│   │   │   └── [project-name]/
│   │   │       ├── thumb.webp # サムネイル（WebP）
│   │   │       ├── thumb.jpg  # フォールバック
│   │   │       └── full.webp  # フルサイズ
│   │   └── icons/             # アイコン（SVG推奨）
│   ├── fonts/                 # Webフォント（必要な場合）
│   └── docs/
│       └── resume.pdf         # 履歴書
│
├── data/
│   └── projects.json          # プロジェクトデータ
│
└── tests/
    ├── lighthouse/            # Lighthouseレポート
    └── accessibility/         # アクセシビリティテスト
```

## 💻 コーディング標準

### HTML規約
```html
<!-- セマンティックHTML5を使用 -->
<header role="banner">
  <nav role="navigation" aria-label="メインナビゲーション">
    <!-- 内容 -->
  </nav>
</header>

<!-- アクセシビリティ属性を必ず含める -->
<button 
  type="button" 
  aria-label="メニューを開く"
  aria-expanded="false"
  aria-controls="mobile-menu">
  <!-- 内容 -->
</button>

<!-- 画像には必ずalt属性 -->
<img 
  src="image.jpg" 
  alt="プロジェクトのスクリーンショット"
  loading="lazy"
  decoding="async">
```

### CSS規約
```css
/* CSS変数による一元管理 */
:root {
  /* カラーパレット */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-secondary: #10b981;
  
  /* タイポグラフィ */
  --font-base: 16px;
  --font-scale: 1.25;
  --line-height-base: 1.6;
  
  /* スペーシング（8pxグリッド） */
  --space-xs: 0.5rem;  /* 8px */
  --space-sm: 1rem;    /* 16px */
  --space-md: 1.5rem;  /* 24px */
  --space-lg: 2rem;    /* 32px */
  --space-xl: 3rem;    /* 48px */
  
  /* ブレークポイント */
  --bp-mobile: 640px;
  --bp-tablet: 1024px;
  --bp-desktop: 1280px;
}

/* BEM命名規則 */
.card {
  /* ブロック */
}
.card__header {
  /* エレメント */
}
.card--featured {
  /* モディファイア */
}

/* ユーティリティクラス */
.u-text-center { text-align: center; }
.u-mt-1 { margin-top: var(--space-sm); }
.u-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  clip: rect(0 0 0 0);
}
```

### JavaScript規約
```javascript
// モジュールパターンを使用
const ScrollController = (() => {
  'use strict';
  
  // プライベート変数
  const config = {
    offset: 100,
    duration: 800,
    easing: 'easeInOutCubic'
  };
  
  // プライベートメソッド
  function calculateOffset(element) {
    // 実装
  }
  
  // パブリックAPI
  return {
    init() {
      // 初期化処理
    },
    
    scrollTo(target) {
      // スムーズスクロール実装
    }
  };
})();

// エラーハンドリング必須
try {
  ScrollController.init();
} catch (error) {
  console.error('ScrollController initialization failed:', error);
  // フォールバック処理
}

// デバウンス/スロットル使用
const handleResize = debounce(() => {
  // リサイズ処理
}, 250);

window.addEventListener('resize', handleResize, { passive: true });
```

## ⚡ パフォーマンス最適化

### Critical Rendering Path
```html
<!-- Critical CSS inline -->
<style>
  /* Above the fold styles only */
  :root { /* CSS variables */ }
  body { /* Base styles */ }
  .hero { /* Hero section styles */ }
</style>

<!-- Preload critical resources -->
<link rel="preload" href="fonts/inter.woff2" as="font" crossorigin>
<link rel="preload" href="css/style.css" as="style">

<!-- Async load non-critical CSS -->
<link rel="preload" href="css/animations.css" as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
```

### 画像最適化
```bash
# WebP変換スクリプト
for img in assets/images/projects/*/*.{jpg,png}; do
  cwebp -q 80 "$img" -o "${img%.*}.webp"
done

# サムネイル生成
convert original.jpg -resize 400x300^ -gravity center -crop 400x300+0+0 thumb.jpg
```

### JavaScript最適化
```javascript
// 遅延読み込み
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));
```

## 🧪 テスト戦略

### テストチェックリスト
```markdown
## 機能テスト
- [ ] すべてのリンクが正しく動作
- [ ] フォーム送信とバリデーション
- [ ] フィルター機能の動作
- [ ] モーダルの開閉
- [ ] スムーズスクロール

## レスポンシブテスト
- [ ] 320px (最小モバイル)
- [ ] 375px (iPhone SE)
- [ ] 768px (タブレット)
- [ ] 1024px (デスクトップ)
- [ ] 1920px (フルHD)

## ブラウザテスト
- [ ] Chrome (最新)
- [ ] Firefox (最新)
- [ ] Safari (最新)
- [ ] Edge (最新)
- [ ] Chrome Mobile
- [ ] Safari iOS

## パフォーマンステスト
- [ ] Lighthouse Score ≥ 90
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] TTI < 3.5s

## アクセシビリティテスト
- [ ] キーボードナビゲーション
- [ ] スクリーンリーダー対応
- [ ] カラーコントラスト比
- [ ] フォーカスインジケーター
- [ ] ARIAラベル
```

## 🚀 デプロイ手順

### GitHub Pages
```bash
# ビルドとデプロイ
git add .
git commit -m "Deploy: Portfolio site v1.0.0"
git push origin main

# GitHub Pages設定
# Settings > Pages > Source: Deploy from branch
# Branch: main, Folder: / (root)
```

### パフォーマンスモニタリング
```javascript
// Web Vitals測定
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  // Google Analyticsに送信
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 📊 成功指標

### 技術的指標
- **Lighthouse Score**: 全カテゴリ90以上
- **読み込み時間**: 3秒以内（3G環境）
- **バンドルサイズ**: < 200KB（gzip後）
- **画像サイズ**: 各画像 < 100KB

### ビジネス指標
- **バウンス率**: < 40%
- **平均滞在時間**: > 2分
- **プロジェクト閲覧率**: > 60%
- **コンタクト率**: > 5%

## 🔄 継続的改善

### 週次レビュー項目
1. **アナリティクス分析**
   - ユーザー行動分析
   - パフォーマンスメトリクス
   - エラーログ確認

2. **コンテンツ更新**
   - 新規プロジェクト追加
   - スキル情報更新
   - ブログ記事追加（将来）

3. **技術的改善**
   - 依存関係の更新
   - セキュリティパッチ
   - パフォーマンス最適化

## ⚠️ 重要な注意事項

### やるべきこと ✅
- **段階的実装**: 各フェーズを確実に完了してから次へ
- **テスト駆動**: 実装前にテストケースを定義
- **ログ記録**: すべての作業を実装ログに記載
- **通知実行**: 重要な節目で必ず通知
- **パフォーマンス測定**: 各段階でLighthouseを実行

### やってはいけないこと ❌
- **過度な最適化**: 初期段階での過剰な最適化
- **フレームワーク導入**: Vanilla JSでシンプルに保つ
- **機能の詰め込み**: MVPに集中、段階的に拡張
- **テストの省略**: すべての機能にテストは必須
- **アクセシビリティ無視**: WCAG準拠は必須要件

## 🎯 次のアクション

1. **即座に実行**
   - [ ] notification.sh の作成と実行権限付与
   - [ ] プロジェクトディレクトリ構造の作成
   - [ ] Git リポジトリの初期化

2. **Phase 1 開始**
   - [ ] HTML基本構造の実装
   - [ ] CSS変数とリセットスタイルの定義
   - [ ] レスポンシブグリッドシステムの構築

3. **継続的タスク**
   - [ ] 実装ログの記録（各作業後）
   - [ ] パフォーマンステスト（各フェーズ後）
   - [ ] コミットメッセージの規約遵守

---
*最終更新: 2025年1月*
*バージョン: 1.0.0*
*このドキュメントは portfolio-spec.md と連携して使用すること*

## Validation Commands

### Error Checking
```bash
# Check for broken links
npx linkinator index.html --verbosity error

# Validate HTML
npx html-validate index.html

# Check CSS syntax
npx stylelint css/**/*.css

# Performance audit
npx lighthouse http://localhost:8000 --output json --output html --output-path ./tests/lighthouse/

# Check file permissions
ls -la notification.sh  # Should show executable permissions (-rwxr-xr-x)
```

### Quick Development Server Test
```bash
# Test if development server is accessible
curl -I http://localhost:8000
```

## Advice and Memories
- エラーがないかのチェックをチケット完了後に必ず実施してください。
- Use `python -m http.server 8000` as the primary development server command
- Always run `./notification.sh "task description"` after completing significant work