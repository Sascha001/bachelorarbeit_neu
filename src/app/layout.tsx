import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif", 
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Modern dashboard with violet bloom theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
        <div className="vscode-scrollbar" id="vscode-scrollbar">
          <div className="vscode-scrollbar-thumb" id="vscode-scrollbar-thumb"></div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Universal VS Code Custom Scrollbar System
              const mainScrollbar = document.getElementById('vscode-scrollbar');
              const mainThumb = document.getElementById('vscode-scrollbar-thumb');
              let fadeTimeout = null;
              let customScrollbars = new Map();
              
              // Main page scrollbar functions
              function updateMainScrollbar() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const clientHeight = window.innerHeight;
                
                if (scrollHeight <= 0) {
                  mainScrollbar.classList.remove('visible');
                  return;
                }
                
                const ratio = clientHeight / document.documentElement.scrollHeight;
                const thumbHeight = Math.max(20, clientHeight * ratio);
                const thumbTop = (scrollTop / scrollHeight) * (clientHeight - thumbHeight);
                
                mainThumb.style.height = thumbHeight + 'px';
                mainThumb.style.top = thumbTop + 'px';
              }
              
              function showMainScrollbar() {
                mainScrollbar.classList.add('visible');
                
                if (fadeTimeout) {
                  clearTimeout(fadeTimeout);
                }
                
                fadeTimeout = setTimeout(() => {
                  mainScrollbar.classList.remove('visible');
                }, 1000);
              }
              
              // Custom scrollbar for any element
              function createCustomScrollbar(element) {
                if (customScrollbars.has(element)) return;
                
                const container = element.parentElement;
                if (!container) return;
                
                // Create scrollbar elements
                const scrollbar = document.createElement('div');
                scrollbar.className = 'custom-scrollbar';
                const thumb = document.createElement('div');
                thumb.className = 'custom-scrollbar-thumb';
                scrollbar.appendChild(thumb);
                container.appendChild(scrollbar);
                
                let elementFadeTimeout = null;
                
                function updateElementScrollbar() {
                  const scrollTop = element.scrollTop;
                  const scrollHeight = element.scrollHeight - element.clientHeight;
                  const clientHeight = element.clientHeight;
                  
                  if (scrollHeight <= 0) {
                    scrollbar.classList.remove('visible');
                    return;
                  }
                  
                  const ratio = clientHeight / element.scrollHeight;
                  const thumbHeight = Math.max(15, clientHeight * ratio);
                  const thumbTop = (scrollTop / scrollHeight) * (clientHeight - thumbHeight);
                  
                  thumb.style.height = thumbHeight + 'px';
                  thumb.style.top = thumbTop + 'px';
                  scrollbar.style.height = clientHeight + 'px';
                }
                
                function showElementScrollbar() {
                  scrollbar.classList.add('visible');
                  
                  if (elementFadeTimeout) {
                    clearTimeout(elementFadeTimeout);
                  }
                  
                  elementFadeTimeout = setTimeout(() => {
                    scrollbar.classList.remove('visible');
                  }, 1000);
                }
                
                function handleElementScroll() {
                  updateElementScrollbar();
                  showElementScrollbar();
                }
                
                element.addEventListener('scroll', handleElementScroll, { passive: true });
                
                customScrollbars.set(element, {
                  scrollbar,
                  thumb,
                  update: updateElementScrollbar,
                  show: showElementScrollbar
                });
                
                // Initial setup
                updateElementScrollbar();
                
                // Show briefly when element becomes visible
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      setTimeout(() => showElementScrollbar(), 200);
                    }
                  });
                });
                observer.observe(element);
              }
              
              // Auto-detect scrollable elements
              function initCustomScrollbars() {
                const scrollableElements = document.querySelectorAll('.violet-bloom-scrollbar, [class*="overflow"], [style*="overflow"]');
                scrollableElements.forEach(element => {
                  if (element.scrollHeight > element.clientHeight) {
                    createCustomScrollbar(element);
                  }
                });
                
                // Also check for elements that might become scrollable later
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                      const newScrollableElements = document.querySelectorAll('.violet-bloom-scrollbar, [class*="overflow"]');
                      newScrollableElements.forEach(element => {
                        if (element.scrollHeight > element.clientHeight && !customScrollbars.has(element)) {
                          createCustomScrollbar(element);
                        }
                      });
                    }
                  });
                });
                
                observer.observe(document.body, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['class', 'style']
                });
              }
              
              // Main page scroll handling
              function handleMainScroll() {
                updateMainScrollbar();
                showMainScrollbar();
              }
              
              // Initialize everything
              window.addEventListener('scroll', handleMainScroll, { passive: true });
              window.addEventListener('resize', updateMainScrollbar, { passive: true });
              
              // Setup main scrollbar
              updateMainScrollbar();
              setTimeout(() => showMainScrollbar(), 500);
              
              // Setup custom scrollbars after DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initCustomScrollbars);
              } else {
                initCustomScrollbars();
              }
              
              // Re-check periodically for dynamically added elements
              setInterval(initCustomScrollbars, 2000);
            `,
          }}
        />
      </body>
    </html>
  );
}
