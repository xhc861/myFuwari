<script lang="ts">
  import { onMount } from 'svelte';
  
  let enabled = false;
  let radius = 150;
  let spotlightElement: HTMLDivElement | null = null;
  
  function createSpotlight() {
    if (spotlightElement) return;
    
    spotlightElement = document.createElement('div');
    spotlightElement.className = 'spotlight-overlay';
    spotlightElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9998;
      background: radial-gradient(circle ${radius}px at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 0%, rgba(0, 0, 0, 0.85) 100%);
      transition: background 0.1s ease;
    `;
    
    document.body.appendChild(spotlightElement);
    document.addEventListener('mousemove', updateSpotlightPosition);
  }
  
  function updateSpotlightPosition(e: MouseEvent) {
    if (spotlightElement) {
      spotlightElement.style.background = `radial-gradient(circle ${radius}px at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(0, 0, 0, 0.85) 100%)`;
    }
  }
  
  function removeSpotlight() {
    if (spotlightElement) {
      document.removeEventListener('mousemove', updateSpotlightPosition);
      spotlightElement.remove();
      spotlightElement = null;
    }
  }
  
  onMount(() => {
    // 加载初始设置
    const saved = localStorage.getItem('effectsSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      enabled = settings.spotlightEnabled ?? false;
      radius = settings.spotlightRadius ?? 150;
    }
    
    if (enabled) {
      createSpotlight();
    }
    
    // 监听设置变化
    const handleSettingsChange = (event: CustomEvent) => {
      const wasEnabled = enabled;
      enabled = event.detail.spotlightEnabled;
      radius = event.detail.spotlightRadius ?? 150;
      
      if (enabled && !wasEnabled) {
        createSpotlight();
      } else if (!enabled && wasEnabled) {
        removeSpotlight();
      } else if (enabled && spotlightElement) {
        // 更新半径
        spotlightElement.style.background = `radial-gradient(circle ${radius}px at var(--mouse-x, 50%) var(--mouse-y, 50%), transparent 0%, rgba(0, 0, 0, 0.85) 100%)`;
      }
    };
    
    window.addEventListener('effectsSettingsChanged', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('effectsSettingsChanged', handleSettingsChange as EventListener);
      removeSpotlight();
    };
  });
</script>
