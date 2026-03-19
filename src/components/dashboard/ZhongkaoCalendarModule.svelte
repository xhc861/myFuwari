<script lang="ts">
import { onMount } from "svelte";

const ZHONGKAO_DATE = new Date("2026-06-22"); 

let daysLeft = 0;
let hoursLeft = 0;
let minutesLeft = 0;
let secondsLeft = 0;

function calculateTimeLeft() {
  const now = new Date();
  const diff = ZHONGKAO_DATE.getTime() - now.getTime();

  if (diff > 0) {
    daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
  } else {
    daysLeft = 0;
    hoursLeft = 0;
    minutesLeft = 0;
    secondsLeft = 0;
  }
}

onMount(() => {
  calculateTimeLeft();
  const interval = setInterval(calculateTimeLeft, 1000);
  return () => clearInterval(interval);
});
</script>

<div class="zhongkao-calendar card-base">
  <div class="header">
    <h3 class="title">中考倒计时</h3>
    <div class="exam-date">
      {ZHONGKAO_DATE.getFullYear()}年{ZHONGKAO_DATE.getMonth() + 1}月{ZHONGKAO_DATE.getDate()}日
    </div>
  </div>

  <div class="countdown-display">
    <div class="time-block">
      <div class="time-value">{daysLeft}</div>
      <div class="time-label">天</div>
    </div>
    <div class="separator">:</div>
    <div class="time-block">
      <div class="time-value">{String(hoursLeft).padStart(2, '0')}</div>
      <div class="time-label">时</div>
    </div>
    <div class="separator">:</div>
    <div class="time-block">
      <div class="time-value">{String(minutesLeft).padStart(2, '0')}</div>
      <div class="time-label">分</div>
    </div>
    <div class="separator">:</div>
    <div class="time-block">
      <div class="time-value">{String(secondsLeft).padStart(2, '0')}</div>
      <div class="time-label">秒</div>
    </div>
  </div>
</div>

<style>
  .zhongkao-calendar {
    padding: 1rem 1.5rem;
    border-radius: var(--radius-large);
    background: linear-gradient(135deg, var(--card-bg) 0%, var(--card-bg) 100%);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--primary);
    margin: 0;
  }

  :global(.dark) .title {
    color: oklch(0.75 0.14 var(--hue));
  }

  .exam-date {
    font-size: 0.875rem;
    opacity: 0.7;
    font-weight: 500;
  }

  :global(.dark) .exam-date {
    color: rgba(255, 255, 255, 0.8);
    opacity: 1;
  }

  .countdown-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .time-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: var(--card-bg);
    border-radius: 0.5rem;
    min-width: 65px;
  }

  .time-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary);
    line-height: 1;
  }

  :global(.dark) .time-value {
    color: oklch(0.75 0.14 var(--hue));
  }

  .time-label {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: 0.25rem;
  }

  :global(.dark) .time-label {
    color: rgba(255, 255, 255, 0.8);
    opacity: 1;
  }

  .separator {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary);
    opacity: 0.5;
  }

  :global(.dark) .separator {
    color: oklch(0.75 0.14 var(--hue));
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .countdown-display {
      gap: 0.25rem;
    }

    .time-block {
      padding: 0.5rem 0.75rem;
      min-width: 60px;
    }

    .time-value {
      font-size: 1.5rem;
    }

    .separator {
      font-size: 1.25rem;
    }
  }
</style>
