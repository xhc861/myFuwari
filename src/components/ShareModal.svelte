<script lang="ts">
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import { onDestroy, onMount } from "svelte";

export let show = false;
export let title: string;
export let slug: string;
export let published: Date;
export let words: number;
export let minutes: number;

let url = "";
let qrCodeDataUrl = "";
let copied = false;
let modalElement: HTMLDivElement;
let barcodeCanvas: HTMLCanvasElement;

onMount(() => {
	url = window.location.href;
	generateQRCode();
});

async function generateQRCode() {
	try {
		qrCodeDataUrl = await QRCode.toDataURL(url, {
			width: 150,
			margin: 1,
			color: {
				dark: "#000000",
				light: "#ffffff",
			},
		});
	} catch (err) {
		console.error("生成二维码失败:", err);
	}
}

function generateBarcode() {
	if (!barcodeCanvas) return;

	try {
		// 使用文章 slug 和时间戳生成唯一的条码
		const barcodeData = `${slug}-${Date.now()}`
			.substring(0, 20)
			.toUpperCase()
			.replace(/[^A-Z0-9]/g, "");

		JsBarcode(barcodeCanvas, barcodeData, {
			format: "CODE128",
			width: 2,
			height: 60,
			displayValue: false,
			background: "transparent",
			lineColor: document.documentElement.classList.contains("dark")
				? "#ffffff"
				: "#000000",
			margin: 0,
		});
	} catch (err) {
		console.error("生成条码失败:", err);
	}
}

function copyLink() {
	navigator.clipboard.writeText(url).then(() => {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	});
}

function close() {
	show = false;
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === "Escape" && show) {
		close();
	}
}

// 当模态框显示时，将其移动到 body 并锁定滚动
$: if (show && modalElement) {
	document.body.appendChild(modalElement);
	document.body.style.overflow = "hidden";
	url = window.location.href;
	generateQRCode();
	setTimeout(generateBarcode, 100);
} else if (!show && typeof document !== "undefined") {
	document.body.style.overflow = "";
}

