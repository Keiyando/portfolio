/**
 * 機能テストスイート
 * サイトの主要機能が各ブラウザで正しく動作するかテスト
 */

(function() {
    'use strict';

    const FunctionalTests = {
        testResults: [],
        currentTestIndex: 0,

        // テストケース定義
        testCases: [
            {
                name: 'DOM構造の確認',
                test: () => FunctionalTests.testDOMStructure(),
                category: 'Structure'
            },
            {
                name: 'ナビゲーション要素の存在確認',
                test: () => FunctionalTests.testNavigationElements(),
                category: 'Navigation'
            },
            {
                name: 'スムーズスクロール機能',
                test: () => FunctionalTests.testSmoothScroll(),
                category: 'Navigation'
            },
            {
                name: 'コンタクトフォーム存在確認',
                test: () => FunctionalTests.testContactFormExists(),
                category: 'Forms'
            },
            {
                name: 'フォームバリデーション機能',
                test: () => FunctionalTests.testFormValidation(),
                category: 'Forms'
            },
            {
                name: 'プロジェクトセクション',
                test: () => FunctionalTests.testProjectsSection(),
                category: 'Content'
            },
            {
                name: 'スキルセクション',
                test: () => FunctionalTests.testSkillsSection(),
                category: 'Content'
            },
            {
                name: 'モーダル機能',
                test: () => FunctionalTests.testModalFunctionality(),
                category: 'Interactions'
            },
            {
                name: 'アニメーション要素',
                test: () => FunctionalTests.testAnimations(),
                category: 'Animations'
            },
            {
                name: 'レスポンシブ画像',
                test: () => FunctionalTests.testResponsiveImages(),
                category: 'Media'
            },
            {
                name: 'アクセシビリティ属性',
                test: () => FunctionalTests.testAccessibilityAttributes(),
                category: 'Accessibility'
            },
            {
                name: 'SEO要素',
                test: () => FunctionalTests.testSEOElements(),
                category: 'SEO'
            },
            {
                name: 'パフォーマンス要素',
                test: () => FunctionalTests.testPerformanceElements(),
                category: 'Performance'
            },
            {
                name: 'エラーハンドリング',
                test: () => FunctionalTests.testErrorHandling(),
                category: 'Stability'
            }
        ],

        /**
         * テストスイートの初期化と実行
         */
        async runAllTests() {
            console.group('🧪 機能テストスイート開始');
            console.log(`実行環境: ${navigator.userAgent}`);
            console.log(`テスト数: ${this.testCases.length}`);
            
            this.testResults = [];
            this.currentTestIndex = 0;

            for (const testCase of this.testCases) {
                this.currentTestIndex++;
                console.log(`\n[${this.currentTestIndex}/${this.testCases.length}] ${testCase.name}`);
                
                const startTime = performance.now();
                let result;

                try {
                    result = await testCase.test();
                    const endTime = performance.now();
                    
                    this.testResults.push({
                        name: testCase.name,
                        category: testCase.category,
                        status: result.status || 'pass',
                        message: result.message || '正常',
                        details: result.details || {},
                        duration: Math.round(endTime - startTime),
                        timestamp: new Date()
                    });

                    console.log(`✅ ${result.message || 'PASS'} (${Math.round(endTime - startTime)}ms)`);
                    
                    if (result.details && Object.keys(result.details).length > 0) {
                        console.log('詳細:', result.details);
                    }

                } catch (error) {
                    const endTime = performance.now();
                    
                    this.testResults.push({
                        name: testCase.name,
                        category: testCase.category,
                        status: 'fail',
                        message: `エラー: ${error.message}`,
                        details: { error: error.stack },
                        duration: Math.round(endTime - startTime),
                        timestamp: new Date()
                    });

                    console.error(`❌ FAIL: ${error.message} (${Math.round(endTime - startTime)}ms)`);
                    console.error(error);
                }

                // 少し待機してブラウザの負荷を軽減
                await this.sleep(100);
            }

            this.generateTestReport();
            console.groupEnd();

            return this.testResults;
        },

        /**
         * DOM構造の確認
         */
        testDOMStructure() {
            const requiredElements = [
                { selector: 'header', name: 'ヘッダー' },
                { selector: 'nav', name: 'ナビゲーション' },
                { selector: 'main', name: 'メインコンテンツ' },
                { selector: 'footer', name: 'フッター' }
            ];

            const missingElements = requiredElements.filter(el => !document.querySelector(el.selector));
            
            if (missingElements.length === 0) {
                return {
                    status: 'pass',
                    message: '必要なDOM要素がすべて存在',
                    details: { foundElements: requiredElements.length }
                };
            } else {
                return {
                    status: 'fail',
                    message: `不足している要素: ${missingElements.map(el => el.name).join(', ')}`,
                    details: { missingElements }
                };
            }
        },

        /**
         * ナビゲーション要素の確認
         */
        testNavigationElements() {
            const nav = document.querySelector('nav');
            if (!nav) {
                return { status: 'fail', message: 'ナビゲーション要素が見つからない' };
            }

            const links = nav.querySelectorAll('a');
            const workingLinks = Array.from(links).filter(link => {
                return link.href && (link.href.startsWith('#') || link.href.includes(window.location.origin));
            });

            return {
                status: workingLinks.length > 0 ? 'pass' : 'fail',
                message: `ナビゲーションリンク ${workingLinks.length}個が有効`,
                details: { 
                    totalLinks: links.length,
                    workingLinks: workingLinks.length,
                    brokenLinks: links.length - workingLinks.length
                }
            };
        },

        /**
         * スムーズスクロール機能テスト
         */
        testSmoothScroll() {
            const hasNativeSupport = CSS.supports('scroll-behavior', 'smooth');
            const hasCustomImplementation = typeof window.PortfolioApp !== 'undefined';
            
            if (hasNativeSupport || hasCustomImplementation) {
                return {
                    status: 'pass',
                    message: 'スムーズスクロール機能が利用可能',
                    details: { 
                        nativeSupport: hasNativeSupport,
                        customImplementation: hasCustomImplementation
                    }
                };
            } else {
                return {
                    status: 'warning',
                    message: 'スムーズスクロール機能が利用不可',
                    details: { fallbackRequired: true }
                };
            }
        },

        /**
         * コンタクトフォーム存在確認
         */
        testContactFormExists() {
            const form = document.querySelector('form');
            if (!form) {
                return { status: 'fail', message: 'コンタクトフォームが見つからない' };
            }

            const requiredFields = [
                { selector: 'input[type="text"], input[name*="name"]', name: '名前フィールド' },
                { selector: 'input[type="email"], input[name*="email"]', name: 'メールフィールド' },
                { selector: 'textarea, input[name*="message"]', name: 'メッセージフィールド' },
                { selector: 'button[type="submit"], input[type="submit"]', name: '送信ボタン' }
            ];

            const foundFields = requiredFields.filter(field => form.querySelector(field.selector));

            return {
                status: foundFields.length === requiredFields.length ? 'pass' : 'warning',
                message: `フォームフィールド ${foundFields.length}/${requiredFields.length}個 存在`,
                details: { 
                    foundFields: foundFields.map(f => f.name),
                    missingFields: requiredFields.filter(f => !foundFields.includes(f)).map(f => f.name)
                }
            };
        },

        /**
         * フォームバリデーション機能テスト
         */
        testFormValidation() {
            const form = document.querySelector('form');
            if (!form) {
                return { status: 'skip', message: 'フォームが存在しないためスキップ' };
            }

            const emailInput = form.querySelector('input[type="email"]');
            const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
            const hasHTML5Validation = requiredInputs.length > 0 || emailInput !== null;
            const hasCustomValidation = typeof window.ContactForm !== 'undefined';

            return {
                status: hasHTML5Validation || hasCustomValidation ? 'pass' : 'warning',
                message: 'フォームバリデーション機能が利用可能',
                details: {
                    html5Validation: hasHTML5Validation,
                    customValidation: hasCustomValidation,
                    requiredFields: requiredInputs.length
                }
            };
        },

        /**
         * プロジェクトセクションテスト
         */
        testProjectsSection() {
            const projectSection = document.querySelector('#projects, .projects, section[data-section="projects"]');
            if (!projectSection) {
                return { status: 'fail', message: 'プロジェクトセクションが見つからない' };
            }

            const projectItems = projectSection.querySelectorAll('.project, .project-card, [data-project]');
            const hasFilter = projectSection.querySelector('.filter, .category-filter, [data-filter]') !== null;

            return {
                status: projectItems.length > 0 ? 'pass' : 'warning',
                message: `プロジェクト ${projectItems.length}個 表示`,
                details: {
                    projectCount: projectItems.length,
                    hasFilter: hasFilter,
                    hasImages: Array.from(projectItems).filter(item => item.querySelector('img')).length
                }
            };
        },

        /**
         * スキルセクションテスト
         */
        testSkillsSection() {
            const skillsSection = document.querySelector('#skills, .skills, section[data-section="skills"]');
            if (!skillsSection) {
                return { status: 'fail', message: 'スキルセクションが見つからない' };
            }

            const skillItems = skillsSection.querySelectorAll('.skill, .skill-item, [data-skill]');
            const hasProgressBars = skillsSection.querySelectorAll('.progress, .skill-level, [data-progress]').length;

            return {
                status: skillItems.length > 0 ? 'pass' : 'warning',
                message: `スキル項目 ${skillItems.length}個 表示`,
                details: {
                    skillCount: skillItems.length,
                    hasProgressBars: hasProgressBars > 0,
                    progressBarsCount: hasProgressBars
                }
            };
        },

        /**
         * モーダル機能テスト
         */
        testModalFunctionality() {
            const modalTriggers = document.querySelectorAll('[data-modal], [data-toggle="modal"]');
            const modals = document.querySelectorAll('.modal, [role="dialog"]');

            const hasModalSystem = modalTriggers.length > 0 || modals.length > 0;

            return {
                status: hasModalSystem ? 'pass' : 'skip',
                message: hasModalSystem ? 'モーダル機能が実装済み' : 'モーダル機能は未実装',
                details: {
                    triggers: modalTriggers.length,
                    modals: modals.length,
                    hasCloseButtons: Array.from(modals).filter(modal => 
                        modal.querySelector('.close, [data-dismiss="modal"], .modal-close')
                    ).length
                }
            };
        },

        /**
         * アニメーション要素テスト
         */
        testAnimations() {
            const animatedElements = document.querySelectorAll('[data-aos], .animate, .fade-in, .slide-in');
            const hasCSSSAnimations = document.querySelector('link[href*="animation"]') !== null;
            const hasIntersectionObserver = 'IntersectionObserver' in window;

            return {
                status: 'pass',
                message: 'アニメーション要素を検出',
                details: {
                    animatedElements: animatedElements.length,
                    hasCSSAnimations: hasCSSSAnimations,
                    hasIntersectionObserver: hasIntersectionObserver,
                    supportsAnimations: CSS.supports('animation-name', 'test')
                }
            };
        },

        /**
         * レスポンシブ画像テスト
         */
        testResponsiveImages() {
            const images = document.querySelectorAll('img');
            const responsiveImages = Array.from(images).filter(img => {
                return img.hasAttribute('srcset') || 
                       img.hasAttribute('data-src') || 
                       img.closest('picture') !== null ||
                       window.getComputedStyle(img).maxWidth === '100%';
            });

            const lazyImages = Array.from(images).filter(img => 
                img.hasAttribute('loading') || img.hasAttribute('data-src')
            );

            return {
                status: responsiveImages.length > 0 ? 'pass' : 'warning',
                message: `レスポンシブ画像 ${responsiveImages.length}/${images.length}個`,
                details: {
                    totalImages: images.length,
                    responsiveImages: responsiveImages.length,
                    lazyImages: lazyImages.length,
                    withAltText: Array.from(images).filter(img => img.alt).length
                }
            };
        },

        /**
         * アクセシビリティ属性テスト
         */
        testAccessibilityAttributes() {
            const issues = [];
            
            // alt属性チェック
            const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
            if (imagesWithoutAlt.length > 0) {
                issues.push(`alt属性なし画像: ${imagesWithoutAlt.length}個`);
            }

            // ヘッダー構造チェック
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const h1Count = document.querySelectorAll('h1').length;
            if (h1Count !== 1) {
                issues.push(`H1タグ数異常: ${h1Count}個`);
            }

            // フォーカス可能要素のlabelチェック
            const inputsWithoutLabel = document.querySelectorAll('input:not([id]):not([aria-label]):not([aria-labelledby])');
            if (inputsWithoutLabel.length > 0) {
                issues.push(`ラベルなし入力フィールド: ${inputsWithoutLabel.length}個`);
            }

            // ランドマーク要素チェック
            const landmarks = document.querySelectorAll('header, nav, main, footer, aside, section');

            return {
                status: issues.length === 0 ? 'pass' : 'warning',
                message: issues.length === 0 ? 'アクセシビリティ属性は適切' : `問題: ${issues.length}件`,
                details: {
                    issues: issues,
                    headingsCount: headings.length,
                    landmarksCount: landmarks.length,
                    h1Count: h1Count
                }
            };
        },

        /**
         * SEO要素テスト
         */
        testSEOElements() {
            const requiredSEOElements = [
                { selector: 'title', name: 'タイトル' },
                { selector: 'meta[name="description"]', name: 'メタディスクリプション' },
                { selector: 'meta[property="og:title"]', name: 'OGタイトル' },
                { selector: 'meta[property="og:description"]', name: 'OGディスクリプション' }
            ];

            const foundElements = requiredSEOElements.filter(el => document.querySelector(el.selector));
            const missingElements = requiredSEOElements.filter(el => !foundElements.includes(el));

            const hasStructuredData = document.querySelector('script[type="application/ld+json"]') !== null;
            const hasCanonical = document.querySelector('link[rel="canonical"]') !== null;

            return {
                status: foundElements.length >= 3 ? 'pass' : 'warning',
                message: `SEO要素 ${foundElements.length}/${requiredSEOElements.length}個 存在`,
                details: {
                    foundElements: foundElements.map(el => el.name),
                    missingElements: missingElements.map(el => el.name),
                    hasStructuredData: hasStructuredData,
                    hasCanonical: hasCanonical
                }
            };
        },

        /**
         * パフォーマンス要素テスト
         */
        testPerformanceElements() {
            const performanceFeatures = {
                hasServiceWorker: 'serviceWorker' in navigator,
                hasPreloads: document.querySelectorAll('link[rel="preload"]').length > 0,
                hasPrefetch: document.querySelectorAll('link[rel="prefetch"]').length > 0,
                hasDNSPrefetch: document.querySelectorAll('link[rel="dns-prefetch"]').length > 0,
                hasCriticalCSS: document.querySelector('style').textContent.length > 0,
                hasAsyncCSS: document.querySelectorAll('link[media="print"], link[onload]').length > 0
            };

            const score = Object.values(performanceFeatures).filter(Boolean).length;

            return {
                status: score >= 3 ? 'pass' : 'warning',
                message: `パフォーマンス最適化 ${score}/6項目 実装済み`,
                details: performanceFeatures
            };
        },

        /**
         * エラーハンドリングテスト
         */
        testErrorHandling() {
            let errorCount = 0;
            const originalError = window.onerror;
            const errors = [];

            // エラー監視を設定
            window.onerror = function(message, source, lineno, colno, error) {
                errorCount++;
                errors.push({ message, source, lineno, colno, error: error?.toString() });
                return false;
            };

            // 意図的に軽微なテストを実行
            try {
                // 存在しない関数を呼び出してみる（try-catchで安全に）
                if (typeof nonExistentFunction === 'function') {
                    nonExistentFunction();
                }
            } catch (e) {
                // 期待されるエラー
            }

            // 元のエラーハンドラを復元
            window.onerror = originalError;

            return {
                status: 'pass',
                message: 'エラーハンドリング機能を確認',
                details: {
                    errorsDuringTest: errorCount,
                    hasGlobalErrorHandler: typeof window.onerror === 'function',
                    hasUnhandledRejectionHandler: typeof window.onunhandledrejection === 'function',
                    errors: errors
                }
            };
        },

        /**
         * テストレポート生成
         */
        generateTestReport() {
            const summary = this.generateTestSummary();
            console.group('📊 機能テスト結果サマリー');
            console.log(`総テスト数: ${summary.total}`);
            console.log(`成功: ${summary.passed} (${Math.round(summary.passRate)}%)`);
            console.log(`警告: ${summary.warnings}`);
            console.log(`失敗: ${summary.failed}`);
            console.log(`スキップ: ${summary.skipped}`);
            console.log(`総実行時間: ${summary.totalDuration}ms`);
            console.groupEnd();

            // カテゴリ別結果
            const categorySummary = this.generateCategorySummary();
            console.group('📋 カテゴリ別結果');
            Object.entries(categorySummary).forEach(([category, stats]) => {
                console.log(`${category}: ${stats.passed}/${stats.total} (${Math.round(stats.passRate)}%)`);
            });
            console.groupEnd();

            return { summary, categorySummary };
        },

        /**
         * テストサマリー生成
         */
        generateTestSummary() {
            const total = this.testResults.length;
            const passed = this.testResults.filter(r => r.status === 'pass').length;
            const warnings = this.testResults.filter(r => r.status === 'warning').length;
            const failed = this.testResults.filter(r => r.status === 'fail').length;
            const skipped = this.testResults.filter(r => r.status === 'skip').length;
            const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);

            return {
                total,
                passed,
                warnings,
                failed,
                skipped,
                passRate: total > 0 ? (passed / total) * 100 : 0,
                totalDuration
            };
        },

        /**
         * カテゴリ別サマリー生成
         */
        generateCategorySummary() {
            const categories = {};
            
            this.testResults.forEach(result => {
                if (!categories[result.category]) {
                    categories[result.category] = { total: 0, passed: 0 };
                }
                categories[result.category].total++;
                if (result.status === 'pass') {
                    categories[result.category].passed++;
                }
            });

            // パス率を計算
            Object.keys(categories).forEach(category => {
                const stats = categories[category];
                stats.passRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;
            });

            return categories;
        },

        /**
         * ユーティリティ: スリープ
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // グローバルに公開
    window.FunctionalTests = FunctionalTests;

    console.log('🧪 機能テストスイートが読み込まれました');
    console.log('実行方法: FunctionalTests.runAllTests()');

})();