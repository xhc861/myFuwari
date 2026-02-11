<script lang="ts">
  import { onMount } from 'svelte';
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let particles: Particle[] = [];
  let animationId: number;
  let enabled = true;
  
  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    
    constructor(width: number, height: number) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      
      const colors = ['#5bc0eb', '#fde74c', '#9bc53d', '#e55934', '#fa7921'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(width: number, height: number) {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  function initParticles() {
    const width = canvas.width;
    const height = canvas.height;
    particles = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(width, height));
    }
  }
  
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = '#808080';
          ctx.globalAlpha = 0.2 * (1 - distance / 150);
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }
  
  function animate() {
    if (!enabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update(canvas.width, canvas.height);
      particle.draw(ctx);
    });
    
    drawLines();
    
    animationId = requestAnimationFrame(animate);
  }
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  
  onMount(() => {
    ctx = canvas.getContext('2d')!;
    resizeCanvas();
    
    // 加载初始设置
    const saved = localStorage.getItem('effectsSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      enabled = settings.particlesEnabled ?? true;
    }
    
    if (enabled) {
      animate();
    }
    
    // 监听设置变化
    const handleSettingsChange = (event: CustomEvent) => {
      const wasEnabled = enabled;
      enabled = event.detail.particlesEnabled;
      
      if (enabled && !wasEnabled) {
        animate();
      } else if (!enabled && wasEnabled) {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    window.addEventListener('effectsSettingsChanged', handleSettingsChange as EventListener);
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('effectsSettingsChanged', handleSettingsChange as EventListener);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  });
</script>

<canvas bind:this={canvas} class="particles-container" class:hidden={!enabled}></canvas>

<style>
  .particles-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }
  
  :global(.dark) .particles-container {
    opacity: 0.6;
  }
</style>
