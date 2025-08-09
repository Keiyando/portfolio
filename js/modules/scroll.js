/**
 * スクロールコントローラー - スムーズスクロールとパララックス効果
 */

const ScrollController = (() => {
  'use strict';

  // 設定
  const config = {
    smoothScroll: {
      duration: 800,
      easing: 'easeInOutCubic'
    },
  };

  // プライベート変数
  let reducedMotion = false;

  /**
   * イージング関数
   */
  const easingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  };

  /**
   * スムーズスクロール実装
   */
  function smoothScrollTo(targetPosition, duration = config.smoothScroll.duration) {
    if (reducedMotion) {
      window.scrollTo(0, targetPosition);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const easingFunction = easingFunctions[config.smoothScroll.easing] || easingFunctions.easeInOutCubic;
      let startTime = null;

      function scrollStep(currentTime) {
        if (startTime === null) startTime = currentTime;
        
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easingFunction(progress);
        
        const currentPosition = startPosition + (distance * easedProgress);
        window.scrollTo(0, currentPosition);
        
        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        } else {
          resolve();
        }
      }
      
      requestAnimationFrame(scrollStep);
    });
  }

  /**
   * 指定要素までスクロール
   */
  function scrollToElement(element, offset = 0) {
    if (!element) return Promise.resolve();
    
    const elementRect = element.getBoundingClientRect();
    const elementPosition = elementRect.top + window.pageYOffset;
    const targetPosition = Math.max(0, elementPosition - offset);
    
    return smoothScrollTo(targetPosition);
  }


  /**
   * スロットル関数
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

  /**
   * アンカーリンクのクリックイベントを処理
   */
  function handleAnchorClick(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#') return;

    const targetElement = document.querySelector(href);
    if (!targetElement) return;

    event.preventDefault();
    
    // ヘッダーの高さを考慮したオフセット
    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.offsetHeight + 20 : 80;
    
    scrollToElement(targetElement, headerOffset);
    
    // アクセシビリティ: フォーカスを移動
    targetElement.focus({ preventScroll: true });
    
    // URLを更新（履歴に追加）
    if (history.pushState) {
      history.pushState(null, null, href);
    }
  }

  /**
   * "Back to Top" ボタンの制御
   */
  function setupBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    const throttledScroll = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isVisible = scrollTop > 300;
      
      backToTopButton.style.opacity = isVisible ? '1' : '0';
      backToTopButton.style.pointerEvents = isVisible ? 'auto' : 'none';
      
      if (reducedMotion) {
        backToTopButton.style.transform = 'none';
      } else {
        backToTopButton.style.transform = `translateY(${isVisible ? '0' : '20px'})`;
      }
    }, 100);

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // クリックイベント
    backToTopButton.addEventListener('click', (event) => {
      event.preventDefault();
      smoothScrollTo(0);
    });
  }


  /**
   * アクセシビリティ設定の確認
   */
  function checkAccessibilityPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = prefersReducedMotion.matches;

    prefersReducedMotion.addEventListener('change', (e) => {
      reducedMotion = e.matches;
    });
  }

  /**
   * キーボードアクセシビリティ
   */
  function setupKeyboardAccessibility() {
    // スペースキーとEnterキーでのスクロール
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return; // フォーム要素では無視
      }

      switch (event.key) {
        case ' ': // スペースキー
          event.preventDefault();
          const scrollAmount = window.innerHeight * 0.8;
          const currentScroll = window.pageYOffset;
          smoothScrollTo(currentScroll + scrollAmount);
          break;
        
        case 'Home': // Homeキー
          event.preventDefault();
          smoothScrollTo(0);
          break;
        
        case 'End': // Endキー
          event.preventDefault();
          const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          );
          smoothScrollTo(documentHeight);
          break;
      }
    });
  }

  /**
   * 公開API
   */
  return {
    init() {
      try {
        checkAccessibilityPreferences();
        
        // イベントリスナーの設定
        document.addEventListener('click', handleAnchorClick);
        
        // 各機能の初期化
        setupBackToTop();
        setupKeyboardAccessibility();
        
      } catch (error) {
        console.error('ScrollController initialization failed:', error);
      }
    },

    // 外部からスムーズスクロールを呼び出し可能
    scrollTo(target, offset = 0) {
      if (typeof target === 'number') {
        return smoothScrollTo(target);
      } else if (typeof target === 'string') {
        const element = document.querySelector(target);
        return scrollToElement(element, offset);
      } else if (target instanceof Element) {
        return scrollToElement(target, offset);
      }
      return Promise.resolve();
    },


    // 設定の更新
    updateConfig(newConfig) {
      Object.assign(config, newConfig);
    }
  };
})();

// DOM読み込み完了後に自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ScrollController.init);
} else {
  ScrollController.init();
}

// エクスポート
window.ScrollController = ScrollController;