/**
 * Lazy Loading Module
 * 画像の遅延読み込み機能
 */

const LazyLoader = (() => {
  'use strict';
  
  // 設定オブジェクト
  const config = {
    rootMargin: '50px 0px',
    threshold: 0.1,
    enabledClass: 'lazyload',
    loadedClass: 'loaded',
    loadingClass: 'loading',
    errorClass: 'error',
    placeholderClass: 'placeholder'
  };
  
  // Intersection Observer インスタンス
  let imageObserver = null;
  let isSupported = false;
  
  /**
   * モジュール初期化
   */
  function init() {
    try {
      // Intersection Observer サポート確認
      isSupported = 'IntersectionObserver' in window &&
                   'IntersectionObserverEntry' in window &&
                   'intersectionRatio' in window.IntersectionObserverEntry.prototype;
      
      if (isSupported) {
        setupIntersectionObserver();
        observeImages();
      } else {
        // フォールバック: 即座に全画像を読み込み
        loadAllImages();
      }
      
      console.log('LazyLoader initialized', { supported: isSupported });
      
    } catch (error) {
      console.error('LazyLoader initialization failed:', error);
      // エラー時もフォールバック
      loadAllImages();
    }
  }
  
  /**
   * Intersection Observer 設定
   */
  function setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: config.rootMargin,
      threshold: config.threshold
    };
    
    imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    }, options);
  }
  
  /**
   * 既存の画像を監視対象に追加
   */
  function observeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (imageObserver) {
        imageObserver.observe(img);
      }
    });
  }
  
  /**
   * 単一画像の読み込み
   */
  function loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (!src) return;
    
    // ローディング状態を設定
    img.classList.add(config.loadingClass);
    
    // 新しい画像オブジェクトを作成して事前読み込み
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // 成功時の処理
      img.src = src;
      
      if (srcset) {
        img.srcset = srcset;
      }
      
      img.classList.remove(config.loadingClass);
      img.classList.add(config.loadedClass);
      
      // data-* 属性をクリーンアップ
      img.removeAttribute('data-src');
      if (srcset) {
        img.removeAttribute('data-srcset');
      }
      
      // ローディング完了イベントを発火
      img.dispatchEvent(new CustomEvent('lazyloaded', {
        detail: { src: src }
      }));
      
      // アニメーション効果
      animateImageLoad(img);
      
    };
    
    imageLoader.onerror = () => {
      // エラー時の処理
      img.classList.remove(config.loadingClass);
      img.classList.add(config.errorClass);
      
      // エラー時のフォールバック画像
      setErrorImage(img);
      
      // エラーイベントを発火
      img.dispatchEvent(new CustomEvent('lazyerror', {
        detail: { src: src }
      }));
    };
    
    // 読み込み開始
    imageLoader.src = src;
    if (srcset) {
      imageLoader.srcset = srcset;
    }
  }
  
  /**
   * 画像読み込み時のアニメーション
   */
  function animateImageLoad(img) {
    // フェードイン効果
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
    
    // 次のフレームで透明度を1に
    requestAnimationFrame(() => {
      img.style.opacity = '1';
      
      // アニメーション完了後にスタイルをクリア
      setTimeout(() => {
        img.style.opacity = '';
        img.style.transition = '';
      }, 300);
    });
  }
  
  /**
   * エラー画像の設定
   */
  function setErrorImage(img) {
    const errorImageSvg = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <g fill="#6b7280">
          <path d="M200 75c-13.807 0-25 11.193-25 25s11.193 25 25 25 25-11.193 25-25-11.193-25-25-25zm0 40c-8.271 0-15-6.729-15-15s6.729-15 15-15 15 6.729 15 15-6.729 15-15 15z"/>
          <path d="M350 50H50c-8.271 0-15 6.729-15 15v120c0 8.271 6.729 15 15 15h300c8.271 0 15-6.729 15-15V65c0-8.271-6.729-15-15-15zM45 65c0-2.757 2.243-5 5-5h300c2.757 0 5 2.243 5 5v120c0 2.757-2.243 5-5 5H50c-2.757 0-5-2.243-5-5V65z"/>
          <path d="M70 160l40-40 30 30 70-70 90 90v30H70z"/>
        </g>
        <text x="200" y="160" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">
          画像が読み込めませんでした
        </text>
      </svg>
    `)}`;
    
    img.src = errorImageSvg;
  }
  
  /**
   * フォールバック: 全画像即座読み込み
   */
  function loadAllImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
      
      if (srcset) {
        img.srcset = srcset;
        img.removeAttribute('data-srcset');
      }
      
      img.classList.add(config.loadedClass);
    });
  }
  
  /**
   * 新しい画像を監視対象に追加
   */
  function observeNewImage(img) {
    if (!img || !img.dataset.src) return;
    
    if (isSupported && imageObserver) {
      imageObserver.observe(img);
    } else {
      // フォールバック
      loadImage(img);
    }
  }
  
  /**
   * 画像の監視を停止
   */
  function unobserveImage(img) {
    if (imageObserver && img) {
      imageObserver.unobserve(img);
    }
  }
  
  /**
   * 全監視を停止
   */
  function disconnect() {
    if (imageObserver) {
      imageObserver.disconnect();
    }
  }
  
  /**
   * レスポンシブ画像用のsrcset生成ヘルパー
   */
  function generateSrcSet(basePath, sizes = [400, 800, 1200]) {
    return sizes.map(size => {
      const extension = basePath.split('.').pop();
      const nameWithoutExt = basePath.replace(`.${extension}`, '');
      return `${nameWithoutExt}-${size}w.${extension} ${size}w`;
    }).join(', ');
  }
  
  /**
   * プリロード用の関数
   */
  function preloadImages(urls) {
    return Promise.all(
      urls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(new Error(`Failed to load ${url}`));
          img.src = url;
        });
      })
    );
  }
  
  /**
   * 統計情報の取得
   */
  function getStats() {
    const totalImages = document.querySelectorAll('img').length;
    const lazyImages = document.querySelectorAll('img[data-src]').length;
    const loadedImages = document.querySelectorAll(`.${config.loadedClass}`).length;
    const errorImages = document.querySelectorAll(`.${config.errorClass}`).length;
    
    return {
      total: totalImages,
      lazy: lazyImages,
      loaded: loadedImages,
      errors: errorImages,
      remaining: lazyImages,
      loadedPercentage: totalImages > 0 ? Math.round((loadedImages / totalImages) * 100) : 0
    };
  }
  
  /**
   * デバッグ情報の表示
   */
  function debug() {
    const stats = getStats();
    console.table(stats);
    return stats;
  }
  
  // パブリック API
  return {
    init,
    observeNewImage,
    unobserveImage,
    disconnect,
    loadImage,
    generateSrcSet,
    preloadImages,
    getStats,
    debug,
    
    // 設定
    get config() { return { ...config }; },
    get isSupported() { return isSupported; }
  };
})();

// DOM読み込み完了時に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', LazyLoader.init);
} else {
  LazyLoader.init();
}

// グローバルスコープにエクスポート
window.LazyLoader = LazyLoader;