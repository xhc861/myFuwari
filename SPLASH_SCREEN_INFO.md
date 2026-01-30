# Splash Screen Feature

## Overview
A cool animated splash screen has been added to the website that displays only when the site is first opened or refreshed in a browser session.

## Features
- **Session-based display**: Shows only on initial page load or refresh, not on navigation
- **Smooth animations**: 
  - Fade in effect on load
  - Pulsing logo with glow effect
  - Rotating icon animation
  - Loading progress bar
  - Fade out with scale effect on exit
- **Theme-aware**: Adapts to the site's theme color (uses CSS variable `--hue`)
- **Dark mode support**: Different gradient backgrounds for light and dark modes
- **Accessible**: Includes proper ARIA attributes

## Implementation
The splash screen is implemented as a Svelte component (`src/components/SplashScreen.svelte`) and integrated into the main layout (`src/layouts/Layout.astro`).

### How it works
1. Uses `sessionStorage` to track if the user has already visited during the current browser session
2. Displays for 2 seconds with enter animations
3. Exits with a smooth fade-out animation
4. Removes itself from the DOM after completion

## Customization
You can customize the splash screen by editing `src/components/SplashScreen.svelte`:
- **Duration**: Change the timeout values (currently 2000ms for display, 800ms for exit)
- **Colors**: Modify the gradient colors and glow effects
- **Logo**: Replace the SVG icon with your own
- **Animations**: Adjust the CSS keyframes and timing functions

## Files Modified
- `src/components/SplashScreen.svelte` (new)
- `src/layouts/Layout.astro` (updated to include splash screen)
