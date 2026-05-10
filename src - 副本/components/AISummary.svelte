<script lang="ts">
import MarkdownIt from "markdown-it";

export let content: string;
export let title: string;

let summary = "";
let loading = false;
let streaming = false;
let error = "";
let expanded = false;

// 配置 markdown-it
const md = new MarkdownIt({
	html: false,
	breaks: true,
	linkify: true,
});

$: renderedSummary = summary ? md.render(summary) : "";

async function generateSummary() {
	if (summary && !error && !streaming) {
		expanded = !expanded;
		return;
	}

	loading = true;
	streaming = true;
	error = "";
	summary = "";
	expanded = true;

	let timeoutId: number | undefined;
	let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

	try {
		// 设置超时（60秒）
		const timeoutPromise = new Promise((_, reject) => {
			timeoutId = window.setTimeout(() => {
				reject(new Error("请求超时，请稍后重试"));
			}, 60000);
		});

		// 调用服务端 API（注意添加尾部斜杠以匹配 trailingSlash 配置）
		const fetchPromise = fetch("/api/ai-summary/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content,
				title,
			}),
		});

		const response = (await Promise.race([
			fetchPromise,
			timeoutPromise,
		])) as Response;

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || `API 请求失败: ${response.status}`);
		}

		// 处理流式响应
		reader = response.body?.getReader();
		const decoder = new TextDecoder();

		if (!reader) {
			throw new Error("无法读取响应流");
		}

		loading = false;
		let lastUpdateTime = Date.now();

		while (true) {
			// 检查是否长时间没有更新（30秒无数据视为超时）
			if (Date.now() - lastUpdateTime > 30000) {
				throw new Error("响应流超时，请稍后重试");
			}

			const { done, value } = await reader.read();

			if (done) {
				streaming = false;
				// 去除结尾的空白
				summary = summary.trimEnd();
				break;
			}

			lastUpdateTime = Date.now();
			const chunk = decoder.decode(value, { stream: true });
			const lines = chunk.split("\n");

			for (const line of lines) {
				const trimmedLine = line.trim();
				if (!trimmedLine || !trimmedLine.startsWith("data: ")) {
					continue;
				}

				const data = trimmedLine.slice(6);

				if (data === "[DONE]") {
					streaming = false;
					summary = summary.trimEnd();
					if (timeoutId) clearTimeout(timeoutId);
					return;
				}

				try {
					const parsed = JSON.parse(data);
					const delta = parsed.choices?.[0]?.delta?.content;

					if (delta) {
						// 如果是第一次接收内容，去除开头的空白
						if (summary === "") {
							summary += delta.trimStart();
						} else {
							summary += delta;
						}
					}

					// 检查是否完成
					const finishReason = parsed.choices?.[0]?.finish_reason;
					if (finishReason === "stop" || finishReason === "length") {
						streaming = false;
						summary = summary.trimEnd();
						if (timeoutId) clearTimeout(timeoutId);
						return;
					}
				} catch (e) {
					// 忽略单个数据块的解析错误，继续处理下一个
					console.warn("Failed to parse SSE data:", data, e);
				}
			}
		}
	} catch (e) {
		error = e instanceof Error ? e.message : "生成总结失败，请稍后重试";
		console.error("AI Summary Error:", e);
		streaming = false;
	} finally {
		loading = false;
		streaming = false;
		if (timeoutId) clearTimeout(timeoutId);
		if (reader) {
			try {
				await reader.cancel();
			} catch (e) {
				console.warn("Failed to cancel reader:", e);
			}
		}
	}
}
</script>

