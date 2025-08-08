/**
 * ポートフォリオサイト - メインJavaScript
 * エントリーポイント
 */

(function() {
  'use strict';
  
  // DOM読み込み完了後に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio site initialized');
    
    // アプリケーションの初期化
    initializeApp();
  });
  
  /**
   * アプリケーション初期化
   */
  function initializeApp() {
    try {
      // 基本機能の初期化
      initializeBasicFeatures();
      
      // パフォーマンス測定
      measurePerformance();
      
    } catch (error) {
      console.error('App initialization failed:', error);
      // フォールバック処理
      initializeFallback();
    }
  }
  
  /**
   * 基本機能の初期化
   */
  function initializeBasicFeatures() {
    // スムーズスクロールの設定
    setupSmoothScrolling();
    
    // アクセシビリティ機能の設定
    setupAccessibility();
    
    console.log('Basic features initialized');
  }
  
  /**
   * スムーズスクロールの設定
   */
  function setupSmoothScrolling() {
    // アンカーリンクのスムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  /**
   * アクセシビリティ機能の設定
   */
  function setupAccessibility() {
    // フォーカス可視化の改善
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });
    
    document.addEventListener('mousedown', function() {
      document.body.classList.remove('using-keyboard');
    });
  }
  
  /**
   * パフォーマンス測定
   */
  function measurePerformance() {
    // Web Vitalsの基本測定
    window.addEventListener('load', function() {
      setTimeout(function() {
        if ('performance' in window) {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }
      }, 0);
    });
  }
  
  /**
   * フォールバック処理
   */
  function initializeFallback() {
    console.warn('Running in fallback mode');
    // 最小限の機能のみ提供
  }
  
  /**
   * ユーティリティ関数: デバウンス
   */
  function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  }
  
  /**
   * ユーティリティ関数: スロットル
   */
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // グローバルスコープに必要な関数をエクスポート
  window.PortfolioApp = {
    debounce: debounce,
    throttle: throttle
  };
  
})();