// ===== About Page =====

function initAbout() {
  renderAboutInfo();
  initAboutChart();
  renderTimeline();
}

// ===== Edit Mode =====
let isEditMode = false;
let editingTimeline = [];
let editingSkills = [];
let editingBio = {};

function toggleEditMode() {
  isEditMode = !isEditMode;
  const btn = document.getElementById('edit-toggle-btn');
  const icon = document.getElementById('fab-icon');
  const label = document.getElementById('fab-label');
  if (isEditMode) {
    editingTimeline = JSON.parse(JSON.stringify(BlogDB.getTimeline()));
    editingSkills = JSON.parse(JSON.stringify(BlogDB.getSkills()));
    editingBio = JSON.parse(JSON.stringify(BlogDB.getBio()));
    btn.classList.add('is-editing');
    icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
    label.textContent = '退出编辑';
    document.getElementById('edit-save-bar').style.display = 'flex';
    renderEditableInfo();
    renderEditableTimeline();
    renderEditableSkills();
  } else {
    btn.classList.remove('is-editing');
    icon.innerHTML = '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>';
    label.textContent = '编辑历程';
    document.getElementById('edit-save-bar').style.display = 'none';
    renderAboutInfo();
    renderTimeline();
    initAboutChart();
  }
}

function renderEditableInfo() {
  const nameEl = document.getElementById('about-name');
  const bioEl = document.getElementById('about-bio');
  if (nameEl) {
    nameEl.style.display = 'none';
    let input = document.getElementById('about-name-edit');
    if (!input) {
      input = document.createElement('input');
      input.type = 'text';
      input.id = 'about-name-edit';
      input.className = 'about-edit-name-input';
      input.placeholder = '你的名字';
      input.onchange = function() { editingBio.author = this.value; };
      nameEl.parentNode.insertBefore(input, nameEl.nextSibling);
    }
    input.value = editingBio.author;
    input.style.display = 'block';
  }
  if (bioEl) {
    bioEl.style.display = 'none';
    let textarea = document.getElementById('about-bio-edit');
    if (!textarea) {
      textarea = document.createElement('textarea');
      textarea.id = 'about-bio-edit';
      textarea.className = 'about-edit-bio-input';
      textarea.rows = 3;
      textarea.placeholder = '个人简介';
      textarea.onchange = function() { editingBio.bio = this.value; };
      bioEl.parentNode.insertBefore(textarea, bioEl.nextSibling);
    }
    textarea.value = editingBio.bio;
    textarea.style.display = 'block';
  }
}

function renderEditableTimeline() {
  const container = document.getElementById('timeline');
  if (!container) return;

  container.innerHTML = editingTimeline.map((item, idx) => `
    <div class="timeline-item timeline-edit-item" data-idx="${idx}">
      <div class="timeline-dot"></div>
      <div class="timeline-edit-fields">
        <input type="text" class="timeline-edit-input timeline-edit-date" value="${item.date}"
               placeholder="日期 (如 2026-06)" onchange="updateTimelineItem(${idx},'date',this.value)">
        <input type="text" class="timeline-edit-input timeline-edit-title" value="${escapeHtml(item.title)}"
               placeholder="事件标题" onchange="updateTimelineItem(${idx},'title',this.value)">
        <textarea class="timeline-edit-input timeline-edit-desc" rows="2"
                  placeholder="事件描述" onchange="updateTimelineItem(${idx},'desc',this.value)">${escapeHtml(item.desc)}</textarea>
      </div>
      <button class="timeline-del-btn" onclick="deleteTimelineItem(${idx})" title="删除">✕</button>
    </div>
  `).join('');

  // Add button
  const addBtn = document.createElement('button');
  addBtn.className = 'timeline-add-btn';
  addBtn.textContent = '＋ 添加学习节点';
  addBtn.onclick = addTimelineItem;
  container.appendChild(addBtn);
}

function renderEditableSkills() {
  const chartDom = document.getElementById('about-chart');
  if (!chartDom) return;

  chartDom.style.height = 'auto';
  chartDom.style.minHeight = '280px';

  const html = editingSkills.map((skill, idx) => `
    <div class="skill-edit-row" data-idx="${idx}">
      <input type="text" class="skill-edit-name" value="${escapeHtml(skill.label)}"
             placeholder="技能名称" onchange="updateSkillLabel(${idx}, this.value)">
      <input type="range" class="skill-edit-slider" min="0" max="100" value="${skill.value}"
             oninput="updateSkillValue(${idx}, this.value)">
      <span class="skill-edit-value" id="skill-val-${idx}">${skill.value}</span>
      <button class="skill-edit-del" onclick="deleteSkill(${idx})" title="删除">✕</button>
    </div>
  `).join('') + `
    <button class="skill-edit-add" onclick="addSkill()">＋ 添加技能</button>
  `;

  chartDom.innerHTML = html;
}

function updateSkillLabel(idx, label) {
  if (editingSkills[idx]) editingSkills[idx].label = label;
}

function updateSkillValue(idx, value) {
  const v = parseInt(value);
  if (editingSkills[idx]) editingSkills[idx].value = v;
  const valEl = document.getElementById('skill-val-' + idx);
  if (valEl) valEl.textContent = v;
}

function deleteSkill(idx) {
  if (editingSkills.length <= 1) {
    showTimelineToast('至少保留一个技能', 'error');
    return;
  }
  if (!confirm(`确定删除「${editingSkills[idx]?.label}」吗？`)) return;
  editingSkills.splice(idx, 1);
  renderEditableSkills();
}

