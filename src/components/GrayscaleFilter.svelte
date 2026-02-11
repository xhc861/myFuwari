<script lang="ts">
  import { onMount } from 'svelte';
  
  export let enabled = false;
  
  onMount(() => {
    // 加载初始设置
    const saved = localStorage.getItem('effectsSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      enabled = settings.grayscaleEnabled ?? false;
    }
    
    if (enabled) {
      document.documentElement.classList.add('grayscale-mode');
    }
    
    // 监听设置变化
    const handleSettingsChange = (event: CustomEvent) => {
      enabled = event.detail.grayscaleEnabled;
      if (enabled) {
        document.documentElement.classList.add('grayscale-mode');
      } else {
        document.documentElement.classList.remove('grayscale-mode');
      }
    };
    
    window.addEventListener('effectsSettingsChanged', handleSettingsChange as EventListener);
    
    return () => {
      document.documentElement.classList.remove('grayscale-mode');
      window.removeEventListener('effectsSettingsChanged', handleSettingsChange as EventListener);
    };
  });
</script>

<style>
  :global(html.grayscale-mode) {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
  }
  
  :global(html.grayscale-mode img),
  :global(html.grayscale-mode video) {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
  }
</style>
