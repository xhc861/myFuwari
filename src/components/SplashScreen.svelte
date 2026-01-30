<script lang="ts">
import { onMount } from "svelte";

let show = true;
let animationPhase: "enter" | "exit" = "enter";

onMount(() => {
	// Check if this is a fresh page load (not a navigation)
	const hasVisited = sessionStorage.getItem("hasVisited");

	if (hasVisited) {
		// Already visited in this session, don't show splash
		show = false;
		return;
	}

	// Mark as visited for this session
	sessionStorage.setItem("hasVisited", "true");

	// Start exit animation after 2 seconds
	setTimeout(() => {
		animationPhase = "exit";

		// Remove splash screen after animation completes
		setTimeout(() => {
			show = false;
		}, 800);
	}, 2000);
});
</script>

{#if show}
  <div 
    class="splash-screen" 
    class:exit={animationPhase === 'exit'}
    aria-hidden="true"
  >
    <div class="splash-content">
      <div class="logo-container">
        <div class="logo-circle">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
    </div>
  </div>
{/if}

<style>
  .splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, 
      hsl(var(--hue), 70%, 15%) 0%, 
      hsl(var(--hue), 60%, 10%) 50%, 
      hsl(var(--hue), 50%, 5%) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
  }
  
  .splash-screen.exit {
    animation: fadeOut 0.8s ease-out forwards;
  }
  
  .splash-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  .logo-container {
    animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
  }
  
  .logo-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      hsl(var(--hue), 80%, 60%), 
      hsl(var(--hue), 70%, 50%)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
      0 0 40px hsla(var(--hue), 80%, 60%, 0.4),
      0 0 80px hsla(var(--hue), 80%, 60%, 0.2);
    animation: pulse 2s ease-in-out infinite;
  }
  
  .logo-icon {
    width: 60px;
    height: 60px;
    color: white;
    animation: rotate 3s linear infinite;
  }
  
  .loading-bar {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    animation: slideUp 0.6s ease-out 0.4s backwards;
  }
  
  .loading-progress {
    height: 100%;
    background: linear-gradient(90deg, 
      hsl(var(--hue), 80%, 60%), 
      hsl(var(--hue), 70%, 70%)
    );
    border-radius: 2px;
    animation: loadProgress 2s ease-out forwards;
    box-shadow: 0 0 10px hsla(var(--hue), 80%, 60%, 0.6);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: scale(1.1);
    }
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 
        0 0 40px hsla(var(--hue), 80%, 60%, 0.4),
        0 0 80px hsla(var(--hue), 80%, 60%, 0.2);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 
        0 0 60px hsla(var(--hue), 80%, 60%, 0.6),
        0 0 100px hsla(var(--hue), 80%, 60%, 0.3);
    }
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes loadProgress {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }
  
  /* Dark mode support */
  :global(.dark) .splash-screen {
    background: linear-gradient(135deg, 
      hsl(var(--hue), 60%, 8%) 0%, 
      hsl(var(--hue), 50%, 5%) 50%, 
      hsl(var(--hue), 40%, 3%) 100%
    );
  }
</style>
