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
  title: "Unsicherheitsanalyse Dashboard",
  description: "Moderne Trading-Anwendung zur Analyse von Modellunsicherheit und Datenunsicherheit in AI-Handelssystemen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
        <div className="vscode-main-scrollbar" id="vscode-main-scrollbar">
          <div className="vscode-main-scrollbar-thumb" id="vscode-main-scrollbar-thumb"></div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // ===== VS CODE SCROLLBAR SYSTEM =====
              const mainScrollbar = document.getElementById('vscode-main-scrollbar');
              const mainThumb = document.getElementById('vscode-main-scrollbar-thumb');
              let mainFadeTimeout = null;
              const scrollbarElements = new Map();
              
              // MAIN PAGE SCROLLBAR
              function updateMainScrollbar() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const clientHeight = window.innerHeight;
                
                if (scrollHeight <= 0) {
                  mainScrollbar.classList.remove('visible');
                  return;
                }
                
                const ratio = clientHeight / document.documentElement.scrollHeight;
                const thumbHeight = Math.max(30, clientHeight * ratio);
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
              
              // COMPONENT/POP-UP SCROLLBARS
              function createVSCodeScrollbar(element) {
                if (scrollbarElements.has(element)) return;
                
                const isPopup = element.closest('.fixed') || element.hasAttribute('data-popup');
                const scrollbarClass = isPopup ? 'vscode-popup-scrollbar' : 'vscode-component-scrollbar';
                const thumbClass = isPopup ? 'vscode-popup-scrollbar-thumb' : 'vscode-component-scrollbar-thumb';
                
                // Ensure container has relative positioning
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.position === 'static') {
                  element.style.position = 'relative';
                }
                
                // Create scrollbar elements
                const scrollbar = document.createElement('div');
                scrollbar.className = scrollbarClass;
                const thumb = document.createElement('div');
                thumb.className = thumbClass;
                scrollbar.appendChild(thumb);
                element.appendChild(scrollbar);
                
                let fadeTimeout = null;
                
                function updateScrollbar() {
                  const scrollTop = element.scrollTop;
                  const scrollHeight = element.scrollHeight - element.clientHeight;
                  const clientHeight = element.clientHeight;
                  
                  // DEBUG: Log all values for troubleshooting
                  if (isPopup) {
                    console.log('🔧 POPUP SCROLLBAR DEBUG:', {
                      scrollTop,
                      scrollHeight,
                      clientHeight,
                      elementScrollHeight: element.scrollHeight,
                      elementClientHeight: element.clientHeight
                    });
                  }
                  
                  if (scrollHeight <= 0) {
                    scrollbar.classList.remove('visible');
                    return;
                  }
                  
                  const ratio = clientHeight / element.scrollHeight;
                  const thumbHeight = Math.max(20, clientHeight * ratio);
                  const thumbTop = (scrollTop / scrollHeight) * (clientHeight - thumbHeight);
                  
                  // DEBUG: Log positioning calculations
                  if (isPopup) {
                    console.log('🔧 THUMB POSITION CALC:', {
                      ratio,
                      thumbHeight,
                      thumbTop,
                      formula: '(' + scrollTop + ' / ' + scrollHeight + ') * (' + clientHeight + ' - ' + thumbHeight + ') = ' + thumbTop
                    });
                  }
                  
                  thumb.style.height = thumbHeight + 'px';
                  thumb.style.top = thumbTop + 'px';
                  scrollbar.style.height = clientHeight + 'px';
                  
                  // DEBUG: Log final applied styles
                  if (isPopup) {
                    console.log('🔧 APPLIED STYLES:', {
                      thumbHeight: thumb.style.height,
                      thumbTop: thumb.style.top,
                      scrollbarHeight: scrollbar.style.height
                    });
                  }
                }
                
                function showScrollbar() {
                  scrollbar.classList.add('visible');
                  
                  if (fadeTimeout) {
                    clearTimeout(fadeTimeout);
                  }
                  
                  fadeTimeout = setTimeout(() => {
                    scrollbar.classList.remove('visible');
                  }, 1000);
                }
                
                // Enhanced scroll event handler with boundary detection
                function handleScroll(event) {
                  updateScrollbar();
                  showScrollbar();
                  
                  // DEBUG: Track scroll direction for pop-ups
                  if (isPopup && event.type === 'scroll') {
                    const currentScrollTop = element.scrollTop;
                    const previousScrollTop = element._prevScrollTop || 0;
                    const direction = currentScrollTop > previousScrollTop ? 'DOWN' : 'UP';
                    element._prevScrollTop = currentScrollTop;
                    
                    console.log('🔧 SCROLL DIRECTION:', {
                      direction,
                      currentScrollTop,
                      previousScrollTop,
                      thumbElement: thumb,
                      thumbTop: thumb.style.top
                    });
                  }
                  
                  // For pop-ups: prevent page scroll at boundaries
                  if (isPopup && event.type === 'wheel') {
                    const atTop = element.scrollTop === 0;
                    const atBottom = element.scrollTop >= element.scrollHeight - element.clientHeight - 1;
                    
                    if ((atTop && event.deltaY < 0) || (atBottom && event.deltaY > 0)) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                }
                
                // Event listeners
                element.addEventListener('scroll', handleScroll, { passive: true });
                if (isPopup) {
                  element.addEventListener('wheel', handleScroll, { passive: false });
                  element.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: false });
                }
                
                // Store scrollbar data
                scrollbarElements.set(element, {
                  scrollbar,
                  thumb,
                  isPopup,
                  update: updateScrollbar,
                  show: showScrollbar,
                  cleanup: () => {
                    element.removeEventListener('scroll', handleScroll);
                    if (isPopup) {
                      element.removeEventListener('wheel', handleScroll);
                    }
                    if (fadeTimeout) clearTimeout(fadeTimeout);
                    if (scrollbar.parentElement) scrollbar.parentElement.removeChild(scrollbar);
                    scrollbarElements.delete(element);
                  }
                });
                
                // Enhanced initial setup with container layout fix
                if (isPopup) {
                  // For pop-ups: ensure proper container dimensions
                  setTimeout(() => {
                    console.log('🔧 POPUP CONTAINER DEBUG:', {
                      elementOffsetHeight: element.offsetHeight,
                      elementClientHeight: element.clientHeight,
                      elementScrollHeight: element.scrollHeight,
                      computedHeight: window.getComputedStyle(element).height,
                      parentHeight: element.parentElement?.offsetHeight
                    });
                    updateScrollbar();
                  }, 100);
                } else {
                  updateScrollbar();
                }
                
                // Auto-show for new elements
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting && element.scrollHeight > element.clientHeight) {
                      setTimeout(showScrollbar, 200);
                    }
                  });
                });
                observer.observe(element);
              }
              
              // INITIALIZATION
              function initScrollbars() {
                const elements = document.querySelectorAll('.violet-bloom-scrollbar');
                elements.forEach(element => {
                  if (element.scrollHeight > element.clientHeight) {
                    createVSCodeScrollbar(element);
                  }
                });
              }
              
              function handleMainScroll() {
                updateMainScrollbar();
                showMainScrollbar();
              }
              
              // Main page scrollbar setup
              window.addEventListener('scroll', handleMainScroll, { passive: true });
              window.addEventListener('resize', updateMainScrollbar, { passive: true });
              
              updateMainScrollbar();
              setTimeout(showMainScrollbar, 500);
              
              // Component scrollbars setup
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initScrollbars);
              } else {
                initScrollbars();
              }
              
              // Re-check periodically for new elements (reduced frequency)
              setInterval(() => {
                const elements = document.querySelectorAll('.violet-bloom-scrollbar');
                elements.forEach(element => {
                  if (!scrollbarElements.has(element) && element.scrollHeight > element.clientHeight) {
                    createVSCodeScrollbar(element);
                  }
                });
              }, 1500)
            `,
          }}
        />
      </body>
    </html>
  );
}
