<script lang="ts">
  import { onMount } from 'svelte';
  import confetti from 'canvas-confetti';
  
  let enabled = true;
  
  // 点击触发五彩纸屑
  function handleClick(event: MouseEvent) {
    if (!enabled) return;
    
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    
    // 鲜艳莫兰迪色系 - 提高饱和度，保持柔和
    const morandiColors = [
      '#E8B4B8',  // 珊瑚粉
      '#B8D4E8',  // 天空蓝
      '#D4E8B8',  // 薄荷绿
      '#E8D4B8',  // 杏仁黄
      '#D4B8E8',  // 薰衣草紫
      '#E8C4B8',  // 蜜桃橙
      '#B8E8D4',  // 青瓷绿
      '#E8B8D4',  // 玫瑰粉
    ];
    
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { x, y },
      colors: morandiColors,
      startVelocity: 20,
      gravity: 1.2,
      ticks: 100
    });
  }
  
  onMount(() => {
    // 监听设置变化
    const handleSettingsChange = (e: CustomEvent) => {
      enabled = e.detail.confettiEnabled;
    };
    
    window.addEventListener('effectsSettingsChanged', handleSettingsChange as EventListener);
    
    // 加载初始设置
    const saved = localStorage.getItem('effectsSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      enabled = settings.confettiEnabled ?? true;
    }
    
    if (enabled) {
      document.addEventListener('click', handleClick);
    }
    
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('effectsSettingsChanged', handleSettingsChange as EventListener);
    };
  });
  
  // 响应式地添加/移除事件监听
  $: {
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.addEventListener('click', handleClick);
      } else {
        document.removeEventListener('click', handleClick);
      }
    }
  }
</script>
