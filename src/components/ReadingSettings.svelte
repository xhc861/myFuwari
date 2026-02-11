<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  let fontSize = 16;
  let lineHeight = 1.75;
  let fontFamily = 'default';
  let showSettings = false;
  let settingsElement: HTMLDivElement;
  
  // 无障碍阅读功能
  let accessibilityMode = false;
  let highContrast = false;
  let focusMode = false;
  
  const fontOptions = [
    { value: 'default', label: '默认字体' },
    { value: 'serif', label: '衬线体', family: 'Georgia, "Times New Roman", serif' },
    { value: 'sans-serif', label: '无衬线体', family: 'Arial, Helvetica, sans-serif' },
    { value: 'monospace', label: '等宽字体', family: '"Courier New", Courier, monospace' },
    { value: 'kai', label: '楷体', family: 'KaiTi, STKaiti, "AR PL UKai CN", serif' },
    { value: 'song', label: '宋体', family: 'SimSun, STSong, "AR PL UMing CN", serif' }
  ];
  
  onMount(() => {
    const savedFontSize = localStorage.getItem('readingFontSize');
    const savedLineHeight = localStorage.getItem('readingLineHeight');
    const savedFontFamily = localStorage.getItem('readingFontFamily');
    const savedAccessibilityMode = localStorage.getItem('accessibilityMode');
    const savedHighContrast = localStorage.getItem('highContrast');
    const savedFocusMode = localStorage.getItem('focusMode');
    
    if (savedFontSize) fontSize = parseInt(savedFontSize);
    if (savedLineHeight) lineHeight = parseFloat(savedLineHeight);
    if (savedFontFamily) fontFamily = savedFontFamily;
    if (savedAccessibilityMode) accessibilityMode = savedAccessibilityMode === 'true';
    if (savedHighContrast) highContrast = savedHighContrast === 'true';
    if (savedFocusMode) focusMode = savedFocusMode === 'true';
    
    applySettings();
    if (accessibilityMode) applyAccessibilityMode();
    if (highContrast) applyHighContrast();
    if (focusMode) applyFocusMode();
  });
  
  function applySettings() {
    const content = document.querySelector('.markdown-content');
    if (content) {
      (content as HTMLElement).style.fontSize = `${fontSize}px`;
      (content as HTMLElement).style.lineHeight = `${lineHeight}`;
      
      // 应用字体
      const selectedFont = fontOptions.find(f => f.value === fontFamily);
      if (selectedFont && selectedFont.family) {
        (content as HTMLElement).style.fontFamily = selectedFont.family;
      } else {
        (content as HTMLElement).style.fontFamily = '';
      }
    }
    
    localStorage.setItem('readingFontSize', fontSize.toString());
    localStorage.setItem('readingLineHeight', lineHeight.toString());
    localStorage.setItem('readingFontFamily', fontFamily);
  }
  
  function increaseFontSize() {
    if (fontSize < 24) {
      fontSize += 2;
      applySettings();
    }
  }
  
  function decreaseFontSize() {
    if (fontSize > 12) {
      fontSize -= 2;
      applySettings();
    }
  }
  
  function increaseLineHeight() {
    if (lineHeight < 2.5) {
      lineHeight += 0.25;
      applySettings();
    }
  }
  
  function decreaseLineHeight() {
    if (lineHeight > 1.25) {
      lineHeight -= 0.25;
      applySettings();
    }
  }
  
  function resetSettings() {
    fontSize = 16;
    lineHeight = 1.75;
    fontFamily = 'default';
    applySettings();
  }
  
  function toggleSettings() {
    showSettings = !showSettings;
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showSettings) {
      toggleSettings();
    }
  }
  
  // 无障碍阅读功能
  function toggleAccessibilityMode() {
    accessibilityMode = !accessibilityMode;
    localStorage.setItem('accessibilityMode', accessibilityMode.toString());
    
    if (accessibilityMode) {
      applyAccessibilityMode();
    } else {
      removeAccessibilityMode();
    }
  }
  
  function applyAccessibilityMode() {
    const content = document.querySelector('.markdown-content');
    if (content) {
      (content as HTMLElement).classList.add('accessibility-mode');
    }
  }
  
  function removeAccessibilityMode() {
    const content = document.querySelector('.markdown-content');
    if (content) {
      (content as HTMLElement).classList.remove('accessibility-mode');
    }
  }
  
  function toggleHighContrast() {
    highContrast = !highContrast;
    localStorage.setItem('highContrast', highContrast.toString());
    
    if (highContrast) {
      applyHighContrast();
    } else {
      removeHighContrast();
    }
  }
  
  function applyHighContrast() {
    document.body.classList.add('high-contrast-mode');
  }
  
  function removeHighContrast() {
    document.body.classList.remove('high-contrast-mode');
  }
  
  function toggleFocusMode() {
    focusMode = !focusMode;
    localStorage.setItem('focusMode', focusMode.toString());
    
    if (focusMode) {
      applyFocusMode();
    } else {
      removeFocusMode();
    }
  }
  
  function applyFocusMode() {
    const content = document.querySelector('.markdown-content');
    if (content) {
      (content as HTMLElement).classList.add('focus-mode');
    }
  }
  
  function removeFocusMode() {
    const content = document.querySelector('.markdown-content');
    if (content) {
      (content as HTMLElement).classList.remove('focus-mode');
    }
  }
  
  // 当设置面板显示时，将其移动到 body 并锁定滚动
  $: if (showSettings && settingsElement) {
    document.body.appendChild(settingsElement);
    document.body.style.overflow = 'hidden';
  } else if (!showSettings && typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
  
  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="reading-settings">
  <button class="settings-toggle" on:click={toggleSettings} aria-label="阅读设置" type="button">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2-5.2l-4.2 4.2m0 6l4.2 4.2"></path>
    </svg>
    <span>阅读设置</span>
  </button>
</div>

{#if showSettings}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    bind:this={settingsElement}
    class="settings-root"
    on:click={toggleSettings}
  >
    <div class="settings-content" on:click|stopPropagation>
      <div class="setting-group">
        <label>字体大小</label>
        <div class="control-group">
          <button on:click={decreaseFontSize} disabled={fontSize <= 12} type="button">-</button>
          <span class="value">{fontSize}px</span>
          <button on:click={increaseFontSize} disabled={fontSize >= 24} type="button">+</button>
        </div>
      </div>
      
      <div class="setting-group">
        <label>行距</label>
        <div class="control-group">
          <button on:click={decreaseLineHeight} disabled={lineHeight <= 1.25} type="button">-</button>
          <span class="value">{lineHeight.toFixed(2)}</span>
          <button on:click={increaseLineHeight} disabled={lineHeight >= 2.5} type="button">+</button>
        </div>
      </div>
      
      <div class="setting-group">
        <label>字体</label>
        <select bind:value={fontFamily} on:change={applySettings} class="font-select">
          {#each fontOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
      
      <div class="divider"></div>
      
      <div class="setting-group">
        <label>无障碍阅读</label>
        <div class="accessibility-controls">
          <button 
            class="accessibility-btn {accessibilityMode ? 'active' : ''}" 
            on:click={toggleAccessibilityMode}
            type="button"
            title="增强文本可读性"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>易读模式</span>
          </button>
          
          <button 
            class="accessibility-btn {highContrast ? 'active' : ''}" 
            on:click={toggleHighContrast}
            type="button"
            title="提高对比度"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2v20"></path>
            </svg>
            <span>高对比度</span>
          </button>
          
          <button 
            class="accessibility-btn {focusMode ? 'active' : ''}" 
            on:click={toggleFocusMode}
            type="button"
            title="专注阅读模式"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            <span>专注模式</span>
          </button>
        </div>
      </div>
      
      <button class="reset-btn" on:click={resetSettings} type="button">重置设置</button>
    </div>
  </div>
{/if}

<style>
  .reading-settings {
    position: relative;
    display: inline-block;
  }
  
  .settings-toggle {
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
  }
  
  :global(.dark) .settings-toggle {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .settings-toggle:hover {
    background: var(--btn-card-bg-hover);
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .settings-root {
    /* 完全脱离文档流 */
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 999999 !important;
    
    /* 背景和模糊 */
    background: rgba(0, 0, 0, 0.3) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    
    /* 居中布局 */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 1rem !important;
    
    /* 动画 */
    animation: fadeIn 0.2s ease-out !important;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .settings-content {
    background: var(--card-bg);
    border: 1px solid var(--line-divider);
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    min-width: 280px;
    animation: slideDown 0.2s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .setting-group {
    margin-bottom: 1rem;
  }
  
  .setting-group:last-of-type {
    margin-bottom: 0.75rem;
  }
  
  .setting-group label {
    display: block;
    font-size: 0.875rem;
    opacity: 0.7;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  :global(.dark) .setting-group label {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .control-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .control-group button {
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid var(--line-divider);
    background: var(--btn-card-bg-hover);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.25rem;
    font-weight: bold;
  }
  
  :global(.dark) .control-group button {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .control-group button:hover:not(:disabled) {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .control-group button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .control-group .value {
    flex: 1;
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
  }
  
  :global(.dark) .control-group .value {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .reset-btn {
    width: 100%;
    padding: 0.625rem;
    border: 1px solid var(--line-divider);
    background: var(--btn-card-bg-hover);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
  }
  
  :global(.dark) .reset-btn {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .reset-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .font-select {
    width: 100%;
    padding: 0.625rem;
    border: 1px solid var(--line-divider);
    background: var(--btn-card-bg-hover);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    color: inherit;
  }
  
  :global(.dark) .font-select {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .font-select:hover {
    border-color: var(--primary);
  }
  
  .font-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
  }
  
  .font-select option {
    background: var(--card-bg);
    color: inherit;
  }
  
  .divider {
    height: 1px;
    background: var(--line-divider);
    margin: 1rem 0;
    opacity: 0.5;
  }
  
  .accessibility-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .accessibility-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem;
    border: 1px solid var(--line-divider);
    background: var(--btn-card-bg-hover);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    text-align: left;
  }
  
  :global(.dark) .accessibility-btn {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .accessibility-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .accessibility-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .accessibility-btn svg {
    flex-shrink: 0;
  }
  
  /* 全局样式：无障碍模式 */
  :global(.markdown-content.accessibility-mode) {
    letter-spacing: 0.05em !important;
    word-spacing: 0.1em !important;
  }
  
  :global(.markdown-content.accessibility-mode p) {
    margin-bottom: 1.5em !important;
  }
  
  :global(.markdown-content.accessibility-mode h1),
  :global(.markdown-content.accessibility-mode h2),
  :global(.markdown-content.accessibility-mode h3) {
    margin-top: 2em !important;
    margin-bottom: 1em !important;
  }
  
  /* 高对比度模式 */
  :global(body.high-contrast-mode) {
    filter: contrast(1.2);
  }
  
  :global(body.high-contrast-mode .markdown-content) {
    color: #000 !important;
  }
  
  :global(.dark body.high-contrast-mode .markdown-content) {
    color: #fff !important;
  }
  
  /* 专注模式 */
  :global(.markdown-content.focus-mode p) {
    opacity: 0.4;
    transition: opacity 0.3s ease;
  }
  
  :global(.markdown-content.focus-mode p:hover) {
    opacity: 1;
  }
  
  :global(.markdown-content.focus-mode h1),
  :global(.markdown-content.focus-mode h2),
  :global(.markdown-content.focus-mode h3),
  :global(.markdown-content.focus-mode h4),
  :global(.markdown-content.focus-mode h5),
  :global(.markdown-content.focus-mode h6) {
    opacity: 1 !important;
  }
</style>
