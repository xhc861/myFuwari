<script lang="ts">
  import { onMount } from 'svelte';

  interface CalendarData {
    date: string;
    weekday: string;
    lunar: string;
    jieqi: string;
    luckyConstellation: string;
    festival: string;
  }

  let calendarData: CalendarData | null = null;
  let loading = true;

  function fetchCalendarData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const url = `https://rili.com.cn/rili/json/today/${year}/${month}${day}.js`;
    
    // 定义全局回调函数
    (window as any).jsonrun_Today = (data: any) => {
      try {
        // 提取节日信息
        let festivalName = '';
        if (data.jieri && Array.isArray(data.jieri) && data.jieri.length > 0) {
          festivalName = data.jieri[0].name || '';
        }

        calendarData = {
          date: data.yangli?.date || `${year}年${month}月${day}日`,
          weekday: data.yangli?.xingqi || '',
          lunar: data.nongli?.yueri || '',
          jieqi: data.jieqi?.jieqi || '',
          luckyConstellation: data.xingzuo?.xingzuo ? `${data.xingzuo.xingzuo}座` : '',
          festival: festivalName
        };
      } catch (error) {
        console.error('解析日历数据失败:', error);
        useFallbackData();
      } finally {
        loading = false;
      }
    };
    
    // 创建 script 标签加载 JSONP
    const script = document.createElement('script');
    script.src = url;
    
    script.onerror = () => {
      console.error('加载日历数据失败');
      useFallbackData();
    };
    
    document.head.appendChild(script);
    
    // 设置超时保护
    setTimeout(() => {
      if (loading) {
        console.warn('日历数据加载超时');
        useFallbackData();
      }
    }, 5000);
  }

  function useFallbackData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    
    calendarData = {
      date: `${year}年${month}月${day}日`,
      weekday: weekdays[now.getDay()],
      lunar: '农历数据加载失败',
      jieqi: '',
      luckyConstellation: '',
      festival: ''
    };
    loading = false;
  }

  onMount(() => {
    // 确保在客户端执行
    if (typeof window !== 'undefined') {
      fetchCalendarData();
    }
  });
</script>

<div class="calendar-module card-base">
  {#if loading}
    <div class="loading">加载中...</div>
  {:else if calendarData}
    <div class="calendar-content">
      <div class="date-section">
        <div class="gregorian-date">
          {calendarData.date}
          <span class="weekday">{calendarData.weekday}</span>
        </div>
        <div class="lunar-date">{calendarData.lunar}</div>
      </div>
      <div class="info-section">
        {#if calendarData.festival}
          <div class="info-item">
            <span class="label">节日</span>
            <span class="value festival">{calendarData.festival}</span>
          </div>
        {/if}
        {#if calendarData.jieqi}
          <div class="info-item">
            <span class="label">节气</span>
            <span class="value">{calendarData.jieqi}</span>
          </div>
        {/if}
        <div class="info-item">
          <span class="label">所属星座</span>
          <span class="value">{calendarData.luckyConstellation}</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .calendar-module {
    padding: 1.5rem;
    border-radius: var(--radius-large);
  }

  .loading {
    text-align: center;
    opacity: 0.7;
  }

  :global(.dark) .loading {
    color: rgba(255, 255, 255, 0.9);
  }

  .calendar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  .date-section {
    flex: 1;
  }

  .gregorian-date {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .weekday {
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.8;
  }

  .lunar-date {
    font-size: 1rem;
    opacity: 0.7;
  }

  :global(.dark) .lunar-date {
    color: rgba(255, 255, 255, 0.9);
  }

  .info-section {
    display: flex;
    gap: 2rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.75rem;
    opacity: 0.6;
  }

  :global(.dark) .label {
    color: rgba(255, 255, 255, 0.8);
  }

  .value {
    font-size: 1rem;
    font-weight: 500;
  }

  :global(.dark) .value {
    color: rgba(255, 255, 255, 0.9);
  }

  .festival {
    color: oklch(0.7 0.14 150);
  }

  @media (max-width: 768px) {
    .calendar-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .gregorian-date {
      font-size: 1.5rem;
      flex-wrap: wrap;
    }

    .info-section {
      width: 100%;
      justify-content: space-between;
      gap: 1rem;
    }
  }
</style>
