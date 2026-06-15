// ===== Particle Background =====

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let animationId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = Math.max(
      document.getElementById('hero-section')?.offsetHeight || 500,
      400
    );
  }

  function getColors() {
    const style = getComputedStyle(document.documentElement);
    return {
      primary: style.getPropertyValue('--color-primary').trim() || '#6366f1',
      accent: style.getPropertyValue('--color-accent').trim() || '#f59e0b',
      bg: style.getPropertyValue('--color-bg').trim() || '#f8fafc',
    };
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 99, g: 102, b: 241 };
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX + Math.sin(this.phase) * 0.1;
      this.y += this.speedY + Math.cos(this.phase) * 0.1;
      this.phase += 0.01;
      this.opacity = 0.3 + 0.3 * Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset);

      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      const colors = getColors();
      const primary = hexToRgb(colors.primary);
      const accent = hexToRgb(colors.accent);

      // Blend between primary and accent based on position
      const mix = (this.x / canvas.width + this.y / canvas.height) / 2;
      const r = Math.round(primary.r * (1 - mix) + accent.r * mix);
      const g = Math.round(primary.g * (1 - mix) + accent.g * mix);
      const b = Math.round(primary.b * (1 - mix) + accent.b * mix);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function connectParticles() {
    const colors = getColors();
    const primary = hexToRgb(colors.primary);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const opacity = (1 - distance / 150) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(canvas.width * canvas.height / 8000), 80);
    particles = Array.from({ length: count }, () => new Particle());
    animate();
  }

  // Mouse interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    particles.forEach(p => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x += dx * 0.02;
        p.y += dy * 0.02;
      }
    });
  });

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.reset());
  });

  window.addEventListener('themechange', () => {
    // Just re-render, colors update on next frame
  });

  init();

  // Return cleanup function
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}
