// ===== 3D Galaxy Particle Background =====

function initParticles() {
  const container = document.getElementById('hero-section');
  if (!container) return;

  // Clean up old canvas if exists
  const oldCanvas = document.getElementById('galaxy-canvas');
  if (oldCanvas) oldCanvas.remove();

  const canvas = document.createElement('canvas');
  canvas.id = 'galaxy-canvas';
  container.insertBefore(canvas, container.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let time = 0;
  let animationId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = Math.max(container.offsetHeight, 500);
  }

  function getColors() {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--color-primary').trim() || '#6366f1';
    const accent = style.getPropertyValue('--color-accent').trim() || '#f59e0b';
    return { primary, accent };
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 99, g: 102, b: 241 };
  }

  // Galaxy arm particle
  class GalaxyParticle {
    constructor() {
      this.reset();
    }

    reset(dim) {
      // Spiral galaxy distribution
      const arms = 3;
      const arm = Math.floor(Math.random() * arms);
      const armAngle = (arm / arms) * Math.PI * 2;
      const dist = Math.pow(Math.random(), 1.5) * 300 + 20;
      const angle = armAngle + dist * 0.008 + (Math.random() - 0.5) * 0.5;
      const spread = (Math.random() - 0.5) * (30 + dist * 0.1);

      this.baseX = Math.cos(angle) * dist + Math.sin(angle) * spread * 0.3;
      this.baseY = Math.sin(angle) * dist - Math.cos(angle) * spread * 0.3;
      this.baseZ = (Math.random() - 0.5) * 100;

      this.x = this.baseX;
      this.y = this.baseY;
      this.z = this.baseZ;

      this.size = Math.random() * 2.5 + 0.5;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      this.colorMix = Math.random();
    }

    update(mx, my) {
      // Rotation around center
      const rotSpeed = 0.0005;
      time += 0.002;

      const angle = time + this.baseX * 0.0005;

      // Mouse interaction - slight pull
      const dx = mx / window.innerWidth - 0.5;
      const dy = my / container.offsetHeight - 0.5;
      const mouseInfluence = 0.3;

      const rotX = this.baseX * Math.cos(angle * rotSpeed) - this.baseZ * Math.sin(angle * rotSpeed);
      const rotZ = this.baseX * Math.sin(angle * rotSpeed) + this.baseZ * Math.cos(angle * rotSpeed);

      this.x = rotX + dx * mouseInfluence * (this.baseZ + 100) * 0.1;
      this.y = this.baseY + dy * mouseInfluence * (this.baseZ + 100) * 0.1;
      this.z = rotZ;

      // Twinkle
      this.twinkle = 0.5 + 0.5 * Math.sin(Date.now() * this.twinkleSpeed + this.twinkleOffset);
    }

    draw(ctx, w, h) {
      const colors = getColors();
      const primary = hexToRgb(colors.primary);
      const accent = hexToRgb(colors.accent);

      // 3D perspective
      const perspective = 500 / (500 + this.z);
      const sx = this.x * perspective + w / 2;
      const sy = this.y * perspective + h / 2;
      const size = this.size * perspective * 2;

      if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) return;
      if (this.z > 400) return;

      // Color based on position in galaxy
      const mix = (this.colorMix + this.twinkle * 0.3);
      const r = Math.round(primary.r * (1 - mix) + accent.r * mix);
      const g = Math.round(primary.g * (1 - mix) + accent.g * mix);
      const b = Math.round(primary.b * (1 - mix) + accent.b * mix);
      const alpha = this.twinkle * Math.min(1, perspective * 1.5);

      // Glow effect
      const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 3);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`);
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.beginPath();
      ctx.arc(sx, sy, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();

      // Bright center
      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      ctx.fill();
    }
  }

  // Starfield background particles
  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5;
      this.speed = Math.random() * 0.3 + 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.pulse += 0.02;
      this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
      ctx.fill();
    }
  }

  let galaxyParticles = [];
  let stars = [];

  function init() {
    resize();
    const count = Math.min(Math.floor(canvas.width * canvas.height / 5000), 200);
    galaxyParticles = Array.from({ length: count }, () => new GalaxyParticle());
    stars = Array.from({ length: 50 }, () => new Star());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dark background gradient
    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-bg').trim() || '#0b1121';
    const gradient = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 0,
      canvas.width/2, canvas.height/2, canvas.width * 0.7
    );
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(0.5, 'rgba(0,0,0,0.95)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    stars.forEach(s => {
      s.update();
      s.draw(ctx);
    });

    // Draw central glow
    const colors = getColors();
    const prim = hexToRgb(colors.primary);
    const glowGrad = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 0,
      canvas.width/2, canvas.height/2, 250
    );
    glowGrad.addColorStop(0, `rgba(${prim.r}, ${prim.g}, ${prim.b}, 0.06)`);
    glowGrad.addColorStop(1, `rgba(${prim.r}, ${prim.g}, ${prim.b}, 0)`);
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw galaxy particles
    galaxyParticles.forEach(p => {
      p.update(mouseX, mouseY);
      p.draw(ctx, canvas.width, canvas.height);
    });

    animationId = requestAnimationFrame(animate);
  }

  // Mouse tracking
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  container.addEventListener('mouseleave', () => {
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
  });

  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('themechange', () => {
    // Colors update on next frame automatically via getColors()
  });

  init();
  animate();

  // Cleanup
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}
