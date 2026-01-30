<script lang="ts">

  interface SubjectScore {
    id: string;
    subject: string;
    score: number | null;
    fullScore: number;
    schoolRank: number | null;
    districtRank: number | null;
    cityRank: number | null;
  }

  const mockScores: SubjectScore[] = [
    { id: '1', subject: '语文', score: null, fullScore: 150, schoolRank: null, districtRank: null, cityRank: null },
    { id: '2', subject: '数学', score: null, fullScore: 150, schoolRank: null, districtRank: null, cityRank: null },
    { id: '3', subject: '英语', score: null, fullScore: 120, schoolRank: null, districtRank: null, cityRank: null },
    { id: '4', subject: '物理', score: null, fullScore: 90, schoolRank: null, districtRank: null, cityRank: null },
    { id: '5', subject: '化学', score: null, fullScore: 60, schoolRank: null, districtRank: null, cityRank: null },
    { id: '6', subject: '政治', score: null, fullScore: 70, schoolRank: null, districtRank: null, cityRank: null },
    { id: '7', subject: '历史', score: null, fullScore: 60, schoolRank: null, districtRank: null, cityRank: null }
  ];

  // 计算总分
  const totalScore = mockScores.reduce((sum, item) => sum + (item.score || 0), 0);
  const totalFullScore = mockScores.reduce((sum, item) => sum + item.fullScore, 0);
  const hasScores = mockScores.some(item => item.score !== null);

  // 总排名
  const overallRanks = {
    school: 18,
    district: 125,
    city: 678
  };
</script>

<div class="scoreboard-module card-base">
  <h3 class="module-title">贵阳市2026届九年级期末考试</h3>
  
  <!-- 总分区域 -->
  <div class="total-score-section">
    <div class="total-score-card">
      <div class="total-label">总分</div>
      <div class="total-value">
        {#if hasScores}
          <span class="score">{totalScore}</span>
          <span class="divider">/</span>
          <span class="full-score">{totalFullScore}</span>
        {:else}
          <span class="unpublished-text">未公布</span>
        {/if}
      </div>
    </div>
    
    <!-- 总排名 -->
    {#if hasScores}
      <div class="overall-ranks">
        <div class="rank-badge">
          <span class="rank-label">校</span>
          <span class="rank-num">{overallRanks.school || '-'}</span>
        </div>
        <div class="rank-badge">
          <span class="rank-label">区</span>
          <span class="rank-num">{overallRanks.district || '-'}</span>
        </div>
        <div class="rank-badge">
          <span class="rank-label">市</span>
          <span class="rank-num">{overallRanks.city || '-'}</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- 科目分数表格 -->
  <div class="score-table">
    <div class="table-header">
      <div class="col-subject">科目</div>
      <div class="col-score">分数</div>
      <div class="col-rank">校排名</div>
      <div class="col-rank">区排名</div>
      <div class="col-rank">市排名</div>
    </div>
    
    <div class="table-body">
      {#each mockScores as item (item.id)}
        <div class="table-row" class:has-score={item.score !== null}>
          <div class="col-subject">
            <span class="subject-name">{item.subject}</span>
          </div>
          <div class="col-score">
            {#if item.score !== null}
              <span class="score-value">{item.score}</span>
              <span class="score-divider">/</span>
              <span class="full-score-value">{item.fullScore}</span>
            {:else}
              <span class="unpublished">-</span>
            {/if}
          </div>
          <div class="col-rank">
            <span class="rank-value">{item.schoolRank || '-'}</span>
          </div>
          <div class="col-rank">
            <span class="rank-value">{item.districtRank || '-'}</span>
          </div>
          <div class="col-rank">
            <span class="rank-value">{item.cityRank || '-'}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .scoreboard-module {
    padding: 1.5rem;
    border-radius: var(--radius-large);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .module-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--primary);
  }

  :global(.dark) .module-title {
    color: oklch(0.75 0.14 var(--hue));
  }

  /* 总分区域 */
  .total-score-section {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .total-score-card {
    flex: 1;
    min-width: 150px;
    padding: 1rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark, var(--primary)) 100%);
    border-radius: 0.75rem;
    color: white;
    text-align: center;
  }

  .total-label {
    font-size: 0.75rem;
    opacity: 0.9;
    margin-bottom: 0.25rem;
  }

  .total-value {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .total-value .score {
    color: white;
  }

  .total-value .divider {
    margin: 0 0.25rem;
    opacity: 0.7;
  }

  .total-value .full-score {
    font-size: 1.125rem;
    opacity: 0.8;
  }

  .unpublished-text {
    font-size: 1.25rem;
  }

  .overall-ranks {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .rank-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: var(--card-bg);
    border-radius: 0.5rem;
    min-width: 60px;
  }

  .rank-label {
    font-size: 0.7rem;
    opacity: 0.7;
    margin-bottom: 0.125rem;
  }

  :global(.dark) .rank-label {
    color: rgba(255, 255, 255, 0.8);
  }

  .rank-num {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--primary);
  }

  /* 表格样式 */
  .score-table {
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid var(--line-divider);
    flex: 1;
    overflow-y: auto;
  }

  .table-header {
    display: grid;
    grid-template-columns: 1.2fr 1.2fr 0.9fr 0.9fr 0.9fr;
    background: var(--card-bg);
    font-weight: 600;
    font-size: 0.8rem;
    border-bottom: 2px solid var(--line-divider);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .table-header > div {
    padding: 0.625rem 0.5rem;
    text-align: center;
  }

  :global(.dark) .table-header > div {
    color: rgba(255, 255, 255, 0.9);
  }

  .col-subject {
    text-align: left !important;
    padding-left: 0.75rem !important;
  }

  .table-body {
    background: var(--card-bg);
  }

  .table-row {
    display: grid;
    grid-template-columns: 1.2fr 1.2fr 0.9fr 0.9fr 0.9fr;
    border-bottom: 1px solid var(--line-divider);
    transition: background 0.2s;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-row:hover {
    background: var(--btn-card-bg-hover);
  }

  .table-row > div {
    padding: 0.625rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  }

  .subject-name {
    font-weight: 500;
  }

  :global(.dark) .subject-name {
    color: rgba(255, 255, 255, 0.9);
  }

  .col-score {
    font-size: 0.875rem;
  }

  .score-value {
    font-weight: 600;
    color: var(--primary);
  }

  .score-divider {
    margin: 0 0.2rem;
    opacity: 0.5;
  }

  .full-score-value {
    opacity: 0.6;
    font-size: 0.8rem;
  }

  .unpublished {
    opacity: 0.4;
  }

  .rank-value {
    font-weight: 500;
    font-size: 0.875rem;
  }

  :global(.dark) .rank-value {
    color: rgba(255, 255, 255, 0.8);
  }

  .table-row.has-score .rank-value {
    color: var(--primary);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .table-header,
    .table-row {
      grid-template-columns: 1.2fr 1.2fr 0.8fr 0.8fr 0.8fr;
      font-size: 0.875rem;
    }

    .table-header > div,
    .table-row > div {
      padding: 0.5rem 0.25rem;
    }

    .col-subject {
      padding-left: 0.5rem !important;
    }

    .total-value {
      font-size: 1.5rem;
    }

    .rank-badge {
      min-width: 60px;
      padding: 0.5rem 0.75rem;
    }

    .rank-num {
      font-size: 1.25rem;
    }
  }
</style>
