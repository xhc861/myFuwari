<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  interface LotteryResponse {
    code: number;
    msg: string;
    data: {
      content: string;
      id: number;
      pic: string;
      poem: string;
      title: string;
    };
  }

  interface EnglishWordResponse {
    code: number;
    msg: string;
    data: {
      word: string;
      ukphone: string;
      usphone: string;
      ukspeech: string;
      usspeech: string;
      translations: Array<{
        pos: string;
        tran_cn: string;
      }>;
      sentences: Array<{
        s_content: string;
        s_cn: string;
      }>;
    };
  }

  let lottery: LotteryResponse['data'] | null = null;
  let lotteryLoading = false;
  let lotteryError = '';
  let showLotteryModal = false;

  let englishWord: EnglishWordResponse['data'] | null = null;
  let englishLoading = false;
  let englishError = '';
  let showEnglishModal = false;

  let audioPlaying = false;

  onMount(() => {
    // 确保组件在客户端加载
    if (typeof window === 'undefined') return;
  });

  async function drawLottery() {
    // 确保在客户端执行
    if (typeof window === 'undefined') return;
    
    lotteryLoading = true;
    lotteryError = '';
    lottery = null;

    try {
      const response = await fetch('https://v2.xxapi.cn/api/wenchangdijunrandom');
      const data: LotteryResponse = await response.json();
      
      if (data.code === 200 && data.data) {
        lottery = data.data;
        showLotteryModal = true;
      } else {
        lotteryError = data.msg || '抽签失败';
      }
    } catch (e) {
      lotteryError = '网络请求失败';
      console.error('Failed to draw lottery:', e);
    } finally {
      lotteryLoading = false;
    }
  }

  async function fetchEnglishWord() {
    // 确保在客户端执行
    if (typeof window === 'undefined') return;
    
    englishLoading = true;
    englishError = '';
    englishWord = null;

    try {
      const response = await fetch('https://v2.xxapi.cn/api/randomenglishwords');
      const data: EnglishWordResponse = await response.json();
      
      if (data.code === 200 && data.data) {
        englishWord = data.data;
        showEnglishModal = true;
      } else {
        englishError = data.msg || '获取单词失败';
      }
    } catch (e) {
      englishError = '网络请求失败';
      console.error('Failed to fetch English word:', e);
    } finally {
      englishLoading = false;
    }
  }

  function closeLotteryModal() {
    showLotteryModal = false;
  }

  function closeEnglishModal() {
    showEnglishModal = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (showLotteryModal) closeLotteryModal();
      if (showEnglishModal) closeEnglishModal();
    }
  }

  function playPronunciation(url: string, type: 'uk' | 'us') {
    // 确保在客户端执行
    if (typeof window === 'undefined') return;
    if (!url) return;
    if (audioPlaying) return;
    
    audioPlaying = true;
    const audio = new Audio(url);
    
    audio.onended = () => {
      audioPlaying = false;
    };
    
    audio.onerror = () => {
      audioPlaying = false;
      console.error(`Failed to play ${type} pronunciation`);
    };
    
    audio.play().catch(err => {
      audioPlaying = false;
      console.error('Audio play failed:', err);
    });
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="extra-features-container">
  <!-- 抽签 -->
  <div class="feature-card card-base">
    <h3 class="feature-title">文昌帝君灵签-抽个签吧</h3>
    <button 
      type="button"
      class="feature-btn" 
      on:click={drawLottery}
      disabled={lotteryLoading}
    >
      {lotteryLoading ? '抽签中...' : '抽一签'}
    </button>
    
    {#if lotteryError}
      <div class="error-message">{lotteryError}</div>
    {/if}
  </div>

  <!-- 每日英语 -->
  <div class="feature-card card-base">
    <h3 class="feature-title">每日英语-学个单词(词组)吧</h3>
    <button 
      type="button"
      class="feature-btn" 
      on:click={fetchEnglishWord}
      disabled={englishLoading}
    >
      {englishLoading ? '加载中...' : '学一个'}
    </button>
    
    {#if englishError}
      <div class="error-message">{englishError}</div>
    {/if}
  </div>
</div>

<!-- 抽签模态框 -->
{#if showLotteryModal && lottery}
  <div class="modal-portal">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-overlay" on:click={closeLotteryModal} transition:fade={{ duration: 200 }}>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div class="modal-content" on:click|stopPropagation role="dialog" aria-modal="true" aria-labelledby="lottery-modal-title" tabindex="0" transition:scale={{ duration: 200, start: 0.95 }}>
        <div class="modal-header">
          <h2 id="lottery-modal-title" class="modal-title">{lottery.title}</h2>
          <button type="button" class="close-button" on:click={closeLotteryModal} aria-label="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          {#if lottery.pic}
            <img src={lottery.pic} alt={lottery.title} class="lottery-image" />
          {/if}
          <div class="lottery-poem">{lottery.poem}</div>
          <div class="lottery-content">{lottery.content}</div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- 英语单词模态框 -->
{#if showEnglishModal && englishWord}
  <div class="modal-portal">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-overlay" on:click={closeEnglishModal} transition:fade={{ duration: 200 }}>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div class="modal-content" on:click|stopPropagation role="dialog" aria-modal="true" aria-labelledby="english-modal-title" tabindex="0" transition:scale={{ duration: 200, start: 0.95 }}>
        <div class="modal-header">
          <h2 id="english-modal-title" class="modal-title">{englishWord.word}</h2>
          <button type="button" class="close-button" on:click={closeEnglishModal} aria-label="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="english-phonetic-large">
            {#if englishWord.ukphone}
              <button 
                type="button" 
                class="phonetic-btn" 
                on:click={() => englishWord && playPronunciation(englishWord.ukspeech, 'uk')}
                disabled={audioPlaying}
              >
                <span class="phonetic-label">UK:</span>
                <span class="phonetic-text">/{englishWord.ukphone}/</span>
                <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            {/if}
            {#if englishWord.usphone}
              <button 
                type="button" 
                class="phonetic-btn" 
                on:click={() => englishWord && playPronunciation(englishWord.usspeech, 'us')}
                disabled={audioPlaying}
              >
                <span class="phonetic-label">US:</span>
                <span class="phonetic-text">/{englishWord.usphone}/</span>
                <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            {/if}
          </div>
          
          {#if englishWord.translations && englishWord.translations.length > 0}
            <div class="translations-section">
              <h4>释义</h4>
              {#each englishWord.translations as trans}
                <div class="translation-item">
                  <span class="pos">{trans.pos}.</span>
                  <span class="tran">{trans.tran_cn}</span>
                </div>
              {/each}
            </div>
          {/if}
          
          {#if englishWord.sentences && englishWord.sentences.length > 0}
            <div class="sentences-section">
              <h4>例句</h4>
              {#each englishWord.sentences as sentence}
                <div class="sentence-item">
                  <div class="sentence-en">{sentence.s_content}</div>
                  <div class="sentence-cn">{sentence.s_cn}</div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .extra-features-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
    border-radius: var(--radius-large);
  }

  .feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 1rem;
  }

  :global(.dark) .feature-title {
    color: oklch(0.75 0.14 var(--hue));
  }

  .feature-btn {
    width: 100%;
    padding: 0.625rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .feature-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .feature-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .feature-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    margin-top: 0.75rem;
    padding: 0.5rem;
    background: rgba(239, 68, 68, 0.1);
    color: rgb(239, 68, 68);
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  /* 模态框样式 */
  .modal-portal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 1rem;
    padding-bottom: 2rem;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .modal-content {
    background: var(--card-bg);
    border-radius: var(--radius-large);
    max-width: 700px;
    width: 100%;
    max-height: 79vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--line-divider);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--line-divider);
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
    margin: 0;
  }

  :global(.dark) .modal-title {
    color: oklch(0.75 0.14 var(--hue));
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    transition: background 0.2s;
  }

  :global(.dark) .close-button {
    color: rgba(255, 255, 255, 0.9);
  }

  .close-button:hover {
    background: var(--btn-card-bg-hover);
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  /* 抽签结果样式 */
  .lottery-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    margin: 0 auto 1.5rem;
    display: block;
    border-radius: 0.5rem;
  }

  .lottery-poem {
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--btn-card-bg-hover);
    border-radius: 0.5rem;
    font-style: italic;
  }

  .lottery-content {
    font-size: 0.9375rem;
    line-height: 1.8;
  }

  :global(.dark) .lottery-content {
    color: rgba(255, 255, 255, 0.9);
  }

  .lottery-poem {
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--btn-card-bg-hover);
    border-radius: 0.5rem;
    font-style: italic;
  }

  :global(.dark) .lottery-poem {
    color: rgba(255, 255, 255, 0.9);
  }

  /* 英语单词样式 */
  .english-phonetic-large {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .phonetic-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: var(--btn-card-bg-hover);
    border: 1px solid var(--line-divider);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  :global(.dark) .phonetic-btn {
    color: rgba(255, 255, 255, 0.9);
  }

  .phonetic-btn:hover:not(:disabled) {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .phonetic-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .phonetic-label {
    font-weight: 600;
    font-size: 0.875rem;
  }

  :global(.dark) .phonetic-label {
    color: rgba(255, 255, 255, 0.9);
  }

  .phonetic-text {
    font-size: 0.9375rem;
  }

  :global(.dark) .phonetic-text {
    color: rgba(255, 255, 255, 0.9);
  }

  .play-icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  .phonetic-btn:hover:not(:disabled) .play-icon {
    opacity: 1;
  }

  .translations-section,
  .sentences-section {
    margin-bottom: 1.5rem;
  }

  .translations-section h4,
  .sentences-section h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.75rem;
  }

  :global(.dark) .translations-section h4,
  :global(.dark) .sentences-section h4 {
    color: oklch(0.75 0.14 var(--hue));
  }

  .translation-item {
    padding: 0.5rem 0;
    font-size: 0.9375rem;
  }

  :global(.dark) .translation-item {
    color: rgba(255, 255, 255, 0.9);
  }

  .pos {
    color: var(--primary);
    font-weight: 600;
    margin-right: 0.5rem;
  }

  :global(.dark) .pos {
    color: oklch(0.75 0.14 var(--hue));
  }

  .tran {
    color: inherit;
  }

  :global(.dark) .tran {
    color: rgba(255, 255, 255, 0.9);
  }

  .sentence-item {
    padding: 1rem;
    background: var(--btn-card-bg-hover);
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .sentence-en {
    font-size: 0.9375rem;
    line-height: 1.7;
    margin-bottom: 0.5rem;
    font-style: italic;
  }

  .sentence-cn {
    font-size: 0.875rem;
    line-height: 1.7;
    opacity: 0.8;
  }

  :global(.dark) .sentence-cn {
    color: rgba(255, 255, 255, 0.8);
  }

  .sentence-en {
    font-size: 0.9375rem;
    line-height: 1.7;
    margin-bottom: 0.5rem;
    font-style: italic;
  }

  :global(.dark) .sentence-en {
    color: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 768px) {
    .extra-features-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .feature-card {
      padding: 1rem;
    }

    .feature-title {
      font-size: 1.125rem;
    }

    .modal-content {
      max-height: 90vh;
    }

    .modal-header {
      padding: 1rem;
    }

    .modal-title {
      font-size: 1.25rem;
    }

    .modal-body {
      padding: 1rem;
    }
  }
</style>
