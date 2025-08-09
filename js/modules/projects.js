/**
 * Simple Projects Gallery Module
 * シンプルなプロジェクトギャラリー機能
 */

const SimpleProjects = (() => {
  'use strict';
  
  // DOM要素
  let projectsGrid = null;
  let filterButtons = [];
  let projectsData = [];
  let currentFilter = 'all';
  
  /**
   * モジュール初期化
   */
  function init() {
    try {
      // DOM要素取得
      projectsGrid = document.getElementById('projects-grid');
      filterButtons = document.querySelectorAll('.filter-btn');
      
      if (!projectsGrid) {
        console.warn('Projects grid not found');
        return;
      }
      
      // データ読み込みとイベント設定
      loadProjects();
      setupEventListeners();
      
      console.log('Simple projects gallery initialized');
      
    } catch (error) {
      console.error('Failed to initialize projects gallery:', error);
    }
  }
  
  /**
   * プロジェクトデータの読み込み
   */
  async function loadProjects() {
    try {
      const response = await fetch('data/projects.json');
      const data = await response.json();
      projectsData = data.projects || [];
      
      // 初期表示（全プロジェクト）
      renderProjects(projectsData);
      
    } catch (error) {
      console.error('Failed to load projects:', error);
      projectsGrid.innerHTML = '<p>プロジェクトの読み込みに失敗しました</p>';
    }
  }
  
  /**
   * イベントリスナーの設定
   */
  function setupEventListeners() {
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        filterProjects(filter);
        updateActiveButton(e.target);
      });
    });
  }
  
  /**
   * プロジェクトのフィルタリング
   */
  function filterProjects(filter) {
    currentFilter = filter;
    
    let filteredData;
    if (filter === 'all') {
      filteredData = projectsData;
    } else {
      filteredData = projectsData.filter(project => project.category === filter);
    }
    
    renderProjects(filteredData);
  }
  
  /**
   * アクティブボタンの更新
   */
  function updateActiveButton(activeButton) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }
  
  /**
   * プロジェクトカードの生成
   */
  function renderProjects(projects) {
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach((project, index) => {
      const card = createProjectCard(project, index);
      projectsGrid.appendChild(card);
    });
  }
  
  /**
   * 単一プロジェクトカードの作成（アニメーション対応）
   */
  function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card scroll-animate fade-in-right';
    card.setAttribute('data-delay', `${index * 100}`);
    
    card.innerHTML = `
      <div class="project-image">
        <img 
          src="${project.thumbnail || project.image}" 
          alt="${project.title}"
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech-stack">
          ${(project.technologies || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-links">
          ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link demo-link">Demo</a>` : ''}
          ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link github-link">GitHub</a>` : ''}
        </div>
      </div>
    `;
    
    // カードクリックでデモページに移動
    card.addEventListener('click', () => {
      if (project.demoUrl || project.demo) {
        window.open(project.demoUrl || project.demo, '_blank', 'noopener,noreferrer');
      }
    });

    // カードにホバーエフェクトを追加
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
    
    return card;
  }
  
  /**
   * プロジェクト画像のsrcset生成
   */
  function generateProjectImageSrcSet(originalPath) {
    if (!originalPath) return '';
    
    const sizes = [400, 800, 1200];
    const extension = originalPath.split('.').pop();
    const basePath = originalPath.replace(`.${extension}`, '');
    
    return sizes.map(size => {
      // WebP版があれば優先、なければ元の形式
      return `${basePath}-${size}w.webp ${size}w`;
    }).join(', ');
  }
  
  /**
   * プレースホルダー画像のSVG生成
   */
  function generatePlaceholderImage() {
    const svg = `
      <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <g fill="#d1d5db" transform="translate(150, 75)">
          <circle cx="50" cy="50" r="20"/>
          <path d="M20 90h80l-20-30-15 20-10-15z"/>
        </g>
      </svg>
    `;
    return btoa(svg);
  }
  
  // パブリックAPI
  return {
    init
  };
})();

// 初期化
document.addEventListener('DOMContentLoaded', SimpleProjects.init);
window.SimpleProjects = SimpleProjects;