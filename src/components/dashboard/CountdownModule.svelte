<script lang="ts">
  import { onMount } from 'svelte';

  interface Countdown {
    id: string;
    name: string;
    targetDate: string;
  }

  let countdowns: Countdown[] = [];
  let remainingDays: { [key: string]: number } = {};

  // 从 JSON 文件动态加载倒计时数据
  async function loadCountdowns() {
    console.log('[CountdownModule] 开始加载倒计时数据...');
    try {
      const response = await fetch('/countdowns.json');
      console.log('[CountdownModule] fetch 响应:', response.status);
      const data = await response.json();
      console.log('[CountdownModule] 加载的数据:', data);
      countdowns = data;
      calculateRemainingDays();
      console.log('[CountdownModule] 倒计时数据加载成功，共', countdowns.length, '项');
    } catch (error) {
      console.error('[CountdownModule] 加载失败:', error);
      countdowns = [];
    }
  }

  // 计算剩余天数
  function calculateRemainingDays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    countdowns.forEach(countdown => {
      const target = new Date(countdown.targetDate);
      target.setHours(0, 0, 0, 0);
      const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      remainingDays[countdown.id] = diff;
    });
  }

  function formatDays(days: number): string {
    if (days > 0) {
      return `还有 ${days} 天`;
    } else if (days === 0) {
      return '今天';
    } else {
      return `已过 ${Math.abs(days)} 天`;
    }
  }

  onMount(() => {
    console.log('[CountdownModule] onMount 被调用');
    // 确保在客户端执行
    if (typeof window !== 'undefined') {
      console.log('[CountdownModule] 在客户端环境，开始加载数据');
      loadCountdowns();
      
      // 每天午夜更新一次
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        calculateRemainingDays();
        // 之后每24小时更新一次
        setInterval(calculateRemainingDays, 24 * 60 * 60 * 1000);
      }, msUntilMidnight);
    } else {
      console.log('[CountdownModule] 不在客户端环境');
    }
  });
</script>

<div class="countdown-module">
  <div class="countdown-list">
    {#each countdowns as countdown (countdown.id)}
      <div class="countdown-item">
        <div class="countdown-name">{countdown.name}</div>
        <div class="countdown-days" class:past={remainingDays[countdown.id] < 0} class:today={remainingDays[countdown.id] === 0}>
          {formatDays(remainingDays[countdown.id])}
        </div>
        <div class="countdown-date">{countdown.targetDate}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .countdown-module {
    padding: 0;
  }

  .countdown-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
  }

  .countdown-item {
    width: 140px;
    height: 140px;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 1rem;
    border: 1px solid var(--line-divider);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .countdown-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .countdown-name {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.3;
  }

  :global(.dark) .countdown-name {
    color: rgba(255, 255, 255, 0.9);
  }

  .countdown-date {
    font-size: 0.7rem;
    opacity: 0.6;
  }

  :global(.dark) .countdown-date {
    color: rgba(255, 255, 255, 0.7);
  }

  .countdown-days {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary);
  }

  :global(.dark) .countdown-days {
    color: oklch(0.75 0.14 var(--hue));
  }

  .countdown-days.today {
    color: oklch(0.7 0.14 150);
  }

  :global(.dark) .countdown-days.today {
    color: oklch(0.75 0.14 150);
  }

  .countdown-days.past {
    color: oklch(0.65 0.2 25);
  }

  :global(.dark) .countdown-days.past {
    color: oklch(0.75 0.2 25);
  }
</style>
