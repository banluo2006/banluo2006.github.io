// ===== About Page =====

function initAbout() {
  renderAboutInfo();
  initAboutChart();
  renderTimeline();
}

function renderAboutInfo() {
  document.getElementById('about-name').textContent = SITE_CONFIG.author;
  document.getElementById('about-bio').textContent = SITE_CONFIG.bio;
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
        value: [skills.cpp, skills.algorithms, skills.stl, skills.os, skills.web],
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
