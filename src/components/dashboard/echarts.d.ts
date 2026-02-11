declare global {
	interface Window {
		echarts: typeof import("echarts");
	}
}

export {};
