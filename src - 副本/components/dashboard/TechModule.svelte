<script lang="ts">
// TODO: 未来将从 GitHub API 获取数据
// API 集成点: fetchTrendingRepos()

interface Repository {
	id: string;
	name: string;
	description: string;
	stars: number;
	language: string;
}

// 模拟数据
const mockRepos: Repository[] = [
	{
		id: "1",
		name: "awesome-ai",
		description: "精选的人工智能资源和工具集合",
		stars: 45200,
		language: "Python",
	},
	{
		id: "2",
		name: "react-next-gen",
		description: "下一代 React 开发框架",
		stars: 32100,
		language: "TypeScript",
	},
	{
		id: "3",
		name: "rust-performance",
		description: "高性能 Rust 应用开发指南",
		stars: 28900,
		language: "Rust",
	},
	{
		id: "4",
		name: "devops-toolkit",
		description: "现代化 DevOps 工具链",
		stars: 19500,
		language: "Go",
	},
];
</script>

<div class="tech-module card-base">
  <h3 class="module-title">🚀 高科技展示</h3>
  <div class="repo-list">
    {#each mockRepos as repo (repo.id)}
      <div class="repo-item">
        <div class="repo-header">
          <div class="repo-name">{repo.name}</div>
          <div class="repo-stars">
            ⭐ {repo.stars.toLocaleString()}
          </div>
        </div>
        <div class="repo-description">{repo.description}</div>
        <div class="repo-language">
          <span class="language-dot"></span>
          {repo.language}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .tech-module {
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

  .repo-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .repo-item {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 0.5rem;
    border: 1px solid var(--line-divider);
    transition: all 0.3s ease;
  }

  .repo-item:hover {
    transform: translateX(4px);
    border-color: var(--primary);
    background: var(--btn-card-bg-hover);
  }

  .repo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .repo-name {
    font-weight: 600;
    font-size: 1.125rem;
    color: var(--primary);
  }

  .repo-stars {
    font-size: 0.875rem;
    font-weight: 500;
    color: oklch(0.7 0.14 60);
  }

  .repo-description {
    font-size: 0.875rem;
    opacity: 0.7;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .repo-language {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    opacity: 0.6;
  }

  .language-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary);
  }
</style>
