<script lang="ts">
  // TODO: 未来将从 API 获取数据
  // API 集成点: fetchLatestNews()
  
  interface NewsItem {
    id: string;
    title: string;
    summary: string;
    time: string;
  }

  // 模拟数据 - 使用 HTML 标记高亮文字
  const mockNews: NewsItem[] = [
    { id: '1', title: 'AI 技术新突破', summary: '最新研究显示<mark>人工智能</mark>在图像识别领域取得<mark>重大进展</mark>', time: '2小时前' },
    { id: '2', title: '开源项目更新', summary: '热门框架发布<mark>新版本</mark>，带来性能优化和新特性', time: '5小时前' },
    { id: '3', title: '技术大会预告', summary: '年度<mark>开发者大会</mark>即将召开，众多技术大咖将分享经验', time: '1天前' },
    { id: '4', title: '安全漏洞修复', summary: '<mark>重要安全更新</mark>发布，建议所有用户尽快升级', time: '2天前' },
    { id: '5', title: '行业趋势分析', summary: '2026年<mark>技术发展趋势</mark>报告出炉', time: '3天前' }
  ];
</script>

<div class="news-module card-base">
  <h3 class="module-title">最近新闻</h3>
  <div class="news-list">
    {#each mockNews as news (news.id)}
      <div class="news-item">
        <div class="news-header">
          <div class="news-title">{news.title}</div>
          <div class="news-time">{news.time}</div>
        </div>
        <div class="news-summary">{@html news.summary}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .news-module {
    padding: 1.5rem;
    border-radius: var(--radius-large);
    height: 100%;
  }

  .module-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary);
  }

  .news-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .news-item {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 0.5rem;
    border: 1px solid var(--line-divider);
    transition: transform 0.2s, background 0.2s;
  }

  .news-item:hover {
    transform: translateY(-2px);
    background: var(--btn-card-bg-hover);
  }

  .news-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .news-title {
    font-weight: 500;
    flex: 1;
  }

  .news-time {
    font-size: 0.75rem;
    opacity: 0.6;
    white-space: nowrap;
    margin-left: 1rem;
  }

  .news-summary {
    font-size: 0.875rem;
    opacity: 0.7;
    line-height: 1.5;
  }

  .news-summary :global(mark) {
    background: var(--primary);
    color: white;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-weight: 500;
  }
</style>
