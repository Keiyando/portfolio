# Claude Code 標準プロンプトテンプレート

## 使用方法
1. `/clear` を実行
2. 以下のテンプレートをコピー
3. 【】内を具体的な内容に置き換えて送信

---

## 🎯 基本プロンプトテンプレート

```
/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/【チケット番号】-【チケット名】.md のタスクを実装してください。

【追加の具体的な指示や要望をここに記載】

実装時の注意：
- チケット内のタスクリストを確認し、完了したら [x] でチェック
- CLAUDE.mdの実装ガイドラインに従う
- 実装ログを記録
- 完了時に notification.sh で通知
```

---

## 📋 チケット別プロンプト例

### Phase 1: 基礎構築

#### 001: プロジェクトセットアップ
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/001-project-setup.md のタスクを実装してください。

プロジェクトの初期セットアップを行い、必要なディレクトリ構造とファイルを作成してください。
notification.shも作成して実行権限を付与してください。
```

#### 002: HTML基本構造
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/002-html-structure.md のタスクを実装してください。

セマンティックHTML5で基本構造を作成し、アクセシビリティ属性を適切に設定してください。
モバイルファーストでレスポンシブ対応の準備もお願いします。
```

#### 003: CSS基盤構築
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/003-css-foundation.md のタスクを実装してください。

CSS変数でデザインシステムを定義し、リセットCSSとグリッドシステムを構築してください。
BEM命名規則に従ったユーティリティクラスも作成してください。
```

### Phase 2: コンテンツ実装

#### 005: ヒーローセクション
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/005-hero-section.md のタスクを実装してください。

インパクトのあるヒーローセクションを作成してください。
タイピングアニメーションとパララックス効果を含めてください。
パフォーマンスを意識して60fps維持をお願いします。
```

#### 007: プロジェクトギャラリー
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/007-projects-gallery.md のタスクを実装してください。

プロジェクトギャラリーをフィルター機能付きで実装してください。
モーダルで詳細表示し、レイジーローディングでパフォーマンスを最適化してください。
初期データは3-6個のサンプルプロジェクトで構いません。
```

### Phase 3: インタラクション強化

#### 009: ナビゲーションヘッダー
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/009-navigation-header.md のタスクを実装してください。

固定ヘッダーとスムーズスクロールを実装してください。
モバイル用ハンバーガーメニューも含めて、すべてのデバイスで使いやすくしてください。
スクロール時の状態変化（透明→不透明）もお願いします。
```

#### 011: スクロールアニメーション
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/011-scroll-animations.md のタスクを実装してください。

Intersection Observer APIでスクロールアニメーションを実装してください。
prefers-reduced-motionに対応し、アクセシビリティを考慮してください。
アニメーションは控えめにして、パフォーマンスを重視してください。
```

### Phase 4: 品質保証

#### 012: パフォーマンス最適化
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/012-performance-optimization.md のタスクを実装してください。

Lighthouse Score 90以上を目指して最適化してください。
画像のWebP変換、Critical CSS、レイジーローディングを実装してください。
Core Web Vitalsの基準を満たすようにお願いします。
```

#### 013: アクセシビリティ監査
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/013-accessibility-audit.md のタスクを実装してください。

WCAG 2.1 Level AA準拠を確認してください。
axe DevToolsでエラー0を目指し、キーボードナビゲーションを完全対応してください。
スクリーンリーダーでのテストもお願いします。
```

#### 016: デプロイメント
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
CLAUDE.mdとportfolio-spec.mdに仕様があります。
docs/016-deployment-setup.md のタスクを実装してください。

GitHub Pagesでデプロイ設定をしてください。
カスタムドメインが必要な場合は設定方法を教えてください。
CI/CDの自動デプロイも設定してください。
```

---

## 🔧 トラブルシューティング用プロンプト

### エラー修正
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
以下のエラーが発生しています：

【エラー内容をペースト】

このエラーを修正してください。
関連するチケットは docs/【チケット番号】-【チケット名】.md です。
```

### パフォーマンス改善
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
現在のLighthouse Scoreは【スコア】です。

以下の項目を改善してください：
- FCP: 【現在値】 → 目標 < 1.5s
- LCP: 【現在値】 → 目標 < 2.5s
- CLS: 【現在値】 → 目標 < 0.1

docs/012-performance-optimization.md を参考に最適化してください。
```

### レビュー依頼
```
/clear

/Users/andokeiya/claude-code/portfolio にあるポートフォリオサイトプロジェクトです。
docs/【チケット番号】-【チケット名】.md の実装が完了しました。

以下の観点でレビューしてください：
1. コード品質
2. パフォーマンス
3. アクセシビリティ
4. ベストプラクティスの準拠

改善点があれば修正してください。
```

---

## 💡 効率的な使い方のコツ

1. **段階的実装**: チケットを順番に実装
2. **定期的な確認**: 各Phase完了時にテスト
3. **ログの活用**: 実装ログを残して進捗管理
4. **通知の利用**: notification.shで作業完了を通知

## 📝 メモ
- 常に最新のCLAUDE.mdとチケットファイルを参照
- 完了したタスクは必ず [x] でチェック
- 問題が発生したら具体的なエラー内容を含めて質問