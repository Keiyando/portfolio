# Portfolio Site

プロフェッショナルなWebエンジニアのポートフォリオサイト

## 概要

このプロジェクトは、3ヶ月で40個のアプリ制作を目標とする効率的な開発フローを確立し、採用担当者への技術力を効果的に展示するためのポートフォリオサイトです。

## 技術仕様

- **言語**: HTML5, CSS3, Vanilla JavaScript
- **ビルドツール**: なし（純粋な静的ファイル）
- **ホスティング**: GitHub Pages / Netlify / Vercel
- **パフォーマンス目標**: Lighthouse Score 90以上
- **アクセシビリティ**: WCAG 2.1 Level AA準拠

## プロジェクト構造

```
portfolio/
├── index.html              # メインHTML
├── css/                    # スタイルシート
│   ├── style.css          # メインスタイル
│   ├── responsive.css     # レスポンシブ対応
│   └── animations.css     # アニメーション定義
├── js/                     # JavaScript
│   ├── main.js            # エントリーポイント
│   ├── modules/           # 機能別モジュール
│   └── utils/             # ユーティリティ関数
├── assets/                 # 静的ファイル
│   ├── images/            # 画像ファイル
│   └── docs/              # ドキュメント
├── data/                   # JSONデータ
└── tests/                  # テストファイル
```

## 開発フェーズ

### Phase 1: 基礎構築
- [x] プロジェクト構造のセットアップ
- [x] HTML基本構造の実装
- [x] CSS基盤の構築
- [x] レスポンシブ設計

### Phase 2: コンテンツ実装
- [ ] ヒーローセクション
- [ ] スキルセクション
- [ ] プロジェクトギャラリー
- [ ] コンタクトフォーム

### Phase 3: インタラクション強化
- [ ] スムーズスクロール
- [ ] マイクロインタラクション
- [ ] パフォーマンス最適化

### Phase 4: 品質保証とデプロイ
- [ ] クロスブラウザテスト
- [ ] アクセシビリティ監査
- [ ] デプロイメント

## 開発環境のセットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd portfolio
```

2. 開発サーバーを起動（任意）
```bash
# Python 3の場合
python -m http.server 8000

# Node.jsのlive-serverを使用する場合
npx live-server
```

3. ブラウザで http://localhost:8000 を開く

## ブラウザサポート

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)
- Chrome Mobile
- Safari iOS

## パフォーマンス目標

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

## 品質保証

- Lighthouse Score: 90以上（全カテゴリ）
- WCAG 2.1 Level AA準拠
- クロスブラウザ対応
- レスポンシブデザイン

## 貢献

このプロジェクトはポートフォリオサイトのため、外部からの貢献は受け付けていません。

## ライセンス

All Rights Reserved

---

**最終更新**: 2025年1月  
**バージョン**: 1.0.0