function addSkill() {
  const key = 'custom-' + Date.now();
  editingSkills.push({ key, label: '新技能', value: 50 });
  renderEditableSkills();
}

function updateTimelineItem(idx, field, value) {
  if (editingTimeline[idx]) {
    editingTimeline[idx][field] = value;
  }
}

function deleteTimelineItem(idx) {
  if (!confirm(`确定删除「${editingTimeline[idx]?.title || '这个节点'}」吗？`)) return;
  editingTimeline.splice(idx, 1);
  renderEditableTimeline();
}

function addTimelineItem() {
  editingTimeline.push({
    date: new Date().toISOString().slice(0, 7),
    title: '新历程',
    desc: '填写描述...'
  });
  renderEditableTimeline();
  // Scroll to bottom
  const container = document.getElementById('timeline');
  if (container) container.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function updateSkill(key, value) {
  // Legacy function kept for compatibility
}

let dataDirHandle = null;

function saveTimeline() {
  const btn = document.getElementById('edit-save-btn');
  const origText = btn.textContent;
  btn.textContent = '⏳ 保存中...';
  btn.disabled = true;

  // Merge edits into BLOG_DATA
  BLOG_DATA.timeline = JSON.parse(JSON.stringify(editingTimeline));
  BLOG_DATA.skills = JSON.parse(JSON.stringify(editingSkills));
  BLOG_DATA._siteConfig = {
    author: editingBio.author,
    bio: editingBio.bio
  };

  const content = generateAboutDataJS();

  if (dataDirHandle) {
    saveTimelineToFile(dataDirHandle, content);
  } else {
    fallbackTimelineSave(content);
    btn.textContent = '✅ 已下载';
    setTimeout(() => { btn.textContent = '💾 保存修改'; btn.disabled = false; }, 2000);
  }
}

async function saveTimelineToFile(dirHandle, content) {
  try {
    const fileHandle = await dirHandle.getFileHandle('posts.js', { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    showTimelineToast('✅ 已保存到 posts.js！刷新查看效果', 'success');
    document.getElementById('edit-save-btn').textContent = '✅ 已保存';
    setTimeout(() => {
      document.getElementById('edit-save-btn').textContent = '💾 保存修改';
      document.getElementById('edit-save-btn').disabled = false;
    }, 2000);
  } catch (e) {
    showTimelineToast('直接保存失败，使用下载方式', 'error');
    fallbackTimelineSave(content);
  }
}

function fallbackTimelineSave(content) {
  const blob = new Blob([content], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'posts.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showTimelineToast('📥 已下载 posts.js，请覆盖到 data 目录', 'success');
  document.getElementById('edit-save-btn').textContent = '✅ 已下载';
  setTimeout(() => {
    document.getElementById('edit-save-btn').textContent = '💾 保存修改';
    document.getElementById('edit-save-btn').disabled = false;
  }, 2000);
}

function generateAboutDataJS() {
  const saveData = {
    posts: BLOG_DATA.posts || [],
    skills: editingSkills,
    timeline: editingTimeline,
    _siteConfig: {
      author: editingBio.author,
      bio: editingBio.bio
    }
  };
  return 'const BLOG_DATA = ' + JSON.stringify(saveData, null, 2) + ';\n';
}

function showTimelineToast(msg, type) {
  const toast = document.getElementById('edit-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'edit-toast ' + type + ' show';
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function renderAboutInfo() {
  const bio = BlogDB.getBio();
  const nameEl = document.getElementById('about-name');
  const bioEl = document.getElementById('about-bio');
  if (nameEl) {
    nameEl.textContent = bio.author;
    nameEl.style.display = '';
  }
  if (bioEl) {
    bioEl.textContent = bio.bio;
    bioEl.style.display = '';
  }
  const nameInput = document.getElementById('about-name-edit');
  const bioInput = document.getElementById('about-bio-edit');
  if (nameInput) nameInput.style.display = 'none';
  if (bioInput) bioInput.style.display = 'none';
}

function initAboutChart() {
  const chartDom = document.getElementById('about-chart');
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
      indicator: skills.map(s => ({ name: s.label, max: 100 })),
      shape: 'circle',
      splitNumber: 4,
      axisName: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim() || '#64748b',
        fontSize: 12
      },
      splitLine: {
        lineStyle: { color: 'rgba(99, 102, 241, 0.15)' }
      },
      axisLine: {
        lineStyle: { color: 'rgba(99, 102, 241, 0.15)' }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: skills.map(s => s.value),
        name: '技能',
        areaStyle: {
          color: {
            type: 'radial',
            x: 0.5, y: 0.5, r: 0.5,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
              { offset: 1, color: 'rgba(167, 139, 250, 0.1)' }
            ]
          }
        },
        lineStyle: { color: '#6366f1', width: 2 },
        itemStyle: { color: '#6366f1' }
      }],
      symbol: 'circle',
      symbolSize: 6,
      animationDuration: 2000,
      animationEasing: 'elasticOut'
    }]
  };

  myChart.setOption(option);
  window.addEventListener('resize', () => myChart.resize());

  window.addEventListener('themechange', () => {
    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-text-secondary').trim() || '#64748b';
    myChart.setOption({
      radar: { axisName: { color: textColor } }
    });
  });
}

function renderTimeline() {
  const container = document.getElementById('timeline');
  if (!container) return;

  const timeline = BlogDB.getTimeline();
  container.innerHTML = timeline.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-date">${item.date}</div>
      <div class="timeline-title">${item.title}</div>
      <div class="timeline-desc">${item.desc}</div>
    </div>
  `).join('');
}