onDestroy(() => {
	if (typeof document !== "undefined") {
		document.body.style.overflow = "";
	}
});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    bind:this={modalElement}
    class="modal-root"
    on:click={close}
  >
    <div class="modal-content" on:click|stopPropagation>
      <!-- 机票顶部 -->
      <div class="ticket-header">
        <div class="airline-info">
          <div class="airline-name">分享文章</div>
        </div>
        <button class="close-btn" on:click={close} type="button">×</button>
      </div>
      
      <!-- 机票主体 -->
      <div class="ticket-body">
        <div class="ticket-left">
          <div class="flight-info">
            <div class="info-row">
              <div class="info-label">文章标题</div>
              <div class="info-value title-text">{title}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">发表时间</div>
              <div class="info-value">{new Date(published).toLocaleDateString('zh-CN')}</div>
            </div>
            
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-label">字数</div>
                <div class="stat-value">{words}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">阅读时间</div>
                <div class="stat-value">{minutes}分钟</div>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">文章链接</div>
              <div class="link-container">
                <input type="text" readonly value={url} class="link-input" />
                <button class="copy-btn" on:click={copyLink} type="button">
                  {copied ? '✓ 已复制' : '复制'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="ticket-divider">
          <div class="circle circle-top"></div>
          <div class="dashed-line"></div>
          <div class="circle circle-bottom"></div>
        </div>
        
        <div class="ticket-right">
          <div class="qr-section">
            <div class="qr-label">扫码访问</div>
            {#if qrCodeDataUrl}
              <img src={qrCodeDataUrl} alt="QR Code" class="qr-code" />
            {:else}
              <div class="qr-loading">生成中...</div>
            {/if}
          </div>
        </div>
      </div>
      
      <!-- 机票底部 -->
      <div class="ticket-footer">
        <div class="barcode-container">
          <canvas bind:this={barcodeCanvas} class="barcode-canvas"></canvas>
          <div class="barcode-glow"></div>
          <div class="scan-line"></div>
        </div>
        <div class="barcode-label">BOARDING PASS • {slug.toUpperCase()}</div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-root {
    /* 完全脱离文档流 */
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 999999 !important;
    
    /* 背景和模糊 */
    background: rgba(0, 0, 0, 0.6) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    
    /* 居中布局 */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 1rem !important;
    
    /* 动画 */
    animation: fadeIn 0.2s ease-out !important;
    
    /* 滚动 */
    overflow-y: auto !important;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.3s ease-out;
    overflow: hidden;
    position: relative;
  }
  
  :global(.dark) .modal-content {
    background: oklch(0.23 0.01 var(--hue));
  }

  /* 模态框滚动条样式 */
  .modal-content::-webkit-scrollbar {
    width: 8px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    transition: background 0.2s;
  }

  .modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  :global(.dark) .modal-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  :global(.dark) .modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .ticket-header {
    background: linear-gradient(135deg, var(--primary) 0%, oklch(0.65 0.14 calc(var(--hue) + 20)) 100%);
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }
  
  .airline-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .airline-logo {
    font-size: 2rem;
  }
  
  .airline-name {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    line-height: 1;
  }
  
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
  
  .ticket-body {
    display: flex;
    padding: 2rem;
    gap: 1.5rem;
    position: relative;
  }
  
  .ticket-left {
    flex: 1;
  }
  
  .flight-info {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .info-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .info-label {
    font-size: 0.75rem;
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
  }
  
  :global(.dark) .info-label {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .info-value {
    font-size: 0.95rem;
    font-weight: 500;
  }
  
  :global(.dark) .info-value {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .title-text {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.4;
  }
  
  .stats-row {
    display: flex;
    gap: 1.5rem;
    padding: 1rem 0;
    border-top: 1px dashed rgba(0, 0, 0, 0.1);
    border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
  }
  
  :global(.dark) .stats-row {
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
    opacity: 0.6;
    text-transform: uppercase;
  }
  
  :global(.dark) .stat-label {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .stat-value {
    font-size: 1rem;
    font-weight: 600;
  }
  
  :global(.dark) .stat-value {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .link-container {
    display: flex;
    gap: 0.5rem;
  }
  
  .link-input {
    flex: 1;
    padding: 0.625rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0.375rem;
    font-size: 0.8rem;
    background: rgba(0, 0, 0, 0.02);
    font-family: monospace;
  }
  
  :global(.dark) .link-input {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
  
  .copy-btn {
    padding: 0.625rem 1rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.2s;
  }
  
  .copy-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  .ticket-divider {
    position: relative;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0,
      rgba(0, 0, 0, 0.1) 5px,
      transparent 5px,
      transparent 10px
    );
  }
  
  :global(.dark) .ticket-divider {
    background: repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1) 0,
      rgba(255, 255, 255, 0.1) 5px,
      transparent 5px,
      transparent 10px
    );
  }
  
  .circle {
    position: absolute;
    width: 2rem;
    height: 2rem;
    background: var(--card-bg);
    border-radius: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .circle-top {
    top: -1rem;
  }
  
  .circle-bottom {
    bottom: -1rem;
  }
  
  .ticket-right {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .qr-label {
    font-size: 0.75rem;
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
  }
  
  :global(.dark) .qr-label {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .qr-code {
    width: 150px;
    height: 150px;
    border-radius: 0.5rem;
    padding: 0.5rem;
    background: white;
  }
  
  .qr-loading {
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    opacity: 0.6;
  }
  
  :global(.dark) .qr-loading {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
  }
  
  .ticket-footer {
    padding: 1.5rem 2rem;
    background: rgba(0, 0, 0, 0.02);
    border-top: 1px dashed rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  :global(.dark) .ticket-footer {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .barcode-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    margin-bottom: 0.5rem;
  }
  
  .barcode-canvas {
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 0 8px rgba(var(--primary-rgb, 88, 88, 88), 0.3));
  }
  
  .barcode-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 100%;
    background: radial-gradient(ellipse at center, 
      rgba(var(--primary-rgb, 88, 88, 88), 0.15) 0%, 
      transparent 70%);
    z-index: 1;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.05);
    }
  }
  
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      var(--primary) 50%, 
      transparent 100%);
    animation: scan 3s linear infinite;
    z-index: 3;
    opacity: 0.6;
  }
  
  @keyframes scan {
    0% {
      top: 0;
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      top: 100%;
      opacity: 0;
    }
  }
  
  .barcode-label {
    text-align: center;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    opacity: 0.5;
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }
  
  :global(.dark) .barcode-label {
    color: rgba(255, 255, 255, 0.7);
  }
  
  @media (max-width: 768px) {
    .modal-root {
      padding: 0.5rem !important;
    }
    
    .modal-content {
      max-height: 95vh;
    }
    
    .ticket-body {
      flex-direction: column;
      padding: 1.5rem;
    }
    
    .ticket-divider {
      width: 100%;
      height: 1px;
      background: repeating-linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1) 0,
        rgba(0, 0, 0, 0.1) 5px,
        transparent 5px,
        transparent 10px
      );
    }
    
    :global(.dark) .ticket-divider {
      background: repeating-linear-gradient(
        to right,
        rgba(255, 255, 255, 0.1) 0,
        rgba(255, 255, 255, 0.1) 5px,
        transparent 5px,
        transparent 10px
      );
    }
    
    .circle {
      width: 2rem;
      height: 2rem;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .circle-top {
      left: -1rem;
      top: 50%;
    }
    
    .circle-bottom {
      right: -1rem;
      left: auto;
      top: 50%;
      bottom: auto;
    }
    
    .stats-row {
      flex-wrap: wrap;
    }
  }
</style>
