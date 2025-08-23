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
              // VS Code Custom Scrollbar System - Main + Components
              const mainScrollbar = document.getElementById('vscode-scrollbar');
              const mainThumb = document.getElementById('vscode-scrollbar-thumb');
              let mainFadeTimeout = null;
              const componentScrollbars = new Map();
              
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
                
                if (mainFadeTimeout) {
                  clearTimeout(mainFadeTimeout);
                }
                
                mainFadeTimeout = setTimeout(() => {
                  mainScrollbar.classList.remove('visible');
                }, 1000);
              }
              
              // Component scrollbar functions
              function createComponentScrollbar(element) {
                if (componentScrollbars.has(element)) return;
                
                // Make the element itself the container for the scrollbar
                element.style.position = element.style.position || 'relative';
                
                // Create scrollbar DOM elements
                const scrollbar = document.createElement('div');
                scrollbar.className = 'component-scrollbar';
                const thumb = document.createElement('div');
                thumb.className = 'component-scrollbar-thumb';
                scrollbar.appendChild(thumb);
                element.appendChild(scrollbar);
                
                let fadeTimeout = null;
                
                function updateComponentScrollbar() {
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
                  
                  // Position scrollbar directly within the element (no calculation needed)
                  scrollbar.style.top = '0px';
                }
                
                function showComponentScrollbar() {
                  scrollbar.classList.add('visible');
                  
                  if (fadeTimeout) {
                    clearTimeout(fadeTimeout);
                  }
                  
                  fadeTimeout = setTimeout(() => {
                    scrollbar.classList.remove('visible');
                  }, 1000);
                }
                
                function handleComponentScroll() {
                  updateComponentScrollbar();
                  showComponentScrollbar();
                }
                
                // Event listeners
                element.addEventListener('scroll', handleComponentScroll, { passive: true });
                window.addEventListener('resize', updateComponentScrollbar, { passive: true });
                
                componentScrollbars.set(element, {
                  scrollbar,
                  thumb,
                  update: updateComponentScrollbar,
                  show: showComponentScrollbar,
                  cleanup: () => {
                    element.removeEventListener('scroll', handleComponentScroll);
                    window.removeEventListener('resize', updateComponentScrollbar);
                    if (fadeTimeout) clearTimeout(fadeTimeout);
                    if (scrollbar.parentElement) scrollbar.parentElement.removeChild(scrollbar);
                    componentScrollbars.delete(element);
                  }
                });
                
                // Initial setup
                updateComponentScrollbar();
                
                // Auto-show when element becomes visible
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting && element.scrollHeight > element.clientHeight) {
                      setTimeout(() => showComponentScrollbar(), 200);
                    }
                  });
                });
                observer.observe(element);
              }
              
              // Initialize component scrollbars
              function initComponentScrollbars() {
                const elements = document.querySelectorAll('.violet-bloom-scrollbar');
                elements.forEach(element => {
                  // Only create scrollbar if element is actually scrollable
                  if (element.scrollHeight > element.clientHeight) {
                    createComponentScrollbar(element);
                  }
                });
              }
              
              // Main scroll handling
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
              
              // Setup component scrollbars
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                  initComponentScrollbars();
                  // Re-check after components might have loaded
                  setTimeout(initComponentScrollbars, 1000);
                });
              } else {
                initComponentScrollbars();
                setTimeout(initComponentScrollbars, 1000);
              }
              
              // Periodic check for new violet-bloom-scrollbar elements
              setInterval(() => {
                const elements = document.querySelectorAll('.violet-bloom-scrollbar');
                elements.forEach(element => {
                  if (!componentScrollbars.has(element) && element.scrollHeight > element.clientHeight) {
                    createComponentScrollbar(element);
                  }
                });
              }, 2000);
            `,
          }}
        />
      </body>
    </html>
  );
}
