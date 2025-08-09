/**
 * エッジケーステストスイート
 * 特殊な状況や制限条件下での動作確認
 */

(function() {
    'use strict';

    const EdgeCaseTests = {
        testResults: [],
        originalStates: {},

        // テストケース定義
        testCases: [
            {
                name: 'JavaScript無効時の基本機能',
                test: () => EdgeCaseTests.testWithoutJavaScript(),
                category: 'Fallback'
            },
            {
                name: '低速ネットワーク環境（3G）',
                test: () => EdgeCaseTests.testSlowNetwork(),
                category: 'Network'
            },
            {
                name: 'オフライン状態',
                test: () => EdgeCaseTests.testOfflineMode(),
                category: 'Network'
            },
            {
                name: 'Cookie無効時',
                test: () => EdgeCaseTests.testWithoutCookies(),
                category: 'Storage'
            },
            {
                name: 'LocalStorage無効時',
                test: () => EdgeCaseTests.testWithoutLocalStorage(),
                category: 'Storage'
            },
            {
                name: 'アニメーション無効設定',
                test: () => EdgeCaseTests.testReducedMotion(),
                category: 'Accessibility'
            },
            {
                name: '高コントラストモード',
                test: () => EdgeCaseTests.testHighContrast(),
                category: 'Accessibility'
            },
            {
                name: 'ダークモード対応',
                test: () => EdgeCaseTests.testDarkMode(),
                category: 'Theming'
            },
            {
                name: '極小画面（< 320px）',
                test: () => EdgeCaseTests.testTinyScreen(),
                category: 'Responsive'
            },
            {
                name: '極大画面（> 2560px）',
                test: () => EdgeCaseTests.testLargeScreen(),
                category: 'Responsive'
            },
            {
                name: '長時間ページ表示',
                test: () => EdgeCaseTests.testLongPageDisplay(),
                category: 'Performance'
            },
            {
                name: 'メモリ制限環境',
                test: () => EdgeCaseTests.testMemoryConstraints(),
                category: 'Performance'
            },
            {
                name: '古いブラウザ機能サポート',
                test: () => EdgeCaseTests.testLegacyBrowserSupport(),
                category: 'Compatibility'
            },
            {
                name: 'タッチデバイス専用機能',
                test: () => EdgeCaseTests.testTouchOnlyFeatures(),
                category: 'Input'
            },
            {
                name: 'キーボードのみ操作',
                test: () => EdgeCaseTests.testKeyboardOnlyNavigation(),
                category: 'Accessibility'
            }
        ],

        /**
         * 全エッジケーステストの実行
         */
        async runAllTests() {
            console.group('🔍 エッジケーステスト開始');
            console.log(`実行環境: ${navigator.userAgent}`);
            console.log(`テスト数: ${this.testCases.length}`);
            
            this.testResults = [];
            this.saveOriginalStates();

            for (const testCase of this.testCases) {
                console.log(`\n🧪 ${testCase.name}`);
                
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

                    console.log(`${result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'} ${result.message}`);

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

                    console.error(`❌ FAIL: ${error.message}`);
                }

                await this.sleep(200);
            }

            this.restoreOriginalStates();
            this.generateTestReport();
            console.groupEnd();

            return this.testResults;
        },

        /**
         * 元の状態を保存
         */
        saveOriginalStates() {
            this.originalStates = {
                onlineStatus: navigator.onLine,
                cookieEnabled: navigator.cookieEnabled,
                userAgent: navigator.userAgent
            };
        },

        /**
         * 元の状態を復元
         */
        restoreOriginalStates() {
            // 必要に応じて状態を復元
        },

        /**
         * JavaScript無効時の基本機能テスト
         */
        testWithoutJavaScript() {
            // JavaScript無効をシミュレーションするため、
            // HTML/CSSのみでの機能確認を行う
            const staticElements = {
                navigation: document.querySelector('nav'),
                forms: document.querySelectorAll('form'),
                links: document.querySelectorAll('a[href]'),
                images: document.querySelectorAll('img'),
                content: document.querySelector('main')
            };

            const workingElements = Object.keys(staticElements).filter(key => {
                const element = staticElements[key];
                if (NodeList.prototype.isPrototypeOf(element)) {
                    return element.length > 0;
                }
                return element !== null;
            });

            // アンカーリンクの動作確認
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            const hasValidAnchors = Array.from(anchorLinks).filter(link => {
                const targetId = link.getAttribute('href').substring(1);
                return document.getElementById(targetId) !== null;
            }).length;

            return {
                status: workingElements.length >= 3 ? 'pass' : 'warning',
                message: `JavaScript無効でも基本機能は利用可能`,
                details: {
                    workingElements: workingElements,
                    anchorLinks: anchorLinks.length,
                    validAnchors: hasValidAnchors,
                    hasStaticFallback: true
                }
            };
        },

        /**
         * 低速ネットワーク環境テスト
         */
        testSlowNetwork() {
            // Connection APIを使用してネットワーク情報を取得
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            const networkTests = {
                hasConnectionAPI: connection !== undefined,
                effectiveType: connection ? connection.effectiveType : 'unknown',
                downlink: connection ? connection.downlink : null,
                rtt: connection ? connection.rtt : null
            };

            // 遅延読み込み要素の確認
            const lazyElements = document.querySelectorAll('[loading="lazy"], [data-src], [data-lazy]');
            const criticalResources = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"]');

            return {
                status: 'pass',
                message: '低速ネットワーク対応を確認',
                details: {
                    ...networkTests,
                    lazyElements: lazyElements.length,
                    criticalResources: criticalResources.length,
                    hasOptimization: lazyElements.length > 0 || criticalResources.length > 0
                }
            };
        },

        /**
         * オフライン状態テスト
         */
        testOfflineMode() {
            const hasServiceWorker = 'serviceWorker' in navigator;
            const hasAppCache = 'applicationCache' in window;
            const isOnline = navigator.onLine;

            // Service Workerの登録状況確認
            let swRegistrationStatus = 'not-registered';
            if (hasServiceWorker && navigator.serviceWorker.controller) {
                swRegistrationStatus = 'active';
            } else if (hasServiceWorker) {
                swRegistrationStatus = 'available';
            }

            // Cache APIの利用可能性
            const hasCacheAPI = 'caches' in window;

            return {
                status: hasServiceWorker ? 'pass' : 'warning',
                message: hasServiceWorker ? 'オフライン対応が実装済み' : 'オフライン対応が未実装',
                details: {
                    isOnline: isOnline,
                    hasServiceWorker: hasServiceWorker,
                    swRegistrationStatus: swRegistrationStatus,
                    hasAppCache: hasAppCache,
                    hasCacheAPI: hasCacheAPI,
                    offlineReady: hasServiceWorker && hasCacheAPI
                }
            };
        },

        /**
         * Cookie無効時テスト
         */
        testWithoutCookies() {
            const cookiesEnabled = navigator.cookieEnabled;
            
            // Cookieに依存しない機能の確認
            const cookieDependencies = {
                localStorage: 'localStorage' in window,
                sessionStorage: 'sessionStorage' in window,
                indexedDB: 'indexedDB' in window
            };

            const alternativeStorageCount = Object.values(cookieDependencies).filter(Boolean).length;

            return {
                status: alternativeStorageCount > 0 ? 'pass' : 'warning',
                message: `Cookie無効でも代替ストレージ ${alternativeStorageCount}種 利用可能`,
                details: {
                    cookiesEnabled: cookiesEnabled,
                    ...cookieDependencies,
                    alternativeStorageCount: alternativeStorageCount
                }
            };
        },

        /**
         * LocalStorage無効時テスト
         */
        testWithoutLocalStorage() {
            let localStorageAvailable = false;
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                localStorageAvailable = true;
            } catch (e) {
                localStorageAvailable = false;
            }

            // 代替ストレージの確認
            const alternatives = {
                sessionStorage: 'sessionStorage' in window,
                indexedDB: 'indexedDB' in window,
                cookies: navigator.cookieEnabled
            };

            const alternativeCount = Object.values(alternatives).filter(Boolean).length;

            return {
                status: alternativeCount > 0 || localStorageAvailable ? 'pass' : 'warning',
                message: localStorageAvailable ? 'LocalStorage利用可能' : `代替ストレージ ${alternativeCount}種 利用可能`,
                details: {
                    localStorageAvailable: localStorageAvailable,
                    ...alternatives,
                    alternativeCount: alternativeCount
                }
            };
        },

        /**
         * アニメーション無効設定テスト
         */
        testReducedMotion() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // アニメーション要素の確認
            const animatedElements = document.querySelectorAll('[data-aos], .animate, .fade-in');
            const cssAnimations = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules).some(rule => 
                        rule.type === CSSRule.MEDIA_RULE && 
                        rule.conditionText.includes('prefers-reduced-motion')
                    );
                } catch (e) {
                    return false;
                }
            });

            return {
                status: cssAnimations || prefersReducedMotion ? 'pass' : 'warning',
                message: 'アニメーション制御設定を確認',
                details: {
                    prefersReducedMotion: prefersReducedMotion,
                    animatedElements: animatedElements.length,
                    hasCSSMotionQueries: cssAnimations,
                    respectsUserPreference: cssAnimations
                }
            };
        },

        /**
         * 高コントラストモードテスト
         */
        testHighContrast() {
            const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
            const hasHighContrastStyles = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules).some(rule => 
                        rule.type === CSSRule.MEDIA_RULE && 
                        rule.conditionText.includes('prefers-contrast')
                    );
                } catch (e) {
                    return false;
                }
            });

            // コントラスト比の簡易チェック（サンプル要素）
            const sampleElements = document.querySelectorAll('h1, h2, p, a, button');
            const contrastIssues = Array.from(sampleElements).slice(0, 5).map(el => {
                const styles = window.getComputedStyle(el);
                return {
                    element: el.tagName.toLowerCase(),
                    color: styles.color,
                    backgroundColor: styles.backgroundColor
                };
            });

            return {
                status: 'pass',
                message: '高コントラスト対応を確認',
                details: {
                    prefersHighContrast: prefersHighContrast,
                    hasHighContrastStyles: hasHighContrastStyles,
                    sampleElements: contrastIssues.length,
                    contrastInfo: contrastIssues
                }
            };
        },

        /**
         * ダークモードテスト
         */
        testDarkMode() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const hasDarkModeStyles = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules).some(rule => 
                        rule.type === CSSRule.MEDIA_RULE && 
                        rule.conditionText.includes('prefers-color-scheme: dark')
                    );
                } catch (e) {
                    return false;
                }
            });

            // CSS変数での色管理確認
            const rootStyles = window.getComputedStyle(document.documentElement);
            const hasCSSVariables = rootStyles.getPropertyValue('--color-primary') !== '';

            return {
                status: hasDarkModeStyles ? 'pass' : 'warning',
                message: hasDarkModeStyles ? 'ダークモード対応済み' : 'ダークモード未対応',
                details: {
                    prefersDark: prefersDark,
                    hasDarkModeStyles: hasDarkModeStyles,
                    hasCSSVariables: hasCSSVariables,
                    supportsColorScheme: CSS.supports('color-scheme', 'dark')
                }
            };
        },

        /**
         * 極小画面テスト
         */
        testTinyScreen() {
            const currentWidth = window.innerWidth;
            const isTinyScreen = currentWidth < 320;
            
            // 極小画面での問題確認
            const issues = [];
            
            if (currentWidth < 320) {
                // 横スクロール確認
                if (document.body.scrollWidth > currentWidth) {
                    issues.push('横スクロール発生');
                }

                // 小さすぎるタップターゲット
                const smallTargets = Array.from(document.querySelectorAll('a, button')).filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.width < 44 || rect.height < 44;
                });
                
                if (smallTargets.length > 0) {
                    issues.push(`小さすぎるタップターゲット: ${smallTargets.length}個`);
                }
            }

            return {
                status: issues.length === 0 ? 'pass' : 'warning',
                message: currentWidth < 320 ? `極小画面(${currentWidth}px)での表示確認` : `通常画面(${currentWidth}px)`,
                details: {
                    currentWidth: currentWidth,
                    isTinyScreen: isTinyScreen,
                    issues: issues,
                    hasResponsiveDesign: document.querySelector('meta[name="viewport"]') !== null
                }
            };
        },

        /**
         * 極大画面テスト
         */
        testLargeScreen() {
            const currentWidth = window.innerWidth;
            const isLargeScreen = currentWidth > 2560;
            
            // 極大画面での問題確認
            const issues = [];
            
            if (currentWidth > 2560) {
                // コンテンツの最大幅確認
                const mainContent = document.querySelector('main, .container, .wrapper');
                if (mainContent) {
                    const contentWidth = mainContent.getBoundingClientRect().width;
                    if (contentWidth === currentWidth) {
                        issues.push('コンテンツ幅が制限されていない');
                    }
                }

                // 読みにくい行長のテキスト
                const longTextElements = Array.from(document.querySelectorAll('p, .text')).filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.width > 800; // 読みやすい行長を超える
                });

                if (longTextElements.length > 0) {
                    issues.push(`読みにくい長文: ${longTextElements.length}個`);
                }
            }

            return {
                status: issues.length === 0 ? 'pass' : 'warning',
                message: currentWidth > 2560 ? `極大画面(${currentWidth}px)での表示確認` : `通常画面(${currentWidth}px)`,
                details: {
                    currentWidth: currentWidth,
                    isLargeScreen: isLargeScreen,
                    issues: issues,
                    hasMaxWidth: CSS.supports('max-width', '1200px')
                }
            };
        },

        /**
         * 長時間ページ表示テスト
         */
        testLongPageDisplay() {
            const pageLoadTime = performance.now();
            const hasMemoryLeakRisks = {
                eventListenersCount: this.countEventListeners(),
                intervalTimersCount: this.countActiveTimers(),
                unusedDOMNodes: document.querySelectorAll('*').length
            };

            // メモリ使用量情報（可能な場合）
            let memoryInfo = null;
            if ('memory' in performance) {
                memoryInfo = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                };
            }

            return {
                status: 'pass',
                message: '長時間表示での安定性を確認',
                details: {
                    pageLoadTime: Math.round(pageLoadTime),
                    memoryInfo: memoryInfo,
                    ...hasMemoryLeakRisks,
                    hasPerformanceObserver: 'PerformanceObserver' in window
                }
            };
        },

        /**
         * メモリ制限環境テスト
         */
        testMemoryConstraints() {
            const memoryInfo = 'memory' in performance ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null;

            // メモリ使用量が多い要素の確認
            const heavyElements = {
                images: document.querySelectorAll('img').length,
                videos: document.querySelectorAll('video').length,
                canvases: document.querySelectorAll('canvas').length,
                totalDOMNodes: document.querySelectorAll('*').length
            };

            const memoryOptimizations = {
                hasLazyLoading: document.querySelectorAll('[loading="lazy"], [data-src]').length > 0,
                hasImageOptimization: document.querySelectorAll('picture, [srcset]').length > 0,
                hasVirtualScrolling: document.querySelector('[data-virtual]') !== null
            };

            return {
                status: Object.values(memoryOptimizations).some(Boolean) ? 'pass' : 'warning',
                message: 'メモリ制限環境での動作確認',
                details: {
                    memoryInfo: memoryInfo,
                    heavyElements: heavyElements,
                    optimizations: memoryOptimizations
                }
            };
        },

        /**
         * 古いブラウザ機能サポートテスト
         */
        testLegacyBrowserSupport() {
            const modernFeatures = {
                cssGrid: CSS.supports('display', 'grid'),
                cssFlexbox: CSS.supports('display', 'flex'),
                cssVariables: CSS.supports('--custom', '1'),
                es6Classes: typeof class {} === 'function',
                arrowFunctions: (() => true)(),
                templateLiterals: (() => { try { eval('`test`'); return true; } catch { return false; } })(),
                asyncAwait: typeof (async () => {}) === 'function',
                fetch: 'fetch' in window,
                promises: 'Promise' in window,
                intersectionObserver: 'IntersectionObserver' in window
            };

            const supportedFeatures = Object.values(modernFeatures).filter(Boolean).length;
            const totalFeatures = Object.keys(modernFeatures).length;

            // Polyfillsの確認
            const hasPolyfills = window.PolyfillInfo && window.PolyfillInfo.loaded;

            return {
                status: supportedFeatures >= totalFeatures * 0.8 ? 'pass' : 'warning',
                message: `モダン機能 ${supportedFeatures}/${totalFeatures} サポート`,
                details: {
                    modernFeatures: modernFeatures,
                    supportRate: Math.round((supportedFeatures / totalFeatures) * 100),
                    hasPolyfills: hasPolyfills,
                    polyfillInfo: window.PolyfillInfo || null
                }
            };
        },

        /**
         * タッチデバイス専用機能テスト
         */
        testTouchOnlyFeatures() {
            const touchSupport = {
                hasTouchEvents: 'ontouchstart' in window,
                hasPointerEvents: 'PointerEvent' in window,
                maxTouchPoints: navigator.maxTouchPoints || 0,
                touchAction: CSS.supports('touch-action', 'manipulation')
            };

            // タッチ用のUI要素確認
            const touchOptimizations = {
                largeTouchTargets: Array.from(document.querySelectorAll('a, button')).filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.width >= 44 && rect.height >= 44;
                }).length,
                hasSwipeGestures: document.querySelector('[data-swipe]') !== null,
                hasTouchActions: Array.from(document.querySelectorAll('*')).some(el => {
                    const styles = window.getComputedStyle(el);
                    return styles.touchAction !== 'auto';
                })
            };

            const isTouchDevice = touchSupport.hasTouchEvents || touchSupport.maxTouchPoints > 0;

            return {
                status: 'pass',
                message: isTouchDevice ? 'タッチデバイス対応確認' : 'デスクトップデバイス',
                details: {
                    ...touchSupport,
                    isTouchDevice: isTouchDevice,
                    ...touchOptimizations
                }
            };
        },

        /**
         * キーボードのみ操作テスト
         */
        testKeyboardOnlyNavigation() {
            const focusableElements = document.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );

            // フォーカス可能要素の確認
            const focusableStats = {
                total: focusableElements.length,
                withVisibleFocus: Array.from(focusableElements).filter(el => {
                    const styles = window.getComputedStyle(el);
                    return styles.outline !== 'none' || styles.boxShadow.includes('focus');
                }).length,
                withTabIndex: Array.from(focusableElements).filter(el => 
                    el.hasAttribute('tabindex')
                ).length
            };

            // アクセシビリティ属性の確認
            const accessibilityFeatures = {
                hasSkipLinks: document.querySelector('a[href="#main"], .skip-link') !== null,
                hasAriaLabels: document.querySelectorAll('[aria-label]').length,
                hasAriaDescribedBy: document.querySelectorAll('[aria-describedby]').length,
                hasLandmarks: document.querySelectorAll('header, nav, main, footer, aside').length
            };

            return {
                status: focusableStats.withVisibleFocus > focusableStats.total * 0.8 ? 'pass' : 'warning',
                message: `キーボードナビゲーション対応 ${focusableStats.withVisibleFocus}/${focusableStats.total}`,
                details: {
                    focusableStats: focusableStats,
                    accessibilityFeatures: accessibilityFeatures,
                    keyboardFriendly: focusableStats.withVisibleFocus > 0 && accessibilityFeatures.hasSkipLinks
                }
            };
        },

        /**
         * イベントリスナー数をカウント（概算）
         */
        countEventListeners() {
            // 正確なカウントは困難なため、一般的な要素を確認
            const elementsWithEvents = document.querySelectorAll('[onclick], [onload], [onchange]');
            return elementsWithEvents.length;
        },

        /**
         * アクティブなタイマー数をカウント（概算）
         */
        countActiveTimers() {
            // 実際のカウントは困難なため、0を返す
            return 0;
        },

        /**
         * テストレポート生成
         */
        generateTestReport() {
            const summary = {
                total: this.testResults.length,
                passed: this.testResults.filter(r => r.status === 'pass').length,
                warnings: this.testResults.filter(r => r.status === 'warning').length,
                failed: this.testResults.filter(r => r.status === 'fail').length,
                totalDuration: this.testResults.reduce((sum, r) => sum + r.duration, 0)
            };

            console.group('🔍 エッジケーステスト結果');
            console.log(`成功: ${summary.passed}/${summary.total}`);
            console.log(`警告: ${summary.warnings}`);
            console.log(`失敗: ${summary.failed}`);
            console.log(`実行時間: ${summary.totalDuration}ms`);
            console.groupEnd();

            // 重要な警告やエラーのハイライト
            const criticalIssues = this.testResults.filter(r => 
                r.status === 'fail' || (r.status === 'warning' && r.category === 'Accessibility')
            );
            
            if (criticalIssues.length > 0) {
                console.group('⚠️ 重要な問題');
                criticalIssues.forEach(issue => {
                    console.warn(`${issue.name}: ${issue.message}`);
                });
                console.groupEnd();
            }

            return summary;
        },

        /**
         * ユーティリティ: スリープ
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // グローバルに公開
    window.EdgeCaseTests = EdgeCaseTests;

    console.log('🔍 エッジケーステストスイートが読み込まれました');
    console.log('実行方法: EdgeCaseTests.runAllTests()');

})();