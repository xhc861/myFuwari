<script lang="ts">
import { onMount } from "svelte";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let stars: ShootingStar[] = [];
let animationId: number;
let enabled = true;

class ShootingStar {
	x: number;
	y: number;
	length: number;
	speed: number;
	opacity: number;
	fadeSpeed: number;

	constructor(width: number, height: number) {
		this.x = Math.random() * width;
		this.y = Math.random() * height * 0.5; // 只在上半部分生成
		this.length = Math.random() * 80 + 40;
		this.speed = Math.random() * 3 + 2;
		this.opacity = 1;
		this.fadeSpeed = 0.02;
	}

	update() {
		this.x += this.speed;
		this.y += this.speed;
		this.opacity -= this.fadeSpeed;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.globalAlpha = this.opacity;

		const gradient = ctx.createLinearGradient(
			this.x,
			this.y,
			this.x - this.length,
			this.y - this.length,
		);
		gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

		ctx.strokeStyle = gradient;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x - this.length, this.y - this.length);
		ctx.stroke();

		ctx.restore();
	}

	isOffScreen(width: number, height: number): boolean {
		return this.x > width || this.y > height || this.opacity <= 0;
	}
}

function createStar() {
	if (Math.random() < 0.02) {
		// 2% 概率每帧生成流星
		stars.push(new ShootingStar(canvas.width, canvas.height));
	}
}

function animate() {
	if (!enabled) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	createStar();

	stars = stars.filter((star) => {
		star.update();
		star.draw(ctx);
		return !star.isOffScreen(canvas.width, canvas.height);
	});

	animationId = requestAnimationFrame(animate);
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

onMount(() => {
	const context = canvas.getContext("2d");
	if (!context) return;
	ctx = context;
	resizeCanvas();

	// 加载初始设置
	const saved = localStorage.getItem("effectsSettings");
	if (saved) {
		const settings = JSON.parse(saved);
		enabled = settings.shootingStarsEnabled ?? true;
	}

	if (enabled) {
		animate();
	}

	// 监听设置变化
	const handleSettingsChange = (event: CustomEvent) => {
		const wasEnabled = enabled;
		enabled = event.detail.shootingStarsEnabled;

		if (enabled && !wasEnabled) {
			animate();
		} else if (!enabled && wasEnabled) {
			cancelAnimationFrame(animationId);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	};

	window.addEventListener(
		"effectsSettingsChanged",
		handleSettingsChange as EventListener,
	);
	window.addEventListener("resize", resizeCanvas);

	return () => {
		window.removeEventListener(
			"effectsSettingsChanged",
			handleSettingsChange as EventListener,
		);
		window.removeEventListener("resize", resizeCanvas);
		cancelAnimationFrame(animationId);
	};
});
</script>

<canvas bind:this={canvas} class="shooting-stars-container" class:hidden={!enabled}></canvas>

<style>
  .shooting-stars-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }
  
  :global(.dark) .shooting-stars-container {
    opacity: 0.8;
  }
  
  .hidden {
    display: none;
  }
</style>
