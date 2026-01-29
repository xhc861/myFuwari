<script lang="ts">
	import { Icon } from 'astro-icon/components';
	import { onMount } from 'svelte';

	interface ExamRecord {
		id: string;
		subject: string;
		score: number;
		rank: number;
		totalStudents: number;
		date: string;
		createdAt: number;
	}

	let records: ExamRecord[] = [];
	let nextId = 0;
	let showForm = false;

	// 表单数据
	let formData = {
		subject: '',
		score: '',
		rank: '',
		totalStudents: '',
		date: new Date().toISOString().split('T')[0]
	};

	function loadRecords() {
		const stored = localStorage.getItem('examRecords');
		if (stored) {
			records = JSON.parse(stored);
			nextId = Math.max(...records.map(r => parseInt(r.id)), 0) + 1;
		}
	}

	function saveRecords() {
		localStorage.setItem('examRecords', JSON.stringify(records));
	}

	function addRecord() {
		if (
			!formData.subject.trim() ||
			!formData.score ||
			!formData.rank ||
			!formData.totalStudents ||
			!formData.date
		) {
			if ((window as any).showNotification) {
				(window as any).showNotification('请填写所有字段', 'warning', 3000);
			}
			return;
		}

		const newRecord: ExamRecord = {
			id: `exam-${nextId++}`,
			subject: formData.subject.trim(),
			score: parseFloat(formData.score),
			rank: parseInt(formData.rank),
			totalStudents: parseInt(formData.totalStudents),
			date: formData.date,
			createdAt: Date.now()
		};

		records = [...records, newRecord];
		saveRecords();

		// 重置表单
		formData = {
			subject: '',
			score: '',
			rank: '',
			totalStudents: '',
			date: new Date().toISOString().split('T')[0]
		};
		showForm = false;

		if ((window as any).showNotification) {
			(window as any).showNotification('成绩已添加', 'success', 3000);
		}
	}

	function deleteRecord(id: string) {
		records = records.filter(r => r.id !== id);
		saveRecords();

		if ((window as any).showNotification) {
			(window as any).showNotification('成绩已删除', 'info', 3000);
		}
	}

	function getSubjectRecords(subject: string) {
		return records.filter(r => r.subject === subject).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}

	function getUniqueSubjects() {
		const subjects = new Set(records.map(r => r.subject));
		return Array.from(subjects);
	}

	function getAverageScore(subject: string) {
		const subjectRecords = getSubjectRecords(subject);
		if (subjectRecords.length === 0) return 0;
		const sum = subjectRecords.reduce((acc, r) => acc + r.score, 0);
		return (sum / subjectRecords.length).toFixed(1);
	}

	function getMaxScore(subject: string) {
		const subjectRecords = getSubjectRecords(subject);
		if (subjectRecords.length === 0) return 0;
		return Math.max(...subjectRecords.map(r => r.score));
	}

	function getMinScore(subject: string) {
		const subjectRecords = getSubjectRecords(subject);
		if (subjectRecords.length === 0) return 0;
		return Math.min(...subjectRecords.map(r => r.score));
	}

	function getLatestRank(subject: string) {
		const subjectRecords = getSubjectRecords(subject);
		if (subjectRecords.length === 0) return '-';
		const latest = subjectRecords[subjectRecords.length - 1];
		return `${latest.rank}/${latest.totalStudents}`;
	}

	function getScorePercentage(score: number) {
		return Math.min(100, (score / 100) * 100);
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
	}

	onMount(() => {
		loadRecords();
	});
</script>

<div class="card-base p-6 space-y-4">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-xl font-bold text-[var(--primary)]">📊 考试成绩趋势</h2>
		<button
			on:click={() => (showForm = !showForm)}
			class="px-3 py-1 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition text-sm font-medium flex items-center gap-2"
		>
			<Icon name="fa6-solid:plus" class="text-sm" />
			<span class="hidden sm:inline">添加成绩</span>
		</button>
	</div>

	<!-- 添加成绩表单 -->
	{#if showForm}
		<div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<input
					type="text"
					bind:value={formData.subject}
					placeholder="科目名称"
					class="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
				/>
				<input
					type="number"
					bind:value={formData.score}
					placeholder="成绩 (0-100)"
					min="0"
					max="100"
					class="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
				/>
				<input
					type="number"
					bind:value={formData.rank}
					placeholder="排名"
					min="1"
					class="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
				/>
				<input
					type="number"
					bind:value={formData.totalStudents}
					placeholder="总人数"
					min="1"
					class="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
				/>
				<input
					type="date"
					bind:value={formData.date}
					class="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition sm:col-span-2"
				/>
			</div>
			<div class="flex gap-2 justify-end">
				<button
					on:click={() => (showForm = false)}
					class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:opacity-90 transition font-medium"
				>
					取消
				</button>
				<button
					on:click={addRecord}
					class="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition font-medium"
				>
					保存
				</button>
			</div>
		</div>
	{/if}

	<!-- 成绩统计 -->
	{#if records.length === 0}
		<div class="text-center py-12 text-gray-500 dark:text-gray-400">
			<Icon name="fa6-solid:chart-line" class="text-4xl mx-auto mb-3 opacity-50" />
			<p>暂无成绩记录，开始添加吧！</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each getUniqueSub jects() as subject}
				<div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
					<!-- 科目标题和统计 -->
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-bold text-lg text-gray-800 dark:text-gray-200">{subject}</h3>
						<div class="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-right">
							<p>平均: <span class="font-bold text-[var(--primary)]">{getAverageScore(subject)}</span></p>
							<p>最高: <span class="font-bold text-green-600 dark:text-green-400">{getMaxScore(subject)}</span></p>
							<p>最低: <span class="font-bold text-red-600 dark:text-red-400">{getMinScore(subject)}</span></p>
							<p>排名: <span class="font-bold">{getLatestRank(subject)}</span></p>
						</div>
					</div>

					<!-- 成绩趋势图 -->
					<div class="mb-4 pb-4 border-b border-gray-300 dark:border-gray-600">
						<div class="flex items-end gap-2 h-32 justify-between">
							{#each getSubjectRecords(subject) as record}
								<div class="flex flex-col items-center gap-2 flex-1">
									<div
										class="w-full bg-gradient-to-t from-[var(--primary)] to-[var(--primary)] rounded-t-lg transition hover:opacity-80"
										style="height: {getScorePercentage(record.score)}%"
										title="{record.subject}: {record.score} ({formatDate(record.date)})"
									/>
									<span class="text-xs text-gray-600 dark:text-gray-400 text-center">{formatDate(record.date)}</span>
									<span class="text-xs font-bold text-gray-800 dark:text-gray-200">{record.score}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- 详细记录 -->
					<div class="space-y-2">
						{#each getSubjectRecords(subject).reverse() as record}
							<div class="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-800 dark:text-gray-200">
										{record.date} - 成绩: {record.score}
									</p>
									<p class="text-xs text-gray-600 dark:text-gray-400">
										排名: {record.rank}/{record.totalStudents}
									</p>
								</div>
								<button
									on:click={() => deleteRecord(record.id)}
									class="flex-shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
									aria-label="删除记录"
								>
									<Icon name="fa6-solid:trash" class="text-sm" />
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	input[type='date']::-webkit-calendar-picker-indicator {
		filter: invert(0.8);
	}

	:global(.dark) input[type='date']::-webkit-calendar-picker-indicator {
		filter: invert(1);
	}
</style>
