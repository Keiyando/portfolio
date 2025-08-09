/**
 * Footer Module
 * フッターに関する機能を管理
 */

const FooterModule = (() => {
  'use strict';
  
  // プライベート変数
  let backToTopButton = null;
  let scrollThreshold = 300; // スクロール閾値（px）
  
  /**
   * 初期化
   */
  function init() {
    try {
      backToTopButton = document.querySelector('.back-to-top');
      
      if (backToTopButton) {
        setupBackToTop();
      }
      
      updateCurrentYear();
      
    } catch (error) {
      console.error('Footer module initialization failed:', error);
    }
  }
  
  /**
   * トップへ戻るボタンの設定
   */
  function setupBackToTop() {
    // スクロールイベント（スロットル使用）
    const handleScroll = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > scrollThreshold) {
        showBackToTopButton();
      } else {
        hideBackToTopButton();
      }
    }, 100);
    
    // クリックイベント
    const handleClick = (event) => {
      event.preventDefault();
      scrollToTop();
    };
    
    // イベントリスナー追加
    window.addEventListener('scroll', handleScroll, { passive: true });
    backToTopButton.addEventListener('click', handleClick);
    
    // 初期状態設定
    handleScroll();
  }
  
  /**
   * トップへ戻るボタンを表示
   */
  function showBackToTopButton() {
    if (backToTopButton && !backToTopButton.classList.contains('visible')) {
      backToTopButton.classList.add('visible');
    }
  }
  
  /**
   * トップへ戻るボタンを非表示
   */
  function hideBackToTopButton() {
    if (backToTopButton && backToTopButton.classList.contains('visible')) {
      backToTopButton.classList.remove('visible');
    }
  }
  
  /**
   * スムーズにページトップへスクロール
   */
  function scrollToTop() {
    const start = window.pageYOffset;
    const duration = 800;
    const startTime = performance.now();
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // イージング関数（easeOutCubic）
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentPosition = start * (1 - ease);
      
      window.scrollTo(0, currentPosition);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }
  
  /**
   * 現在年を動的に更新
   */
  function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      const currentYear = new Date().getFullYear();
      yearElement.textContent = currentYear;
    }
  }
  
  /**
   * スロットル関数
   * @param {Function} func - 実行する関数
   * @param {number} limit - 制限時間（ms）
   * @returns {Function} - スロットル適用された関数
   */
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
  
  // パブリックAPI
  return {
    init,
    scrollToTop, // 外部から呼び出し可能
    showBackToTopButton,
    hideBackToTopButton
  };
})();

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', FooterModule.init);

// モジュールをグローバルに公開（他のモジュールから使用可能）
window.FooterModule = FooterModule;