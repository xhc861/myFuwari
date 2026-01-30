<script lang="ts">
  import CalendarModule from './CalendarModule.svelte';
  import CountdownModule from './CountdownModule.svelte';
  import MicroNewsModule from './MicroNewsModule.svelte';
  import TodoModule from './TodoModule.svelte';
  import ScoreboardModule from './ScoreboardModule.svelte';
  import ExtraFeaturesModule from './ExtraFeaturesModule.svelte';
  import UABadge from '../UABadge.svelte';
</script>

<div class="dashboard-container">
  <!-- 日历模块 - 顶部 -->
  <div class="calendar-section">
    <CalendarModule />
  </div>

  <!-- 倒计时模块 -->
  <div class="countdown-section">
    <CountdownModule />
  </div>

  <!-- 微新闻 - 单独一行 -->
  <div class="micro-news-section">
    <MicroNewsModule />
  </div>

  <!-- 待办事项和分数榜单 - 同一行 -->
  <div class="two-column-grid">
    <TodoModule />
    <ScoreboardModule />
  </div>

  <!-- 抽签和每日英语 - 单独一行 -->
  <div class="extra-features-section">
    <ExtraFeaturesModule />
  </div>

  <!-- UA 信息 - 底部 -->
  <div class="ua-section">
    <UABadge />
  </div>
</div>

<style>
  .dashboard-container {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .calendar-section,
  .countdown-section,
  .micro-news-section,
  .extra-features-section,
  .ua-section {
    width: 100%;
  }

  .two-column-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .two-column-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1280px) {
    .dashboard-container {
      gap: 2rem;
    }
    
    .two-column-grid {
      gap: 2rem;
    }
  }
</style>
