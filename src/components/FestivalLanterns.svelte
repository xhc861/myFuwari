<script lang="ts">
import { onMount } from "svelte";

export let show = false;
export let text1 = "元";
export let text2 = "旦";
export let text3 = "快";
export let text4 = "乐";

onMount(() => {
	// 加载初始设置
	const saved = localStorage.getItem("effectsSettings");
	if (saved) {
		const settings = JSON.parse(saved);
		show = settings.lanternsEnabled ?? false;
		if (settings.lanternText) {
			text1 = settings.lanternText.text1;
			text2 = settings.lanternText.text2;
			text3 = settings.lanternText.text3;
			text4 = settings.lanternText.text4;
		}
	}

	// 监听设置变化
	const handleSettingsChange = (event: CustomEvent) => {
		show = event.detail.lanternsEnabled;
		if (event.detail.lanternText) {
			text1 = event.detail.lanternText.text1;
			text2 = event.detail.lanternText.text2;
			text3 = event.detail.lanternText.text3;
			text4 = event.detail.lanternText.text4;
		}
	};

	window.addEventListener(
		"effectsSettingsChanged",
		handleSettingsChange as EventListener,
	);

	return () => {
		window.removeEventListener(
			"effectsSettingsChanged",
			handleSettingsChange as EventListener,
		);
	};
});
</script>

{#if show}
  <!-- 左侧灯笼1 -->
  <div class="deng-box deng-box-left1">
    <div class="deng">
      <div class="xian"></div>
      <div class="deng-a">
        <div class="deng-b">
          <div class="deng-t">{text1}</div>
        </div>
      </div>
      <div class="shui shui-a">
        <div class="shui-c"></div>
        <div class="shui-b"></div>
      </div>
    </div>
  </div>

  <!-- 左侧灯笼2 -->
  <div class="deng-box deng-box-left2">
    <div class="deng">
      <div class="xian"></div>
      <div class="deng-a">
        <div class="deng-b">
          <div class="deng-t">{text2}</div>
        </div>
      </div>
      <div class="shui shui-a">
        <div class="shui-c"></div>
        <div class="shui-b"></div>
      </div>
    </div>
  </div>

  <!-- 右侧灯笼1 -->
  <div class="deng-box deng-box-right1">
    <div class="deng">
      <div class="xian"></div>
      <div class="deng-a">
        <div class="deng-b">
          <div class="deng-t">{text3}</div>
        </div>
      </div>
      <div class="shui shui-a">
        <div class="shui-c"></div>
        <div class="shui-b"></div>
      </div>
    </div>
  </div>

  <!-- 右侧灯笼2 -->
  <div class="deng-box deng-box-right2">
    <div class="deng">
      <div class="xian"></div>
      <div class="deng-a">
        <div class="deng-b">
          <div class="deng-t">{text4}</div>
        </div>
      </div>
      <div class="shui shui-a">
        <div class="shui-c"></div>
        <div class="shui-b"></div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* 基础样式 */
  .deng-box {
    position: fixed;
    top: -40px;
    z-index: 999;
    pointer-events: none;
  }

  .deng {
    position: relative;
    width: 120px;
    height: 90px;
    margin: 50px;
    background: #d8000f;
    background: rgba(216, 0, 15, 0.8);
    border-radius: 50% 50%;
    transform-origin: 50% -100px;
    box-shadow: -5px 5px 50px 4px rgba(250, 108, 0, 1);
  }

  /* 左侧灯笼位置 */
  .deng-box-left1 {
    left: 20px;
    z-index: 999;
  }

  .deng-box-left2 {
    left: 80px;
    z-index: 998;
  }

  /* 右侧灯笼位置 */
  .deng-box-right1 {
    right: 80px;
    z-index: 999;
  }

  .deng-box-right2 {
    right: 20px;
    z-index: 998;
  }

  .deng-a {
    width: 100px;
    height: 90px;
    background: #d8000f;
    background: rgba(216, 0, 15, 0.1);
    margin: 12px 8px 8px 10px;
    border-radius: 50% 50%;
    border: 2px solid #dc8f03;
  }

  .deng-b {
    width: 45px;
    height: 90px;
    background: #d8000f;
    background: rgba(216, 0, 15, 0.1);
    margin: -4px 8px 8px 26px;
    border-radius: 50% 50%;
    border: 2px solid #dc8f03;
  }

  .xian {
    position: absolute;
    top: -20px;
    left: 60px;
    width: 2px;
    height: 20px;
    background: #dc8f03;
  }

  .shui-a {
    position: relative;
    width: 5px;
    height: 20px;
    margin: -5px 0 0 59px;
    background: #ffa500;
    border-radius: 0 0 5px 5px;
  }

  .shui-b {
    position: absolute;
    top: 14px;
    left: -2px;
    width: 10px;
    height: 10px;
    background: #dc8f03;
    border-radius: 50%;
  }

  .shui-c {
    position: absolute;
    top: 18px;
    left: -2px;
    width: 10px;
    height: 35px;
    background: #ffa500;
    border-radius: 0 0 0 5px;
  }

  .deng:before {
    position: absolute;
    top: -7px;
    left: 29px;
    height: 12px;
    width: 60px;
    content: " ";
    display: block;
    z-index: 999;
    border-radius: 5px 5px 0 0;
    border: solid 1px #dc8f03;
    background: #ffa500;
    background: linear-gradient(to right, #dc8f03, #ffa500, #dc8f03, #ffa500, #dc8f03);
  }

  .deng:after {
    position: absolute;
    bottom: -7px;
    left: 10px;
    height: 12px;
    width: 60px;
    content: " ";
    display: block;
    margin-left: 20px;
    border-radius: 0 0 5px 5px;
    border: solid 1px #dc8f03;
    background: #ffa500;
    background: linear-gradient(to right, #dc8f03, #ffa500, #dc8f03, #ffa500, #dc8f03);
  }

  .deng-t {
    font-size: 3.2rem;
    color: #dc8f03;
    font-weight: bold;
    line-height: 85px;
    text-align: center;
  }

  :global(.dark) .deng-t,
  :global(.dark) .deng-box {
    background: transparent !important;
  }

  /* 摇摆动画 */
  .deng-box-left1 .deng {
    animation: swing 3s infinite ease-in-out;
  }

  .deng-box-left2 .deng {
    animation: swing 3.2s infinite ease-in-out;
  }

  .deng-box-right1 .deng {
    animation: swing 3.5s infinite ease-in-out;
  }

  .deng-box-right2 .deng {
    animation: swing 3.7s infinite ease-in-out;
  }

  @keyframes swing {
    0% {
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(-10deg);
    }
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .deng-box {
      display: none;
    }
  }
</style>
