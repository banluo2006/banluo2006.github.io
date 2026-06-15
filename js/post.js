// ===== Post Detail Page =====

function initPost() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  if (!postId) {
    showError('未指定文章 ID');
    return;
  }

  const post = BlogDB.getPostById(postId);
  if (!post) {
    showError('文章未找到');
    return;
  }

  renderPost(post);
  initProgressBar();
  initBackToTop();
  initMobileTOC();
}

function renderPost(post) {
  // Set page title
  document.title = `${post.title} - ${SITE_CONFIG.title}`;

  // Meta
  document.getElementById('post-category').textContent = post.category;
  document.getElementById('post-date').textContent = formatDate(post.date);
  document.getElementById('post-reading-time').textContent = `${post.readingTime} 分钟阅读`;
  document.getElementById('post-title').textContent = post.title;

  // Tags
  const tagsContainer = document.getElementById('post-tags');
  tagsContainer.innerHTML = post.tags.map(t => `<span class="tag">${t}</span>`).join('');

  // Render markdown content
  const contentDiv = document.getElementById('post-body');

  // Simple markdown to HTML rendering (without marked CDN dependency)
  if (typeof marked !== 'undefined') {
    contentDiv.innerHTML = marked.parse(post.content);

    // Highlight code blocks
    if (typeof hljs !== 'undefined') {
      contentDiv.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    }

    // Add copy buttons
    addCopyButtons(contentDiv);

    // Generate TOC
    generateTOC(contentDiv);

    // Generate mobile TOC
    generateMobileTOC(contentDiv);

    // Generate post navigation
    generatePostNav(post.id);
  } else {
    // Fallback: simple rendering
    contentDiv.innerHTML = `<pre>${escapeHtml(post.content)}</pre>`;
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addCopyButtons(container) {
  container.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = '📋 复制';

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      if (!code) return;

      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = '✅ 已复制';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '📋 复制';
          btn.classList.remove('copied');
        }, 2000);
      });
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

function generateTOC(container) {
  const toc = document.querySelector('.post-toc-list');
  if (!toc) return;

  const headings = container.querySelectorAll('h2, h3');
  if (!headings.length) {
    document.querySelector('.post-toc-wrapper')?.remove();
    return;
  }

  toc.innerHTML = '';
  headings.forEach(h => {
    const id = h.textContent.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/(^-|-$)/g, '');
    h.id = id;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = h.textContent;
    if (h.tagName === 'H3') a.className = 'toc-h3';
    li.appendChild(a);
    toc.appendChild(li);

    // Scroll spy
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Scroll spy
  const tocLinks = toc.querySelectorAll('a');
  window.addEventListener('scroll', () => {
    let current = '';
    headings.forEach(h => {
      const rect = h.getBoundingClientRect();
      if (rect.top <= 100) current = h.id;
    });
    tocLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });
}

function generateMobileTOC(container) {
  const btn = document.querySelector('.mobile-toc-toggle');
  const content = document.querySelector('.mobile-toc-content');
  if (!btn || !content) return;

  const list = document.createElement('ul');
  list.className = 'post-toc-list';

  const headings = container.querySelectorAll('h2, h3');
  headings.forEach(h => {
    const id = h.textContent.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/(^-|-$)/g, '');
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = h.textContent;
    if (h.tagName === 'H3') a.className = 'toc-h3';
    li.appendChild(a);

    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth' });
      content.classList.remove('open');
      btn.querySelector('.toc-arrow').textContent = '▸';
    });

    list.appendChild(li);
  });

  content.innerHTML = '';
  content.appendChild(list);

  btn.addEventListener('click', () => {
    const isOpen = content.classList.toggle('open');
    btn.querySelector('.toc-arrow').textContent = isOpen ? '▾' : '▸';
  });
}

function generatePostNav(currentId) {
  const posts = BlogDB.getAllPosts();
  const currentIndex = posts.findIndex(p => p.id === currentId);

  const prevContainer = document.getElementById('post-nav-prev');
  const nextContainer = document.getElementById('post-nav-next');

  if (currentIndex > 0) {
    const prev = posts[currentIndex - 1];
    prevContainer.innerHTML = `
      <a href="post.html?id=${prev.id}" class="post-nav-item">
        <div class="post-nav-label">← 上一篇</div>
        <div class="post-nav-title">${prev.title}</div>
      </a>
    `;
  } else {
    prevContainer.innerHTML = '';
  }

  if (currentIndex < posts.length - 1) {
    const next = posts[currentIndex + 1];
    nextContainer.innerHTML = `
      <a href="post.html?id=${next.id}" class="post-nav-item next">
        <div class="post-nav-label">下一篇 →</div>
        <div class="post-nav-title">${next.title}</div>
      </a>
    `;
  } else {
    nextContainer.innerHTML = '';
  }
}

function initProgressBar() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initMobileTOC() {
  // Handled in generateMobileTOC
}

function showError(msg) {
  document.getElementById('post-title').textContent = '😅 出错了';
  document.getElementById('post-body').innerHTML = `<p style="text-align:center;padding:3rem;color:var(--color-text-muted)">${msg}</p>`;
}
