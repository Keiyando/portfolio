/**
 * スキルセクション - JavaScript機能
 * プログレスバーアニメーション、Intersection Observer
 */

(function() {
  'use strict';
  
  // スキルセクション管理クラス
  const SkillsManager = {
    // 設定
    config: {
      threshold: 0.3, // 30%見えたらアニメーション開始
      rootMargin: '0px 0px -50px 0px',
      animationDelay: 150, // カード間のアニメーション遅延（ms）
    },
    
    // 状態管理
    state: {
      isInitialized: false,
      animatedCards: new Set(), // アニメーション済みカードのセット
    },
    
    /**
     * 初期化
     */
    init() {
      try {
        this.setupIntersectionObserver();
        this.state.isInitialized = true;
        console.log('Skills module initialized');
      } catch (error) {
        console.error('Skills module initialization failed:', error);
      }
    },
    
    /**
     * Intersection Observer セットアップ
     */
    setupIntersectionObserver() {
      // Intersection Observer がサポートされているかチェック
      if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported, falling back to immediate animation');
        this.fallbackAnimation();
        return;
      }
      
      const observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: this.config.threshold,
          rootMargin: this.config.rootMargin
        }
      );
      
      // スキルカードを監視対象に追加
      const skillCards = document.querySelectorAll('.skill-card');
      skillCards.forEach(card => {
        observer.observe(card);
      });
      
      // スキルセクション全体も監視
      const skillsSection = document.querySelector('.skills-section');
      if (skillsSection) {
        observer.observe(skillsSection);
      }
    },
    
    /**
     * Intersection Observer コールバック
     */
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('skill-card')) {
            this.animateSkillCard(entry.target);
        }
      });
    },
    
    /**
     * スキルカードのアニメーション
     */
    animateSkillCard(card) {
      const cardId = card.dataset.skillId || card.querySelector('.skill-name')?.textContent;
      
      // 既にアニメーション済みの場合はスキップ
      if (this.state.animatedCards.has(cardId)) {
        return;
      }
      
      // アニメーション開始
      card.classList.add('animate-in');
      this.state.animatedCards.add(cardId);
      
    },
    
    
    
    /**
     * フォールバック: Intersection Observer 非対応時
     */
    fallbackAnimation() {
      // 即座に全てのアニメーションを実行
      const skillCards = document.querySelectorAll('.skill-card');
      skillCards.forEach((card, index) => {
        setTimeout(() => {
          this.animateSkillCard(card);
        }, index * this.config.animationDelay);
      });
      
    },
    
    /**
     * スキルカードのホバーエフェクト強化
     */
    setupHoverEffects() {
      const skillCards = document.querySelectorAll('.skill-card');
      
      skillCards.forEach(card => {
        const icon = card.querySelector('.skill-icon');
        
        card.addEventListener('mouseenter', () => {
          if (icon) {
            icon.classList.add('pulse-on-hover');
          }
        });
        
        card.addEventListener('mouseleave', () => {
          if (icon) {
            icon.classList.remove('pulse-on-hover');
          }
        });
      });
    },
    
    /**
     * パフォーマンス測定
     */
    measurePerformance() {
      if ('performance' in window) {
        const startTime = performance.now();
        
        // アニメーション完了後に測定
        setTimeout(() => {
          const endTime = performance.now();
          console.log(`Skills animation completed in ${endTime - startTime}ms`);
        }, 2000);
      }
    },
    
    /**
     * リサイズハンドラー
     */
    handleResize() {
      // 必要に応じてレイアウト調整
      const skillsGrid = document.querySelectorAll('.skills-grid');
      skillsGrid.forEach(grid => {
        // グリッドの再計算をトリガー
        grid.style.display = 'none';
        grid.offsetHeight; // リフロー強制
        grid.style.display = '';
      });
    }
  };
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      SkillsManager.init();
    });
  } else {
    SkillsManager.init();
  }
  
  // リサイズイベント
  const debouncedResize = debounce(() => {
    SkillsManager.handleResize();
  }, 250);
  
  window.addEventListener('resize', debouncedResize, { passive: true });
  
  // グローバルに公開（デバッグ用）
  window.SkillsManager = SkillsManager;
  
  // デバウンス関数（main.js から利用可能であることを前提）
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
  
})();