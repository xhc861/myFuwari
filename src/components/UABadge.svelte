<script lang="ts">
  import { onMount } from 'svelte';

  interface UAData {
    address: string;
    browser: string;
    browserVersion: string;
    deviceType: string;
    ip: string;
    os: string;
  }

  let uaData: UAData | null = null;
  let loading = true;
  let error = false;

  onMount(async () => {
    // 确保在客户端执行
    if (typeof window === 'undefined') {
      loading = false;
      return;
    }
    
    try {
      const response = await fetch('https://v2.xxapi.cn/api/ua');
      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        uaData = result.data;
      } else {
        error = true;
      }
    } catch (e) {
      console.warn('UA API 获取失败:', e);
      error = true;
    } finally {
      loading = false;
    }
  });
</script>

{#if !loading && !error && uaData}
  <div class="ua-badge-container">
    <div class="ua-badge">
      <div class="ua-info-grid">
        <div class="ua-info-item">
          <span class="ua-label">浏览器</span>
          <span class="ua-value">{uaData.browser} {uaData.browserVersion}</span>
        </div>
        <div class="ua-info-item">
          <span class="ua-label">操作系统</span>
          <span class="ua-value">{uaData.os}</span>
        </div>
        <div class="ua-info-item">
          <span class="ua-label">设备类型</span>
          <span class="ua-value">{uaData.deviceType}</span>
        </div>
        <div class="ua-info-item">
          <span class="ua-label">IP地址</span>
          <span class="ua-value">{uaData.ip}</span>
        </div>
        <div class="ua-info-item">
          <span class="ua-label">归属地</span>
          <span class="ua-value">{uaData.address}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .ua-badge-container {
    display: inline-block;
    margin: 0.5rem 0;
    width: 100%;
    max-width: 800px;
  }

  .ua-badge {
    width: 100%;
    padding: 1rem 1.5rem;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }

  :global(.dark) .ua-badge {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .ua-badge:hover {
    background: rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.15);
  }

  :global(.dark) .ua-badge:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .ua-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
  }

  .ua-info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .ua-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  :global(.dark) .ua-label {
    color: rgba(255, 255, 255, 0.5);
  }

  .ua-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
  }

  :global(.dark) .ua-value {
    color: rgba(255, 255, 255, 0.8);
  }

  /* 移动端适配 */
  @media (max-width: 640px) {
    .ua-badge {
      padding: 0.875rem 1rem;
    }

    .ua-info-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .ua-label {
      font-size: 0.7rem;
    }

    .ua-value {
      font-size: 0.8rem;
    }
  }
</style>
