/**
 * ブラウザ互換性ポリフィル
 * 古いブラウザ対応とフィーチャー検出
 */

(function() {
    'use strict';

    // デバッグログ用
    const debug = false;
    const log = debug ? console.log.bind(console, '[Polyfill]:') : function() {};

    /**
     * IntersectionObserver ポリフィル
     */
    if (!('IntersectionObserver' in window)) {
        log('Adding IntersectionObserver polyfill');
        
        window.IntersectionObserver = class {
            constructor(callback, options = {}) {
                this.callback = callback;
                this.options = {
                    root: options.root || null,
                    rootMargin: options.rootMargin || '0px',
                    threshold: options.threshold || 0
                };
                this.elements = new WeakMap();
            }

            observe(element) {
                this.elements.set(element, true);
                this._checkIntersection(element);
            }

            unobserve(element) {
                this.elements.delete(element);
            }

            disconnect() {
                this.elements = new WeakMap();
            }

            _checkIntersection(element) {
                const rect = element.getBoundingClientRect();
                const isIntersecting = (
                    rect.top < window.innerHeight &&
                    rect.bottom > 0 &&
                    rect.left < window.innerWidth &&
                    rect.right > 0
                );

                this.callback([{
                    target: element,
                    isIntersecting: isIntersecting,
                    intersectionRatio: isIntersecting ? 1 : 0
                }]);
            }
        };
    }

    /**
     * ResizeObserver ポリフィル
     */
    if (!('ResizeObserver' in window)) {
        log('Adding ResizeObserver polyfill');
        
        window.ResizeObserver = class {
            constructor(callback) {
                this.callback = callback;
                this.elements = new Set();
                this.resizeHandler = this._handleResize.bind(this);
            }

            observe(element) {
                if (this.elements.size === 0) {
                    window.addEventListener('resize', this.resizeHandler);
                }
                this.elements.add(element);
            }

            unobserve(element) {
                this.elements.delete(element);
                if (this.elements.size === 0) {
                    window.removeEventListener('resize', this.resizeHandler);
                }
            }

            disconnect() {
                window.removeEventListener('resize', this.resizeHandler);
                this.elements.clear();
            }

            _handleResize() {
                const entries = Array.from(this.elements).map(element => ({
                    target: element,
                    contentRect: element.getBoundingClientRect()
                }));
                this.callback(entries);
            }
        };
    }

    /**
     * CSS.supports ポリフィル
     */
    if (!window.CSS || !window.CSS.supports) {
        log('Adding CSS.supports polyfill');
        
        if (!window.CSS) {
            window.CSS = {};
        }

        window.CSS.supports = function(property, value) {
            const element = document.createElement('div');
            try {
                element.style[property] = value;
                return element.style[property] === value;
            } catch (e) {
                return false;
            }
        };
    }

    /**
     * Element.matches ポリフィル
     */
    if (!Element.prototype.matches) {
        log('Adding Element.matches polyfill');
        
        Element.prototype.matches = 
            Element.prototype.matchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(selector) {
                const matches = (this.document || this.ownerDocument).querySelectorAll(selector);
                let i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    /**
     * Element.closest ポリフィル
     */
    if (!Element.prototype.closest) {
        log('Adding Element.closest polyfill');
        
        Element.prototype.closest = function(selector) {
            let element = this;
            while (element && element.nodeType === 1) {
                if (element.matches(selector)) {
                    return element;
                }
                element = element.parentElement;
            }
            return null;
        };
    }

    /**
     * Object.assign ポリフィル
     */
    if (!Object.assign) {
        log('Adding Object.assign polyfill');
        
        Object.assign = function(target) {
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            const to = Object(target);
            for (let index = 1; index < arguments.length; index++) {
                const nextSource = arguments[index];
                if (nextSource != null) {
                    for (const nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }

    /**
     * Array.from ポリフィル
     */
    if (!Array.from) {
        log('Adding Array.from polyfill');
        
        Array.from = function(arrayLike, mapFn, thisArg) {
            const C = this;
            const items = Object(arrayLike);
            
            if (arrayLike == null) {
                throw new TypeError('Array.from requires an array-like object');
            }

            const mapFunction = mapFn === undefined ? false : mapFn;
            if (typeof mapFunction !== 'undefined' && typeof mapFunction !== 'function') {
                throw new TypeError('Array.from: when provided, the second argument must be a function');
            }

            const len = parseInt(items.length);
            const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);

            let k = 0;
            while (k < len) {
                const kValue = items[k];
                const mappedValue = mapFunction ? mapFunction.call(thisArg, kValue, k) : kValue;
                A[k] = mappedValue;
                k += 1;
            }
            A.length = len;
            return A;
        };
    }

    /**
     * CustomEvent ポリフィル
     */
    if (typeof window.CustomEvent !== 'function') {
        log('Adding CustomEvent polyfill');
        
        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        window.CustomEvent = CustomEvent;
    }

    /**
     * requestAnimationFrame ポリフィル
     */
    if (!window.requestAnimationFrame) {
        log('Adding requestAnimationFrame polyfill');
        
        let lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    /**
     * smooth scroll ポリフィル
     */
    if (!('scrollBehavior' in document.documentElement.style)) {
        log('Adding smooth scroll polyfill');
        
        const originalScrollTo = window.scrollTo;
        const originalScrollBy = window.scrollBy;
        const originalElementScrollIntoView = Element.prototype.scrollIntoView;

        window.scrollTo = function(x, y) {
            if (typeof x === 'object' && x.behavior === 'smooth') {
                smoothScrollTo(x.left || 0, x.top || 0);
            } else {
                originalScrollTo.call(window, x, y);
            }
        };

        Element.prototype.scrollIntoView = function(options) {
            if (typeof options === 'object' && options.behavior === 'smooth') {
                const rect = this.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                smoothScrollTo(0, rect.top + scrollTop);
            } else {
                originalElementScrollIntoView.call(this, options);
            }
        };

        function smoothScrollTo(x, y) {
            const startX = window.pageXOffset || document.documentElement.scrollLeft;
            const startY = window.pageYOffset || document.documentElement.scrollTop;
            const distanceX = x - startX;
            const distanceY = y - startY;
            const startTime = new Date().getTime();
            const duration = 500;

            function step() {
                const elapsed = new Date().getTime() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = easeInOutCubic(progress);
                
                window.scrollTo(
                    startX + (distanceX * ease),
                    startY + (distanceY * ease)
                );

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        }

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
    }

    /**
     * 基本的なフィーチャー検出
     */
    const featureDetection = {
        // CSS features
        cssGrid: CSS.supports('display', 'grid'),
        cssFlexbox: CSS.supports('display', 'flex'),
        cssVariables: CSS.supports('--custom-property', '1'),
        cssObjectFit: CSS.supports('object-fit', 'cover'),
        
        // JavaScript APIs
        intersectionObserver: 'IntersectionObserver' in window,
        resizeObserver: 'ResizeObserver' in window,
        fetch: 'fetch' in window,
        serviceWorker: 'serviceWorker' in navigator,
        localStorage: (function() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        })(),
        
        // 入力
        touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        pointer: 'PointerEvent' in window,
        
        // ネットワーク
        onLine: 'onLine' in navigator,
        connection: 'connection' in navigator,
        
        // 画像フォーマット
        webp: (function() {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 1, 1);
            return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
        })()
    };

    /**
     * ブラウザ情報の取得
     */
    const browserInfo = {
        name: getBrowserName(),
        version: getBrowserVersion(),
        isMobile: /Mobi|Android/i.test(navigator.userAgent),
        isTablet: /Tablet|iPad/i.test(navigator.userAgent),
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled
    };

    function getBrowserName() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edge') === -1) return 'Chrome';
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
        if (ua.indexOf('Edge') > -1) return 'Edge';
        if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
        return 'Unknown';
    }

    function getBrowserVersion() {
        const ua = navigator.userAgent;
        let version = 'Unknown';
        
        try {
            if (ua.indexOf('Chrome') > -1) {
                version = ua.match(/Chrome\/([0-9.]+)/)[1];
            } else if (ua.indexOf('Firefox') > -1) {
                version = ua.match(/Firefox\/([0-9.]+)/)[1];
            } else if (ua.indexOf('Safari') > -1) {
                version = ua.match(/Safari\/([0-9.]+)/)[1];
            } else if (ua.indexOf('Edge') > -1) {
                version = ua.match(/Edge\/([0-9.]+)/)[1];
            }
        } catch (e) {
            // バージョン取得失敗時はそのまま
        }
        
        return version;
    }

    // グローバルに公開
    window.PolyfillInfo = {
        features: featureDetection,
        browser: browserInfo,
        loaded: true
    };

    log('Polyfills loaded successfully', window.PolyfillInfo);

    // DOM準備完了時に情報をコンソール出力
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', logCompatibilityInfo);
    } else {
        logCompatibilityInfo();
    }

    function logCompatibilityInfo() {
        if (debug) {
            console.group('🔍 Browser Compatibility Information');
            console.log('Browser:', browserInfo.name, browserInfo.version);
            console.log('Platform:', browserInfo.platform);
            console.log('Mobile:', browserInfo.isMobile);
            console.log('Features:', featureDetection);
            console.groupEnd();
        }
    }

})();