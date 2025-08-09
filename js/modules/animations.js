/**
 * アニメーションモジュール - タイピング効果
 */

const AnimationController = (() => {
  'use strict';

  // 設定
  const config = {
    typing: {
      typeSpeed: 100,        // タイピング速度（ms）
      deleteSpeed: 50,       // 削除速度（ms）
      pauseDelay: 2000,      // 文章間の停止時間（ms）
      cursorBlinkSpeed: 1000 // カーソル点滅速度（ms）
    }
  };

  // プライベート変数
  let typingInstance = null;
  let reducedMotion = false;

  /**
   * タイピングアニメーションクラス
   */
  class TypingAnimation {
    constructor(element, texts, options = {}) {
      this.element = element;
      this.texts = Array.isArray(texts) ? texts : [texts];
      this.options = { ...config.typing, ...options };
      
      this.currentTextIndex = 0;
      this.currentCharIndex = 0;
      this.isDeleting = false;
      this.timeoutId = null;
      
      this.init();
    }

    init() {
      if (reducedMotion) {
        // アクセシビリティ対応: アニメーション無効時は最初のテキストを表示
        this.element.textContent = this.texts[0];
        this.element.classList.remove('cursor-blink');
        return;
      }

      // カーソル点滅のクラスを追加
      this.element.classList.add('cursor-blink');
      
      // タイピング開始
      this.type();
    }

    type() {
      const currentText = this.texts[this.currentTextIndex];
      
      if (this.isDeleting) {
        // 削除中
        this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
        this.currentCharIndex--;
        
        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
          this.timeoutId = setTimeout(() => this.type(), this.options.pauseDelay / 2);
          return;
        }
        
        this.timeoutId = setTimeout(() => this.type(), this.options.deleteSpeed);
      } else {
        // タイピング中
        this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
        this.currentCharIndex++;
        
        if (this.currentCharIndex === currentText.length) {
          this.timeoutId = setTimeout(() => {
            this.isDeleting = true;
            this.type();
          }, this.options.pauseDelay);
          return;
        }
        
        this.timeoutId = setTimeout(() => this.type(), this.options.typeSpeed);
      }
    }

    destroy() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.element.classList.remove('cursor-blink');
    }
  }

  /**
   * スクロール進捗バーとアクセシビリティ対応
   */
  function setupScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    // スロットル関数
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

    const updateProgress = throttle(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = Math.min(Math.max((winScroll / height) * 100, 0), 100);
      
      // アクセシビリティ: aria-valuenowを更新
      progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
      
      if (reducedMotion) {
        progressBar.style.width = scrolled + '%';
        progressBar.style.transform = 'none';
        progressBar.classList.add('no-animation');
      } else {
        progressBar.style.transform = `scaleX(${scrolled / 100})`;
        progressBar.classList.remove('no-animation');
      }
    }, 16); // 60fps相当

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress(); // 初期化
  }

  /**
   * カウントアップアニメーション
   */
  function animateCountUp(element, target, duration = 2000) {
    if (reducedMotion) {
      element.textContent = target;
      return;
    }

    let startTime;
    const startValue = 0;
    const endValue = parseInt(target);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuad イージング
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeProgress);
      
      element.textContent = currentValue + (element.dataset.suffix || '');
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  /**
   * 高度なIntersection Observerによるスクロールアニメーション
   */
  function setupScrollAnimations() {
    // 基本的なスクロールアニメーション要素
    const animateElements = document.querySelectorAll('.scroll-animate');
    // カウントアップ要素
    const countElements = document.querySelectorAll('.count-up');
    // テキストアニメーション要素
    const textAnimateElements = document.querySelectorAll('.text-animate');
    
    if (!('IntersectionObserver' in window)) {
      // フォールバック: Intersection Observer非対応の場合
      animateElements.forEach(el => el.classList.add('visible'));
      countElements.forEach(el => {
        el.textContent = el.dataset.target + (el.dataset.suffix || '');
      });
      textAnimateElements.forEach(el => el.classList.add('visible'));
      return;
    }

    // 基本アニメーション用オブザーバー
    const basicObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          
          setTimeout(() => {
            entry.target.classList.add('visible');
            
            // GPU加速を有効化
            entry.target.style.willChange = 'transform, opacity';
            
            // アニメーション完了後にwill-changeを削除
            setTimeout(() => {
              entry.target.style.willChange = 'auto';
            }, 1000);
          }, parseInt(delay));
          
          basicObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    });

    // カウントアップ用オブザーバー
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.target;
          const duration = entry.target.dataset.duration || 2000;
          const delay = entry.target.dataset.delay || 0;
          
          setTimeout(() => {
            animateCountUp(entry.target, target, parseInt(duration));
          }, parseInt(delay));
          
          countObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -20% 0px'
    });

    // テキストアニメーション用オブザーバー
    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.dataset.textAnimation || 'word-by-word';
          const delay = element.dataset.delay || 0;
          
          setTimeout(() => {
            animateText(element, animationType);
          }, parseInt(delay));
          
          textObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -10% 0px'
    });

    // オブザーバーに要素を登録
    animateElements.forEach(el => basicObserver.observe(el));
    countElements.forEach(el => countObserver.observe(el));
    textAnimateElements.forEach(el => textObserver.observe(el));
  }

  /**
   * テキストアニメーション
   */
  function animateText(element, type = 'word-by-word') {
    if (reducedMotion) {
      element.classList.add('visible');
      return;
    }

    const text = element.textContent;
    element.innerHTML = '';
    
    let delay = 0;
    const baseDelay = 100;

    switch (type) {
      case 'char-by-char':
        text.split('').forEach((char, index) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.opacity = '0';
          span.style.transform = 'translateY(20px)';
          span.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
          element.appendChild(span);
          
          setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          }, index * 50);
        });
        break;
        
      case 'word-by-word':
        text.split(' ').forEach((word, index) => {
          const span = document.createElement('span');
          span.textContent = word + ' ';
          span.style.opacity = '0';
          span.style.transform = 'translateY(30px)';
          span.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
          element.appendChild(span);
          
          setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          }, index * baseDelay);
        });
        break;
        
      case 'fade-up':
      default:
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        break;
    }
  }

  /**
   * タイピングアニメーションの初期化
   */
  function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = [
      '創造的なWebソリューションを設計・開発しています',
      'モダンな技術で課題を解決します',
      'ユーザー体験を最優先に考えます',
      '継続的な学習で技術力を向上させています'
    ];

    typingInstance = new TypingAnimation(typingElement, texts);
  }

  /**
   * アクセシビリティ設定の確認
   */
  function checkAccessibilityPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = prefersReducedMotion.matches;

    // メディアクエリの変更を監視
    prefersReducedMotion.addEventListener('change', (e) => {
      reducedMotion = e.matches;
      
      if (typingInstance) {
        typingInstance.destroy();
        if (!reducedMotion) {
          initTypingAnimation();
        }
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
        initTypingAnimation();
        setupScrollAnimations();
        setupScrollProgress();
      } catch (error) {
        console.error('Animation Controller initialization failed:', error);
      }
    },

    // タイピングアニメーションのON/OFF
    toggleTyping() {
      if (typingInstance) {
        typingInstance.destroy();
        typingInstance = null;
      } else {
        initTypingAnimation();
      }
    },

    // 設定の更新
    updateConfig(newConfig) {
      Object.assign(config, newConfig);
    }
  };
})();

// DOM読み込み完了後に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AnimationController.init);
} else {
  AnimationController.init();
}

// グローバルに公開
window.AnimationController = AnimationController;