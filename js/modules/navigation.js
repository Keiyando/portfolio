/**
 * ナビゲーションコントローラー
 * ヘッダー状態管理、モバイルメニュー、現在セクション表示
 */

const NavigationController = (() => {
  'use strict';

  // DOM要素キャッシュ
  let elements = {};

  // 状態管理
  let state = {
    isMobileMenuOpen: false,
    currentSection: 'hero',
    isScrolled: false,
    lastScrollY: 0
  };

  // 設定
  const config = {
    scrollThreshold: 100,
    headerHeightThreshold: 50,
    sectionOffsets: {},
    throttleDelay: 16 // 60fps
  };

  /**
   * DOM要素を取得・キャッシュ
   */
  function cacheElements() {
    elements = {
      header: document.querySelector('.site-header'),
      mobileToggle: document.querySelector('.mobile-menu-toggle'),
      mobileNav: document.querySelector('.mobile-nav'),
      mobileOverlay: document.querySelector('.mobile-nav-overlay'),
      navLinks: document.querySelectorAll('.nav-link'),
      mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
      allNavLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
      sections: document.querySelectorAll('section[id]'),
      body: document.body
    };
  }

  /**
   * セクションのオフセット位置を計算
   */
  function calculateSectionOffsets() {
    if (!elements.sections.length) return;

    const headerHeight = elements.header ? elements.header.offsetHeight : 0;
    
    elements.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.pageYOffset - headerHeight - 50;
      config.sectionOffsets[section.id] = Math.max(0, sectionTop);
    });
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
   * デバウンス関数
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * モバイルメニューを開く
   */
  function openMobileMenu() {
    if (!elements.mobileNav || !elements.mobileOverlay) return;

    state.isMobileMenuOpen = true;

    // アニメーション
    elements.mobileToggle.classList.add('active');
    elements.mobileNav.classList.add('active');
    elements.mobileOverlay.classList.add('active');

    // ARIA属性更新
    elements.mobileToggle.setAttribute('aria-expanded', 'true');
    elements.mobileToggle.setAttribute('aria-label', 'メニューを閉じる');
    elements.mobileNav.setAttribute('aria-hidden', 'false');
    elements.mobileOverlay.setAttribute('aria-hidden', 'false');

    // ページスクロールを無効化
    elements.body.style.overflow = 'hidden';

    // フォーカス管理
    const firstNavLink = elements.mobileNav.querySelector('.mobile-nav-link');
    if (firstNavLink) {
      setTimeout(() => firstNavLink.focus(), 300);
    }

    // ESCキーリスナー追加
    document.addEventListener('keydown', handleEscapeKey);
  }

  /**
   * モバイルメニューを閉じる
   */
  function closeMobileMenu() {
    if (!elements.mobileNav || !elements.mobileOverlay) return;

    state.isMobileMenuOpen = false;

    // アニメーション
    elements.mobileToggle.classList.remove('active');
    elements.mobileNav.classList.remove('active');
    elements.mobileOverlay.classList.remove('active');

    // ARIA属性更新
    elements.mobileToggle.setAttribute('aria-expanded', 'false');
    elements.mobileToggle.setAttribute('aria-label', 'メニューを開く');
    elements.mobileNav.setAttribute('aria-hidden', 'true');
    elements.mobileOverlay.setAttribute('aria-hidden', 'true');

    // ページスクロールを有効化
    elements.body.style.overflow = '';

    // ESCキーリスナー削除
    document.removeEventListener('keydown', handleEscapeKey);

    // フォーカスをトグルボタンに戻す
    elements.mobileToggle.focus();
  }

  /**
   * モバイルメニューのトグル
   */
  function toggleMobileMenu() {
    if (state.isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * ESCキーでメニューを閉じる
   */
  function handleEscapeKey(event) {
    if (event.key === 'Escape' && state.isMobileMenuOpen) {
      closeMobileMenu();
    }
  }

  /**
   * スクロール時のヘッダー状態更新
   */
  function updateHeaderState() {
    if (!elements.header) return;

    const currentScrollY = window.pageYOffset;
    const isScrolled = currentScrollY > config.scrollThreshold;

    // ヘッダー状態の更新
    if (isScrolled !== state.isScrolled) {
      state.isScrolled = isScrolled;
      
      if (isScrolled) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
    }

    // ヒーローセクションでの透明ヘッダー
    const heroHeight = elements.sections[0] ? elements.sections[0].offsetHeight : 0;
    const isInHero = currentScrollY < heroHeight * 0.8;
    
    if (isInHero) {
      elements.header.classList.add('transparent');
    } else {
      elements.header.classList.remove('transparent');
    }

    state.lastScrollY = currentScrollY;
  }

  /**
   * 現在のセクションを特定
   */
  function getCurrentSection() {
    const scrollPosition = window.pageYOffset + window.innerHeight * 0.3;

    for (const [sectionId, offset] of Object.entries(config.sectionOffsets)) {
      const nextSectionId = Object.keys(config.sectionOffsets)[
        Object.keys(config.sectionOffsets).indexOf(sectionId) + 1
      ];
      const nextOffset = nextSectionId ? config.sectionOffsets[nextSectionId] : Infinity;

      if (scrollPosition >= offset && scrollPosition < nextOffset) {
        return sectionId;
      }
    }

    return 'hero'; // デフォルト
  }

  /**
   * ナビゲーションリンクのアクティブ状態を更新
   */
  function updateActiveNavigation() {
    const currentSection = getCurrentSection();
    
    if (currentSection === state.currentSection) return;

    state.currentSection = currentSection;

    // 全てのnavリンクからactiveを削除
    elements.allNavLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    // 現在のセクションに対応するリンクをactiveに
    const activeLinks = document.querySelectorAll(`a[href="#${currentSection}"]`);
    activeLinks.forEach(link => {
      if (link.classList.contains('nav-link') || link.classList.contains('mobile-nav-link')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * スクロールイベントハンドラー
   */
  const handleScroll = throttle(() => {
    updateHeaderState();
    updateActiveNavigation();
  }, config.throttleDelay);

  /**
   * リサイズイベントハンドラー
   */
  const handleResize = debounce(() => {
    calculateSectionOffsets();
    
    // デスクトップサイズでモバイルメニューが開いていれば閉じる
    if (window.innerWidth >= 1024 && state.isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, 250);

  /**
   * ナビゲーションリンククリック処理
   */
  function handleNavLinkClick(event) {
    const link = event.currentTarget;
    
    // モバイルメニューのリンクがクリックされた場合、メニューを閉じる
    if (link.classList.contains('mobile-nav-link')) {
      // 少し遅延を入れてスムーズに見せる
      setTimeout(() => {
        closeMobileMenu();
      }, 100);
    }
  }

  /**
   * イベントリスナーの設定
   */
  function setupEventListeners() {
    // モバイルメニュートグル
    if (elements.mobileToggle) {
      elements.mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    // オーバーレイクリックでメニューを閉じる
    if (elements.mobileOverlay) {
      elements.mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // ナビゲーションリンク
    elements.allNavLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });

    // スクロールイベント
    window.addEventListener('scroll', handleScroll, { passive: true });

    // リサイズイベント
    window.addEventListener('resize', handleResize, { passive: true });

    // フォーカストラップ（モバイルメニュー内）
    if (elements.mobileNav) {
      elements.mobileNav.addEventListener('keydown', handleFocusTrap);
    }
  }

  /**
   * フォーカストラップ（モバイルメニュー内でのTab移動制限）
   */
  function handleFocusTrap(event) {
    if (!state.isMobileMenuOpen || event.key !== 'Tab') return;

    const focusableElements = elements.mobileNav.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab (backwards)
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (forwards)
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * 初期化
   */
  function init() {
    try {
      cacheElements();
      calculateSectionOffsets();
      setupEventListeners();
      
      // 初期状態の設定
      updateHeaderState();
      updateActiveNavigation();
      
      console.log('NavigationController initialized successfully');
    } catch (error) {
      console.error('NavigationController initialization failed:', error);
    }
  }

  /**
   * 公開API
   */
  return {
    init,
    
    // メソッド公開
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    
    // 状態取得
    getState() {
      return { ...state };
    },
    
    // 設定更新
    updateConfig(newConfig) {
      Object.assign(config, newConfig);
      calculateSectionOffsets(); // 設定変更時に再計算
    },
    
    // リフレッシュ（動的にセクションが追加された場合など）
    refresh() {
      calculateSectionOffsets();
      updateActiveNavigation();
    }
  };
})();

// DOM読み込み完了後に自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', NavigationController.init);
} else {
  NavigationController.init();
}

// グローバルエクスポート
window.NavigationController = NavigationController;