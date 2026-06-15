// ===== Home Page =====

function initHome() {
  renderCategories();
  renderTags();
  renderPosts(BlogDB.getAllPosts());
  initHeroChart();
  initFilterEvents();
  initCardAnimations();
  initTypewriter();
}

function initTypewriter() {
  const el = document.querySelector('.hero-subtitle');
  if (!el) return;
  const text = el.textContent;
  // Fix height to prevent layout shift when clearing text
  el.style.minHeight = el.offsetHeight + 'px';
  el.textContent = '';

  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.textContent = '|';
  el.after(cursor);

  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, 50 + Math.random() * 40);
    } else {
      cursor.style.animation = 'blink 0.8s step-end infinite';
    }
  }
  setTimeout(type, 500);
}

function renderCategories() {
  const container = document.getElementById('category-filter');
  if (!container) return;

  const categories = BlogDB.getAllCategories();
  container.innerHTML = categories.map((cat, i) =>
    `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-category="${cat}">${cat}</button>`
  ).join('');
}

function renderTags() {
  const container = document.getElementById('tag-cloud');
  if (!container) return;

  const tags = BlogDB.getAllTags();
  container.innerHTML = tags.map(tag =>
    `<span class="tag" data-tag="${tag}"># ${tag}</span>`
  ).join('');
}

function renderPosts(posts) {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;

  if (!posts.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <p class="empty-state-text">暂无符合条件的文章</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = posts.map((post, index) => `
    <article class="blog-card" style="animation-delay: ${index * 0.08}s"
             onclick="location.href='post.html?id=${post.id}'">
      <div class="blog-card-cover" style="background:linear-gradient(135deg, ${getCardColor(post.category)})">
        <span>${post.title}</span>
      </div>
      <div class="blog-card-body">
        <span class="blog-card-category">${post.category}</span>
        <h2 class="blog-card-title">${post.title}</h2>
        <p class="blog-card-summary">${post.summary}</p>
        <div class="blog-card-tags">
          ${post.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="blog-card-meta">
          <span>${formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getCardColor(category) {
  const colors = {
    'C++': '#6366f1, #8b5cf6',
    '算法': '#10b981, #059669',
    '系统': '#3b82f6, #06b6d4',
    '经验': '#f97316, #f59e0b',
  };
  return colors[category] || '#6366f1, #8b5cf6';
}

function initFilterEvents() {
  // Category filter
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      categoryFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;
      const posts = BlogDB.getPostsByCategory(category);
      renderPosts(posts);
    });
  }

  // Tag filter
  const tagCloud = document.getElementById('tag-cloud');
  if (tagCloud) {
    tagCloud.addEventListener('click', (e) => {
      const tag = e.target.closest('.tag');
      if (!tag) return;

      // Toggle active
      const isActive = tag.classList.contains('tag-active');
      tagCloud.querySelectorAll('.tag').forEach(t => t.classList.remove('tag-active'));

      let posts;
      if (isActive) {
        posts = BlogDB.getAllPosts();
      } else {
        tag.classList.add('tag-active');
        posts = BlogDB.getPostsByTag(tag.dataset.tag);
      }

      // Reset category filter
      const catFilter = document.getElementById('category-filter');
      if (catFilter) {
        catFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const allBtn = catFilter.querySelector('[data-category="全部"]');
        if (allBtn) allBtn.classList.add('active');
      }

      renderPosts(posts);
    });
  }
}

function initCardAnimations() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.blog-card').forEach(card => observer.observe(card));
  }
}

function initHeroChart() {
  const chartDom = document.getElementById('hero-chart');
  if (!chartDom || typeof echarts === 'undefined') return;

  const myChart = echarts.init(chartDom);
  const skills = BlogDB.getSkills();

  const option = {
    tooltip: {
      backgroundColor: 'var(--color-card)',
      borderColor: 'var(--color-border)',
      textStyle: { color: 'var(--color-text)', fontSize: 12 }
    },
    radar: {
      indicator: [
        { name: 'C++', max: 100 },
        { name: '算法', max: 100 },
        { name: 'STL', max: 100 },
        { name: '操作系统', max: 100 },
        { name: '前端', max: 100 }
      ],
      shape: 'circle',
      splitNumber: 4,
      axisName: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim() || '#64748b',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#e2e8f0'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(99, 102, 241, 0.02)', 'rgba(99, 102, 241, 0.04)']
        }
      },
      axisLine: {
        lineStyle: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim() || '#e2e8f0'
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [skills.cpp, skills.algorithms, skills.stl, skills.os, skills.web],
        name: '技能',
        areaStyle: { color: 'rgba(99, 102, 241, 0.2)' },
        lineStyle: { color: '#6366f1', width: 2 },
        itemStyle: { color: '#6366f1' }
      }],
      symbol: 'circle',
      symbolSize: 6,
      animationDuration: 1500,
      animationEasing: 'cubicOut'
    }]
  };

  myChart.setOption(option);

  // Resize handler
  window.addEventListener('resize', () => myChart.resize());

  // Theme change handler
  window.addEventListener('themechange', () => {
    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-text-secondary').trim() || '#64748b';
    const borderColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-border').trim() || '#e2e8f0';

    myChart.setOption({
      radar: {
        axisName: { color: textColor },
        splitLine: { lineStyle: { color: borderColor } },
        axisLine: { lineStyle: { color: borderColor } }
      }
    });
    myChart.resize();
  });
}
