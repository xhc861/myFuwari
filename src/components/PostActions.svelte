<script lang="ts">
  import ShareModal from './ShareModal.svelte';
  import { onDestroy } from 'svelte';
  
  export let slug: string;
  export let title: string;
  export let published: Date;
  export let words: number;
  export let minutes: number;
  
  let showShareModal = false;
  
  // 激光笔功能
  let laserPointerEnabled = false;
  let laserElement: HTMLDivElement | null = null;
  
  function addFavorite() {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcut = isMac ? 'Cmd+D' : 'Ctrl+D';
    alert(`请按 ${shortcut} 将本页添加到书签`);
  }
  
  function handleShare() {
    showShareModal = true;
  }
  
  async function exportToPDF() {
    // 使用浏览器打印功能导出 PDF
    window.print();
  }
  
  // 激光笔功能
  function toggleLaserPointer() {
    laserPointerEnabled = !laserPointerEnabled;
    
    if (laserPointerEnabled) {
      createLaserPointer();
    } else {
      removeLaserPointer();
    }
  }
  
  function createLaserPointer() {
    if (laserElement) return;
    
    laserElement = document.createElement('div');
    laserElement.className = 'laser-pointer';
    laserElement.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 0, 0, 0.8) 0%, rgba(255, 0, 0, 0.4) 50%, transparent 100%);
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4);
      transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(laserElement);
    document.addEventListener('mousemove', updateLaserPosition);
  }
  
  function updateLaserPosition(e: MouseEvent) {
    if (laserElement) {
      laserElement.style.left = `${e.clientX}px`;
      laserElement.style.top = `${e.clientY}px`;
    }
  }
  
  function removeLaserPointer() {
    if (laserElement) {
      document.removeEventListener('mousemove', updateLaserPosition);
      laserElement.remove();
      laserElement = null;
    }
  }
  
  onDestroy(() => {
    removeLaserPointer();
  });
</script>

<div class="post-actions">
  <button 
    class="action-btn bookmark-btn" 
    on:click={addFavorite}
    aria-label="添加到书签"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
    <span>收藏</span>
  </button>
  
  <button 
    class="action-btn share-btn" 
    on:click={handleShare}
    aria-label="分享文章"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
    <span>分享</span>
  </button>
  
  <button 
    class="action-btn pdf-btn" 
    on:click={exportToPDF}
    aria-label="导出PDF"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
    <span>导出PDF</span>
  </button>
  
  <button 
    class="action-btn tool-btn {laserPointerEnabled ? 'active' : ''}" 
    on:click={toggleLaserPointer}
    aria-label="激光笔"
    title="激光笔 (Ctrl+Shift+L)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
    </svg>
    <span>激光笔</span>
  </button>
</div>

<ShareModal 
  bind:show={showShareModal} 
  {title} 
  {slug} 
  {published}
  {words}
  {minutes}
/>

<style>
  .post-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border: 1px solid var(--line-divider);
    background: var(--card-bg);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    color: var(--text-color);
  }
  
  :global(.dark) .action-btn {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .action-btn:hover {
    background: var(--btn-card-bg-hover);
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .action-btn:active {
    transform: translateY(0);
  }
  
  .action-btn svg {
    flex-shrink: 0;
  }
  
  .divider {
    width: 1px;
    height: 2rem;
    background: var(--line-divider);
    opacity: 0.5;
    align-self: center;
  }
  
  .tool-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .tool-btn.active:hover {
    background: var(--primary);
    opacity: 0.9;
  }
  
  @media (max-width: 640px) {
    .post-actions {
      justify-content: center;
    }
    
    .action-btn {
      flex: 1;
      min-width: 100px;
      justify-content: center;
    }
  }
</style>
