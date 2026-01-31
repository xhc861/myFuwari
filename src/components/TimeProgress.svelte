<script lang="ts">
  import { onMount } from 'svelte';

  interface TimeProgress {
    label: string;
    value: string;
    percentage: number;
    color: string;
  }

  let progressData: TimeProgress[] = [];

  function calculateProgress() {
    const now = new Date();
    
    // 今日已经过去
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayElapsed = now.getTime() - dayStart.getTime();
    const dayTotal = 24 * 60 * 60 * 1000;
    const dayPercentage = Math.min((dayElapsed / dayTotal) * 100, 100);
    const hoursElapsed = Math.floor(dayElapsed / (60 * 60 * 1000));
    
    // 这周已经过去
    const weekDay = now.getDay() === 0 ? 7 : now.getDay(); // 周日为7
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - weekDay + 1);
    const weekElapsed = now.getTime() - weekStart.getTime();
    const weekTotal = 7 * 24 * 60 * 60 * 1000;
    const weekPercentage = Math.min((weekElapsed / weekTotal) * 100, 100);
    const daysElapsed = Math.floor(weekElapsed / (24 * 60 * 60 * 1000));
    
    // 本月已经过去
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0); // 确保从月初 00:00:00 开始
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999); // 确保到月末 23:59:59 结束
    const monthElapsed = now.getTime() - monthStart.getTime();
    const monthTotal = monthEnd.getTime() - monthStart.getTime();
    const monthPercentage = Math.min((monthElapsed / monthTotal) * 100, 100); // 确保不超过100%
    const monthDaysElapsed = now.getDate(); // 显示当前日期
    
    // 今年已经过去
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearElapsed = now.getTime() - yearStart.getTime();
    const yearTotal = new Date(now.getFullYear() + 1, 0, 1).getTime() - yearStart.getTime();
    const yearPercentage = Math.min((yearElapsed / yearTotal) * 100, 100);
    const monthsElapsed = now.getMonth() + 1;
    
    progressData = [
      {
        label: '今日已经过去',
        value: `${hoursElapsed} 小时`,
        percentage: dayPercentage,
        color: 'var(--primary)'
      },
      {
        label: '这周已经过去',
        value: `${daysElapsed} 天`,
        percentage: weekPercentage,
        color: 'var(--primary)'
      },
      {
        label: '本月已经过去',
        value: `${monthDaysElapsed} 天`,
        percentage: monthPercentage,
        color: 'var(--primary)'
      },
      {
        label: '今年已经过去',
        value: `${monthsElapsed} 个月`,
        percentage: yearPercentage,
        color: 'var(--primary)'
      }
    ];
  }

  onMount(() => {
    calculateProgress();
    // 每分钟更新一次
    const interval = setInterval(calculateProgress, 60000);
    return () => clearInterval(interval);
  });
</script>

<div class="time-progress-container card-base">
  {#each progressData as item, index}
    <div class="progress-item" style="animation-delay: {index * 100}ms;">
      <div class="progress-header">
        <span class="progress-label">{item.label} <span class="progress-value">{item.value}</span></span>
        <span class="progress-percentage">{Math.round(item.percentage)}%</span>
      </div>
      <div class="progress-bar-container">
        <div 
          class="progress-bar" 
          style="width: {item.percentage}%; background: {item.color}; animation-delay: {index * 100}ms;"
        ></div>
      </div>
    </div>
  {/each}
</div>

<style>
  .time-progress-container {
    padding: 1rem;
    border-radius: var(--radius-large);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .progress-item {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    opacity: 0;
    animation: fadeInScale 0.5s ease forwards;
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
  }

  .progress-label {
    font-size: 0.875rem;
    color: oklch(0.7 0 0);
  }

  :global(.dark) .progress-label {
    color: oklch(0.8 0 0);
  }

  .progress-value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary);
    margin-left: 0.375rem;
  }

  .progress-percentage {
    font-size: 1.125rem;
    font-weight: 700;
    color: oklch(0.65 0 0);
  }

  :global(.dark) .progress-percentage {
    color: oklch(0.75 0 0);
  }

  .progress-bar-container {
    width: 100%;
    height: 1rem;
    background: var(--btn-card-bg-hover);
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
  }

  .progress-bar {
    height: 100%;
    border-radius: 0.5rem;
    transition: width 1s cubic-bezier(0.65, 0, 0.35, 1);
    position: relative;
    animation: progressPulse 3s ease-in-out infinite;
  }

  @keyframes progressPulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }

  @media (max-width: 768px) {
    .time-progress-container {
      padding: 0.875rem;
      gap: 0.875rem;
    }

    .progress-label {
      font-size: 0.8125rem;
    }

    .progress-value {
      font-size: 0.9375rem;
    }

    .progress-percentage {
      font-size: 1rem;
    }

    .progress-bar-container {
      height: 0.875rem;
    }
  }
</style>
