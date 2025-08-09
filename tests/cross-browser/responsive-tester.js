/**
 * レスポンシブ・ビューポートテストツール
 * 各解像度での表示確認と問題検出
 */

(function() {
    'use strict';

    const ResponsiveTester = {
        // テスト対象の解像度
        viewports: [
            { name: '320px (最小モバイル)', width: 320, height: 568, type: 'mobile' },
            { name: '375px (iPhone SE)', width: 375, height: 667, type: 'mobile' },
            { name: '390px (iPhone 12/13)', width: 390, height: 844, type: 'mobile' },
            { name: '414px (iPhone Plus)', width: 414, height: 736, type: 'mobile' },
            { name: '768px (タブレット縦)', width: 768, height: 1024, type: 'tablet' },
            { name: '1024px (タブレット横)', width: 1024, height: 768, type: 'tablet' },
            { name: '1280px (小型デスクトップ)', width: 1280, height: 720, type: 'desktop' },
            { name: '1920px (フルHD)', width: 1920, height: 1080, type: 'desktop' },
            { name: '2560px (4K)', width: 2560, height: 1440, type: 'desktop' }
        ],

        currentTest: null,
        testResults: [],

        /**
         * 初期化
         */
        init() {
            this.createTestControls();
            this.bindEvents();
            this.runInitialCheck();
        },

        /**
         * テストコントロールUIの作成
         */
        createTestControls() {
            const controlPanel = document.createElement('div');
            controlPanel.id = 'responsive-test-panel';
            controlPanel.innerHTML = `
                <div style="
                    position: fixed; 
                    top: 10px; 
                    right: 10px; 
                    background: #fff; 
                    border: 2px solid #333; 
                    border-radius: 8px; 
                    padding: 15px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
                    z-index: 10000; 
                    font-family: monospace; 
                    font-size: 12px;
                    max-width: 300px;
                ">
                    <h3 style="margin: 0 0 10px 0; color: #333;">📱 レスポンシブテスト</h3>
                    <div style="margin-bottom: 10px;">
                        <strong>現在:</strong> ${window.innerWidth} x ${window.innerHeight}px
                    </div>
                    <div id="viewport-buttons" style="margin-bottom: 10px;">
                        ${this.viewports.map(vp => `
                            <button 
                                onclick="ResponsiveTester.testViewport(${vp.width}, ${vp.height}, '${vp.name}')"
                                style="
                                    margin: 2px; 
                                    padding: 4px 8px; 
                                    border: 1px solid #666; 
                                    background: #f0f0f0; 
                                    border-radius: 4px; 
                                    cursor: pointer; 
                                    font-size: 10px;
                                "
                                title="${vp.name}"
                            >${vp.width}px</button>
                        `).join('')}
                    </div>
                    <button 
                        onclick="ResponsiveTester.runFullTest()" 
                        style="
                            width: 100%; 
                            padding: 8px; 
                            background: #2563eb; 
                            color: white; 
                            border: none; 
                            border-radius: 4px; 
                            cursor: pointer;
                        "
                    >🔍 全解像度テスト</button>
                    <button 
                        onclick="ResponsiveTester.togglePanel()" 
                        style="
                            width: 100%; 
                            padding: 4px; 
                            background: #6b7280; 
                            color: white; 
                            border: none; 
                            border-radius: 4px; 
                            cursor: pointer; 
                            margin-top: 5px;
                        "
                    >最小化</button>
                    <div id="test-results" style="margin-top: 10px; max-height: 200px; overflow-y: auto;"></div>
                </div>
            `;
            document.body.appendChild(controlPanel);
        },

        /**
         * イベントバインド
         */
        bindEvents() {
            window.addEventListener('resize', this.debounce(() => {
                this.updateCurrentInfo();
                this.checkCurrentViewport();
            }, 250));

            // Orientationchange対応
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.updateCurrentInfo();
                    this.checkCurrentViewport();
                }, 500);
            });
        },

        /**
         * 現在の画面サイズ情報を更新
         */
        updateCurrentInfo() {
            const infoElement = document.querySelector('#responsive-test-panel strong').parentElement;
            if (infoElement) {
                infoElement.innerHTML = `<strong>現在:</strong> ${window.innerWidth} x ${window.innerHeight}px`;
            }
        },

        /**
         * 初期チェック実行
         */
        runInitialCheck() {
            this.checkCurrentViewport();
        },

        /**
         * 現在のビューポートをチェック
         */
        checkCurrentViewport() {
            const issues = this.detectLayoutIssues();
            const result = {
                width: window.innerWidth,
                height: window.innerHeight,
                timestamp: new Date(),
                issues: issues
            };

            this.logResult(`Current viewport: ${result.width}x${result.height}`, issues.length === 0 ? 'pass' : 'warning');
            if (issues.length > 0) {
                issues.forEach(issue => this.logResult(`⚠️ ${issue}`, 'warning'));
            }

            return result;
        },

        /**
         * レイアウト問題の検出
         */
        detectLayoutIssues() {
            const issues = [];

            // 横スクロール発生チェック
            if (document.body.scrollWidth > window.innerWidth) {
                issues.push(`横スクロール発生 (body幅: ${document.body.scrollWidth}px)`);
            }

            // 小さすぎるフォントサイズ
            const smallTexts = Array.from(document.querySelectorAll('*')).filter(el => {
                const style = window.getComputedStyle(el);
                const fontSize = parseFloat(style.fontSize);
                return fontSize < 14 && fontSize > 0;
            });
            if (smallTexts.length > 0) {
                issues.push(`小さすぎるフォント ${smallTexts.length}個 (< 14px)`);
            }

            // タップターゲットサイズチェック（モバイルのみ）
            if (window.innerWidth < 768) {
                const smallTargets = Array.from(document.querySelectorAll('a, button, input, [onclick]')).filter(el => {
                    const rect = el.getBoundingClientRect();
                    return (rect.width < 44 || rect.height < 44) && rect.width > 0 && rect.height > 0;
                });
                if (smallTargets.length > 0) {
                    issues.push(`小さすぎるタップターゲット ${smallTargets.length}個 (< 44px)`);
                }
            }

            // CLS を引き起こす可能性がある要素
            const elementsWithoutSize = Array.from(document.querySelectorAll('img:not([width]):not([height])')).filter(img => {
                const style = window.getComputedStyle(img);
                return !style.width || !style.height || style.width === 'auto' || style.height === 'auto';
            });
            if (elementsWithoutSize.length > 0) {
                issues.push(`サイズ未指定の画像 ${elementsWithoutSize.length}個`);
            }

            // メディアクエリとの不整合チェック
            const mediaQueries = this.getActiveMediaQueries();
            if (mediaQueries.length > 0) {
                // 実際のブレークポイントとの比較ロジックをここに追加できます
            }

            return issues;
        },

        /**
         * アクティブなメディアクエリを取得
         */
        getActiveMediaQueries() {
            const queries = [];
            const stylesheets = Array.from(document.styleSheets);
            
            stylesheets.forEach(stylesheet => {
                try {
                    const rules = Array.from(stylesheet.cssRules || []);
                    rules.forEach(rule => {
                        if (rule.type === CSSRule.MEDIA_RULE) {
                            if (window.matchMedia(rule.conditionText).matches) {
                                queries.push(rule.conditionText);
                            }
                        }
                    });
                } catch (e) {
                    // Cross-origin stylesheetは無視
                }
            });

            return queries;
        },

        /**
         * 特定のビューポートをテスト（シミュレーション）
         */
        testViewport(width, height, name) {
            this.logResult(`Testing: ${name} (${width}x${height}px)`, 'info');
            
            // 実際のブラウザリサイズは実行できないため、
            // 現在のビューポートとの比較分析を提供
            const currentWidth = window.innerWidth;
            const analysis = this.analyzeViewportCompatibility(width, height, name);
            
            analysis.forEach(item => {
                this.logResult(item.message, item.type);
            });

            return analysis;
        },

        /**
         * ビューポート互換性分析
         */
        analyzeViewportCompatibility(targetWidth, targetHeight, name) {
            const analysis = [];
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;

            // 現在のサイズとの比較
            if (Math.abs(currentWidth - targetWidth) < 50) {
                analysis.push({
                    message: `✅ 現在のサイズ(${currentWidth}px)は${name}に近似`,
                    type: 'pass'
                });
            } else {
                analysis.push({
                    message: `📏 現在のサイズ(${currentWidth}px)と${name}(${targetWidth}px)の差: ${Math.abs(currentWidth - targetWidth)}px`,
                    type: 'info'
                });
            }

            // CSS メディアクエリとの比較
            const breakpoints = [
                { name: 'mobile', max: 640 },
                { name: 'tablet', max: 1024 },
                { name: 'desktop', max: Infinity }
            ];

            const targetCategory = breakpoints.find(bp => targetWidth <= bp.max);
            const currentCategory = breakpoints.find(bp => currentWidth <= bp.max);

            if (targetCategory && currentCategory) {
                if (targetCategory.name === currentCategory.name) {
                    analysis.push({
                        message: `✅ 同じカテゴリ (${targetCategory.name})`,
                        type: 'pass'
                    });
                } else {
                    analysis.push({
                        message: `⚠️ 異なるカテゴリ: ${currentCategory.name} → ${targetCategory.name}`,
                        type: 'warning'
                    });
                }
            }

            return analysis;
        },

        /**
         * 全解像度テストの実行
         */
        async runFullTest() {
            this.logResult('🔄 全解像度テストを開始...', 'info');
            this.testResults = [];

            for (let i = 0; i < this.viewports.length; i++) {
                const vp = this.viewports[i];
                this.logResult(`Testing ${i + 1}/${this.viewports.length}: ${vp.name}`, 'info');
                
                const result = this.testViewport(vp.width, vp.height, vp.name);
                this.testResults.push({
                    viewport: vp,
                    result: result,
                    timestamp: new Date()
                });

                // 少し待機してUIの更新を見えるようにする
                await this.sleep(500);
            }

            this.generateTestReport();
        },

        /**
         * テストレポートの生成
         */
        generateTestReport() {
            const reportWindow = window.open('', '_blank', 'width=800,height=600');
            const report = this.buildReportHTML();
            
            reportWindow.document.write(report);
            reportWindow.document.close();
            
            this.logResult('📄 テストレポートを新しいウィンドウで開きました', 'pass');
        },

        /**
         * レポートHTMLの生成
         */
        buildReportHTML() {
            const timestamp = new Date().toLocaleString('ja-JP');
            
            return `
                <!DOCTYPE html>
                <html lang="ja">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>レスポンシブテスト レポート</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 20px; line-height: 1.6; }
                        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                        .test-group { margin-bottom: 30px; }
                        .viewport { background: #fff; border: 1px solid #e9ecef; border-radius: 6px; padding: 15px; margin-bottom: 15px; }
                        .viewport h3 { color: #495057; margin: 0 0 10px 0; }
                        .result { padding: 8px 12px; border-radius: 4px; margin: 5px 0; }
                        .result.pass { background: #d4edda; border-left: 4px solid #28a745; }
                        .result.warning { background: #fff3cd; border-left: 4px solid #ffc107; }
                        .result.fail { background: #f8d7da; border-left: 4px solid #dc3545; }
                        .result.info { background: #d1ecf1; border-left: 4px solid #17a2b8; }
                        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
                        .stat { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 6px; }
                        .stat h4 { margin: 0; color: #6c757d; }
                        .stat .number { font-size: 24px; font-weight: bold; color: #495057; }
                        @media print { body { margin: 0; } .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📱 レスポンシブテスト レポート</h1>
                        <p><strong>サイト:</strong> ${window.location.href}</p>
                        <p><strong>テスト実施日時:</strong> ${timestamp}</p>
                        <p><strong>ユーザーエージェント:</strong> ${navigator.userAgent}</p>
                    </div>

                    <div class="stats">
                        <div class="stat">
                            <h4>テスト対象解像度</h4>
                            <div class="number">${this.viewports.length}</div>
                        </div>
                        <div class="stat">
                            <h4>現在の解像度</h4>
                            <div class="number">${window.innerWidth} x ${window.innerHeight}</div>
                        </div>
                        <div class="stat">
                            <h4>デバイスピクセル比</h4>
                            <div class="number">${window.devicePixelRatio || 1}</div>
                        </div>
                    </div>

                    <div class="test-group">
                        <h2>📏 ビューポート別テスト結果</h2>
                        ${this.testResults.map(test => `
                            <div class="viewport">
                                <h3>${test.viewport.name}</h3>
                                <p><strong>サイズ:</strong> ${test.viewport.width} x ${test.viewport.height}px</p>
                                <p><strong>タイプ:</strong> ${test.viewport.type}</p>
                                <div class="results">
                                    ${test.result.map(r => `
                                        <div class="result ${r.type}">${r.message}</div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="test-group">
                        <h2>🔍 現在のビューポート詳細分析</h2>
                        <div id="current-analysis"></div>
                    </div>

                    <script>
                        // 現在のビューポートの詳細分析を追加
                        const currentAnalysis = document.getElementById('current-analysis');
                        currentAnalysis.innerHTML = \`
                            <div class="viewport">
                                <h3>現在の環境</h3>
                                <p><strong>ビューポート:</strong> \${window.innerWidth} x \${window.innerHeight}px</p>
                                <p><strong>スクリーン:</strong> \${screen.width} x \${screen.height}px</p>
                                <p><strong>利用可能領域:</strong> \${screen.availWidth} x \${screen.availHeight}px</p>
                                <p><strong>カラー深度:</strong> \${screen.colorDepth}bit</p>
                                <p><strong>向き:</strong> \${screen.orientation ? screen.orientation.type : 'Unknown'}</p>
                            </div>
                        \`;

                        // 印刷用スタイル
                        window.print = function() {
                            window.print();
                        };
                    </script>
                </body>
                </html>
            `;
        },

        /**
         * 結果ログ
         */
        logResult(message, type = 'info') {
            const resultsContainer = document.getElementById('test-results');
            if (!resultsContainer) return;

            const resultElement = document.createElement('div');
            resultElement.style.cssText = `
                padding: 4px 8px;
                margin: 2px 0;
                border-radius: 3px;
                font-size: 11px;
                ${this.getResultStyles(type)}
            `;
            resultElement.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
            
            resultsContainer.appendChild(resultElement);
            resultsContainer.scrollTop = resultsContainer.scrollHeight;

            console.log(`[ResponsiveTester] ${message}`);
        },

        /**
         * 結果タイプに応じたスタイル
         */
        getResultStyles(type) {
            const styles = {
                pass: 'background: #d4edda; color: #155724; border-left: 3px solid #28a745;',
                warning: 'background: #fff3cd; color: #856404; border-left: 3px solid #ffc107;',
                fail: 'background: #f8d7da; color: #721c24; border-left: 3px solid #dc3545;',
                info: 'background: #d1ecf1; color: #0c5460; border-left: 3px solid #17a2b8;'
            };
            return styles[type] || styles.info;
        },

        /**
         * パネル表示切り替え
         */
        togglePanel() {
            const panel = document.getElementById('responsive-test-panel');
            if (panel) {
                const content = panel.querySelector('div');
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            }
        },

        /**
         * ユーティリティ: デバウンス
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * ユーティリティ: スリープ
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // グローバルに公開
    window.ResponsiveTester = ResponsiveTester;

    // DOM準備完了後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ResponsiveTester.init());
    } else {
        ResponsiveTester.init();
    }

})();