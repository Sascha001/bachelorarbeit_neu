// Simple global scroll handler - no React needed
let scrollTimeout = null;

function showScrollbar() {
  console.log('🟢 SHOWING scrollbar');
  document.body.classList.add('scrolling');
  
  // Clear existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
}

function hideScrollbar() {
  scrollTimeout = setTimeout(() => {
    console.log('🔴 HIDING scrollbar');
    document.body.classList.remove('scrolling');
  }, 2000);
}

function handleScroll() {
  console.log('📜 Scroll detected!');
  showScrollbar();
  hideScrollbar();
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing global scroll handler');
    
    // Listen to all scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen for scroll on all scrollable elements
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
  });
}