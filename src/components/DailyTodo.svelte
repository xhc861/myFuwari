<script lang="ts">
	import { Icon } from 'astro-icon/components';
	import { onMount } from 'svelte';

	interface Todo {
		id: string;
		text: string;
		completed: boolean;
		priority: 'high' | 'medium' | 'low';
		createdAt: number;
	}

	let todos: Todo[] = [];
	let inputValue = '';
	let selectedPriority: 'high' | 'medium' | 'low' = 'medium';
	let nextId = 0;

	const priorityColors = {
		high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300',
		medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300',
		low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300'
	};

	const priorityLabels = {
		high: '高',
		medium: '中',
		low: '低'
	};

	const priorityOrder = { high: 0, medium: 1, low: 2 };

	function loadTodos() {
		const stored = localStorage.getItem('dailyTodos');
		if (stored) {
			todos = JSON.parse(stored);
			nextId = Math.max(...todos.map(t => parseInt(t.id)), 0) + 1;
		}
	}

	function saveTodos() {
		localStorage.setItem('dailyTodos', JSON.stringify(todos));
	}

	function addTodo() {
		if (inputValue.trim() === '') return;

		const newTodo: Todo = {
			id: `todo-${nextId++}`,
			text: inputValue.trim(),
			completed: false,
			priority: selectedPriority,
			createdAt: Date.now()
		};

		todos = [...todos, newTodo];
		saveTodos();
		inputValue = '';
		selectedPriority = 'medium';

		// 显示通知
		if ((window as any).showNotification) {
			(window as any).showNotification('任务已添加', 'success', 3000);
		}
	}

	function toggleTodo(id: string) {
		todos = todos.map(todo =>
			todo.id === id ? { ...todo, completed: !todo.completed } : todo
		);
		saveTodos();
	}

	function deleteTodo(id: string) {
		todos = todos.filter(todo => todo.id !== id);
		saveTodos();

		if ((window as any).showNotification) {
			(window as any).showNotification('任务已删除', 'info', 3000);
		}
	}

	function getSortedTodos() {
		return [...todos].sort((a, b) => {
			// 未完成的任务排在前面
			if (a.completed !== b.completed) {
				return a.completed ? 1 : -1;
			}
			// 按优先级排序
			return priorityOrder[a.priority] - priorityOrder[b.priority];
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			addTodo();
		}
	}

	onMount(() => {
		loadTodos();
	});
</script>

<div class="card-base p-6 space-y-4">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-xl font-bold text-[var(--primary)]">📝 每日待办</h2>
		<span class="text-sm text-gray-500 dark:text-gray-400">
			{todos.filter(t => !t.completed).length}/{todos.length}
		</span>
	</div>

	<!-- 输入区域 -->
	<div class="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={inputValue}
				on:keydown={handleKeydown}
				placeholder="添加新任务..."
				class="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
			/>
			<button
				on:click={addTodo}
				class="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition font-medium flex items-center gap-2"
			>
				<Icon name="fa6-solid:plus" class="text-sm" />
				<span class="hidden sm:inline">添加</span>
			</button>
		</div>

		<!-- 优先级选择 -->
		<div class="flex gap-2">
			{#each ['high', 'medium', 'low'] as priority}
				<button
					on:click={() => (selectedPriority = priority)}
					class="px-3 py-1 rounded-full text-sm font-medium transition {selectedPriority === priority
						? `${priorityColors[priority]} border`
						: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}"
				>
					{priorityLabels[priority]}优先级
				</button>
			{/each}
		</div>
	</div>

	<!-- 任务列表 -->
	<div class="space-y-2 max-h-96 overflow-y-auto">
		{#if todos.length === 0}
			<div class="text-center py-8 text-gray-500 dark:text-gray-400">
				<Icon name="fa6-solid:inbox" class="text-3xl mx-auto mb-2 opacity-50" />
				<p>暂无任务，开始添加吧！</p>
			</div>
		{:else}
			{#each getSortedTodos() as todo (todo.id)}
				<div
					class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
				>
					<input
						type="checkbox"
						checked={todo.completed}
						on:change={() => toggleTodo(todo.id)}
						class="mt-1 w-5 h-5 rounded cursor-pointer accent-[var(--primary)]"
					/>
					<div class="flex-1 min-w-0">
						<p
							class="text-sm break-words {todo.completed
								? 'line-through text-gray-500 dark:text-gray-400'
								: 'text-gray-800 dark:text-gray-200'}"
						>
							{todo.text}
						</p>
						<div class="flex gap-2 mt-2">
							<span
								class="inline-block px-2 py-0.5 text-xs font-medium rounded-full border {priorityColors[
									todo.priority
								]}"
							>
								{priorityLabels[todo.priority]}
							</span>
						</div>
					</div>
					<button
						on:click={() => deleteTodo(todo.id)}
						class="flex-shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
						aria-label="删除任务"
					>
						<Icon name="fa6-solid:trash" class="text-sm" />
					</button>
				</div>
			{/each}
		{/if}
	</div>

	<!-- 统计信息 -->
	{#if todos.length > 0}
		<div class="pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 space-y-1">
			<p>✓ 已完成: {todos.filter(t => t.completed).length}</p>
			<p>⏳ 待完成: {todos.filter(t => !t.completed).length}</p>
		</div>
	{/if}
</div>

<style>
	::-webkit-scrollbar {
		width: 6px;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}

	::-webkit-scrollbar-thumb {
		background: #ccc;
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #999;
	}
</style>