<div class="ai-summary-container">
  <div class="summary-header">
    <div class="header-left">
      <svg class="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      <span class="header-title">AI 智能总结</span>
    </div>
    
    <button 
      class="summary-btn" 
      on:click={generateSummary}
      disabled={loading || streaming}
      type="button"
    >
      {#if loading}
        <svg class="spinner" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"/>
        </svg>
        连接中...
      {:else if streaming}
        <svg class="typing-indicator" viewBox="0 0 24 24">
          <circle cx="4" cy="12" r="2" fill="currentColor">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0s"/>
          </circle>
          <circle cx="12" cy="12" r="2" fill="currentColor">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0.2s"/>
          </circle>
          <circle cx="20" cy="12" r="2" fill="currentColor">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0.4s"/>
          </circle>
        </svg>
        深度思考中...
      {:else if summary}
        {expanded ? '收起' : '展开'}
      {:else}
        生成总结
      {/if}
    </button>
  </div>
  
  {#if error}
    <div class="error-message">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{error}</span>
    </div>
  {/if}
  
  {#if summary && expanded}
    <div class="summary-content">
      <div class="summary-text" class:streaming={streaming}>
        {@html renderedSummary}
        {#if streaming}
          <span class="cursor">▋</span>
        {/if}
      </div>
      <div class="summary-footer">
        <span class="powered-by">Powered by Qwen3-VL-32B-Thinking</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .ai-summary-container {
    background: linear-gradient(135deg, 
      oklch(0.95 0.02 var(--hue)) 0%, 
      oklch(0.97 0.01 calc(var(--hue) + 20)) 100%
    );
    border: 1px solid var(--line-divider);
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  :global(.dark) .ai-summary-container {
    background: linear-gradient(135deg, 
      oklch(0.2 0.02 var(--hue)) 0%, 
      oklch(0.22 0.01 calc(var(--hue) + 20)) 100%
    );
  }
  
  .summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }
  
  .ai-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--primary);
  }
  
  .header-title {
    font-weight: 600;
    font-size: 0.95rem;
  }
  
  :global(.dark) .header-title {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .summary-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  
  .summary-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .summary-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
  }
  
  .typing-indicator {
    width: 1.5rem;
    height: 1rem;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 0.5rem;
    color: rgb(239, 68, 68);
    font-size: 0.875rem;
  }
  
  .error-message svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
  
  .summary-content {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--line-divider);
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .summary-text {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-color);
    margin-bottom: 0.75rem;
    word-wrap: break-word;
  }
  
  /* Markdown 样式 */
  .summary-text :global(h1),
  .summary-text :global(h2),
  .summary-text :global(h3),
  .summary-text :global(h4) {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.3;
  }
  
  .summary-text :global(h1) { font-size: 1.5rem; }
  .summary-text :global(h2) { font-size: 1.3rem; }
  .summary-text :global(h3) { font-size: 1.1rem; }
  .summary-text :global(h4) { font-size: 1rem; }
  
  .summary-text :global(h1):first-child,
  .summary-text :global(h2):first-child,
  .summary-text :global(h3):first-child,
  .summary-text :global(h4):first-child {
    margin-top: 0;
  }
  
  .summary-text :global(p) {
    margin-bottom: 0.75rem;
  }
  
  .summary-text :global(p):last-child {
    margin-bottom: 0;
  }
  
  .summary-text :global(ul),
  .summary-text :global(ol) {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
  }
  
  .summary-text :global(li) {
    margin-bottom: 0.25rem;
  }
  
  .summary-text :global(strong) {
    font-weight: 600;
    color: var(--primary);
  }
  
  :global(.dark) .summary-text :global(strong) {
    color: var(--primary);
  }
  
  .summary-text :global(em) {
    font-style: italic;
  }
  
  .summary-text :global(code) {
    padding: 0.125rem 0.375rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875em;
  }
  
  :global(.dark) .summary-text :global(code) {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .summary-text :global(pre) {
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 0.75rem 0;
  }
  
  :global(.dark) .summary-text :global(pre) {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .summary-text :global(pre code) {
    padding: 0;
    background: transparent;
  }
  
  .summary-text :global(blockquote) {
    margin: 0.75rem 0;
    padding-left: 1rem;
    border-left: 3px solid var(--primary);
    color: var(--text-color);
    opacity: 0.8;
  }
  
  .summary-text :global(a) {
    color: var(--primary);
    text-decoration: underline;
  }
  
  .summary-text :global(a:hover) {
    opacity: 0.8;
  }
  
  .summary-text.streaming {
    animation: fadeIn 0.3s ease-in;
  }
  
  .cursor {
    display: inline-block;
    animation: blink 1s step-end infinite;
    color: var(--primary);
    font-weight: bold;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  :global(.dark) .summary-text {
    color: rgba(255, 255, 255, 0.85);
  }
  
  .summary-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    opacity: 0.6;
  }
  
  :global(.dark) .summary-footer {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .powered-by {
    font-style: italic;
  }
  
  @media (max-width: 640px) {
    .summary-header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .summary-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
